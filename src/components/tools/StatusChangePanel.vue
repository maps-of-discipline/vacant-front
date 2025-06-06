<template>
  <div>
    <Panel header="Статус">
      <div class="flex flex-row align-items-center">
        <span class="mr-1">Текущий:</span>
        <Skeleton
          v-if="!currentStatus"
          height="1rem"
          class="w-3"
        />
        <Tag
          v-else
          :class="['status-label', AppService.getStatusClass(currentStatus.title)]"
          :value="currentStatus.verbose_name"
        />
      </div>
      <Divider />
      <p>Поменять на:</p>
      <div
        class="inline-flex flex-wrap"
        style="width: fit-content !important; max-width: max-content !important"
      >
        <!-- <Button -->
        <!--   v-for="(sts, index) in unchoosedStatuses" -->
        <!--   :key="index" -->
        <!--   size="small" -->
        <!--   :label="sts.verbose_name" -->
        <!--   class="justify-content-start p-1 mr-2 mb-2" -->
        <!--   :class="[AppService.getStatusClass(sts.title)]" -->
        <!--   @click="emit('statusUpdate', sts.title)" -->
        <!-- /> -->
        <Button
          v-for="(sts, index) in unchoosedStatuses"
          :key="index"
          size="small"
          :label="sts.verbose_name"
          class="justify-content-start p-1 mr-2 mb-2"
          :class="[AppService.getStatusClass(sts.title)]"
          @click="onStatusUpdate(sts.title)"
        />
      </div>
      <Dialog
        v-model:visible="isStatusDetailDialogVisible"
        header="Пожалуйста, выберете комментарий"
        :closable="false"
        modal
      >
        <div
          v-for="message in statusDetailMessages"
          :key="message.id"
        >
          <div class="mb-3">
            <RadioButton
              v-model="choosedMessage"
              :input-id="'message' + message.id"
              name="message"
              :value="message.id"
            />
            <label :for="'message' + message.id">{{ message.title }}</label>
          </div>
        </div>
        <div class="ml-auto w-fit">
          <Button
            class="mr-2"
            label="Сохранить"
            icon="pi pi-check"
            size="small"
            :severity="choosedMessage != null ? 'primary' : 'secondary'"
            :disabled="choosedMessage == null"
            @click="saveStatusWithMessage"
          />
          <Button
            label="Отмена"
            icon="pi pi-times"
            severity="secondary"
            size="small"
            @click="() => (isStatusDetailDialogVisible = false)"
          />
        </div>
      </Dialog>
      <!-- <div -->
      <!--   v-for="(sts, idx) in statusesWithMessages" -->
      <!--   :key="idx" -->
      <!--   class="mt-3" -->
      <!-- > -->
      <!--   <Divider /> -->
      <!--   <span>{{ sts.verbose_name }}</span> -->
      <!--   <div -->
      <!--     v-if="sts.messages?.length > 0" -->
      <!--     class="flex flex-column gap-2 mt-3" -->
      <!--   > -->
      <!--     <Button -->
      <!--       v-for="(message, index) in sts.messages" -->
      <!--       :key="index" -->
      <!--       size="small" -->
      <!--       severity="secondary" -->
      <!--       :label="message.title" -->
      <!--       class="justify-content-start p-1" -->
      <!--       @click="onStatusUpdate(sts.title, message.id)" -->
      <!--     /> -->
      <!--   </div> -->
      <!-- </div> -->
    </Panel>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, computed, defineProps, defineEmits } from 'vue';
import { Panel, Tag, Dialog, Divider, Skeleton, Button, RadioButton } from 'primevue';
import AppService from '../../services/appService.js';
import StatusService from '../../services/statusService.js';
import ApplicationService from '../../services/applicationService.js';
import Toast from '../../tools/toast.js';

const emit = defineEmits(['application-update', 'quickmessage', 'statusUpdate']);
const toast = new Toast();

const statuses = ref([]);
const isStatusDetailDialogVisible = ref(false);
const statusDetailMessages = ref([]);
const choosedMessage = ref(null);

const props = defineProps({
  status: {
    required: true,
    type: String,
  },
  application_id: {
    required: true,
    type: Number,
  },
});

const comments = defineModel('comments', {
  type: Array,
  required: true,
});

const currentStatus = computed(() => {
  if (!statuses.value || !props.status) return false;
  return statuses.value.find((el) => el.title == props.status);
});

const statusesWithMessages = computed(() => {
  if (!currentStatus.value) return statuses;
  return statuses.value.filter((el) => el.messages.length > 0);
});

const unchoosedStatuses = computed(() => {
  if (!currentStatus.value) return statuses.value;
  return statuses.value.filter((el) => el.title != currentStatus.value.title);
});

const fetchStatuses = async () => {
  const resp = await StatusService.fetchAll();
  statuses.value = resp;
};

const onStatusUpdate = async (title) => {
  const status = statuses.value.find((el) => el.title == title);
  if (status.messages.length == 0) {
    emit('statusUpdate', status.title);
    return;
  }
  choosedMessage.value = null;
  statusDetailMessages.value = status.messages;
  isStatusDetailDialogVisible.value = true;
};

const saveStatusWithMessage = async () => {
  try {
    const comment = await ApplicationService.addQuickComment(
      props.application_id,
      choosedMessage.value
    );
    comments.value.push(comment);
    isStatusDetailDialogVisible.value = false;
    toast.success('Статус обновлен');
  } catch (error) {
    toast.error('Не удаось добавить комментарий');
    throw error;
  }
};

onBeforeMount(async () => {
  await fetchStatuses();
});
</script>
