<template>
  <div>
    <Panel header="Статус">
      <div class="flex flex-row align-items-center">
        <span class="mr-1">Текущий:</span>
        <Skeleton height="1rem" class="w-3" v-if="!currentStatus"></Skeleton>
        <Tag :class="[
          'status-label',
          AppService.getStatusClass(currentStatus.title),
        ]" :value="currentStatus.verbose_name" v-else />
      </div>
      <Divider />
      <p>Поменять на:</p>
      <div class="inline-flex flex-wrap" style="width: fit-content !important; max-width: max-content !important">
        <Button v-for="status in unchoosedStatuses" size="small" :label="status.verbose_name"
          class="justify-content-start p-1 mr-2 mb-2" :class="[AppService.getStatusClass(status.title)]"
          @click="emit('statusUpdate', status.title)" />
      </div>

      <div v-for="status in statusesWithMessages" class="mt-3">
        <Divider />
        <span>{{ status.verbose_name }}</span>
        <div class="flex flex-column gap-2 mt-3" v-if="status.messages.length > 0">
          <Button size="small" severity="secondary" :label="message.title" class="justify-content-start p-1"
            v-for="message in status.messages" @click="onStatusUpdate(status.title, message.id)" />
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, computed, defineProps, defineEmits } from "vue";
import { Panel, Tag, Divider, Skeleton, Button, useToast } from "primevue";
import AppService from "../../services/appService.js";
import StatusService from "../../services/statusService.js";
import emitter from "../../eventBus.js";
import ApplicationService from "../../services/applicationService.js";

const emit = defineEmits(["application-update", "quickmessage"]);
const toast = useToast();

const statuses = ref([]);
const props = defineProps({
  status: String,
  application_id: Number,
});

const currentStatus = computed(() => {
  if (!statuses.value || !props.status) return false;
  return statuses.value.find((el) => el.title == props.status);
});

const statusesWithMessages = computed(() => {
  if (!currentStatus) return statuses;
  return statuses.value.filter((el) => el.messages.length > 0);
});

const unchoosedStatuses = computed(() => {
  if (!currentStatus) return statuses.value;
  return statuses.value.filter((el) => el.title != currentStatus.value.title);
});

const fetchStatuses = async () => {
  const resp = await StatusService.fetchAll();
  statuses.value = resp;
};

const onStatusUpdate = async (title, message_id) => {
  try {
    const comment = await ApplicationService.addQuickComment(
      props.application_id,
      message_id,
    );
    emitter.emit("comment-added", comment);
    emit('quickmessage', title);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Ошибка",
      detail: "Не удаось добавить комментарий",
      life: 3000,
    });
    throw error;
  }
};

onBeforeMount(async () => {
  await fetchStatuses();
});
</script>
