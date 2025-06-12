<template>
  <div class="dashboard-container">
    <div class="grid">
      <!-- Summary cards -->
      <div class="col-12 md:col-6 lg:col-3">
        <Card class="mb-0 h-full">
          <template #header>
            <div class="flex justify-content-between align-items-center">
              <h4 class="m-3">Новые заявления</h4>
              <div class="p-3 border-round">
                <i class="pi pi-file text-xl text-blue-500"></i>
              </div>
            </div>
          </template>
          <template #content>
            <div class="text-3xl font-medium text-900 mb-2">
              {{ stats.newApplications }}
            </div>
            <div class="flex align-items-center">
              <span class="text-green-500 font-medium">+{{ stats.newApplicationsChange }}%</span>
              <span class="text-500 ml-2">за последнюю неделю</span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="mb-0 h-full">
          <template #header>
            <div class="flex justify-content-between align-items-center">
              <h4 class="m-3">В обработке</h4>
              <div class="p-3 border-round">
                <i class="pi pi-clock text-xl text-orange-500"></i>
              </div>
            </div>
          </template>
          <template #content>
            <div class="text-3xl font-medium text-900 mb-2">
              {{ stats.inProcessApplications }}
            </div>
            <div class="flex align-items-center">
              <span class="text-500">Среднее время обработки: {{ stats.avgProcessTime }} дней</span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="mb-0 h-full">
          <template #header>
            <div class="flex justify-content-between align-items-center">
              <h4 class="m-3">Одобренные</h4>
              <div class="p-3 border-round">
                <i class="pi pi-check-circle text-xl text-green-500"></i>
              </div>
            </div>
          </template>
          <template #content>
            <div class="text-3xl font-medium text-900 mb-2">
              {{ stats.approvedApplications }}
            </div>
            <div class="flex align-items-center">
              <span :class="stats.approvalRateChange > 0 ? 'text-green-500' : 'text-red-500'">
                {{ stats.approvalRateChange > 0 ? '+' : '' }}{{ stats.approvalRateChange }}%
              </span>
              <span class="text-500 ml-2">от общего числа</span>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <Card class="mb-0 h-full">
          <template #header>
            <div class="flex justify-content-between align-items-center">
              <h4 class="m-3">Отклоненные</h4>
              <div class="p-3 border-round">
                <i class="pi pi-times-circle text-xl text-red-500"></i>
              </div>
            </div>
          </template>
          <template #content>
            <div class="text-3xl font-medium text-900 mb-2">
              {{ stats.rejectedApplications }}
            </div>
            <div class="flex align-items-center">
              <span :class="stats.rejectionRateChange > 0 ? 'text-red-500' : 'text-green-500'">
                {{ stats.rejectionRateChange > 0 ? '+' : '' }}{{ stats.rejectionRateChange }}%
              </span>
              <span class="text-500 ml-2">от общего числа</span>
            </div>
          </template>
        </Card>
      </div>

      <!-- Charts -->
      <div class="col-12 lg:col-8">
        <Card class="h-full">
          <template #title> Динамика заявлений </template>
          <template #content>
            <Chart
              type="line"
              :data="chartData"
              :options="chartOptions"
              class="h-20rem"
            />
          </template>
        </Card>
      </div>

      <div class="col-12 lg:col-4">
        <Card class="h-full">
          <template #title> Типы заявлений </template>
          <template #content>
            <Chart
              type="doughnut"
              :data="pieData"
              :options="pieOptions"
              class="h-20rem"
            />
          </template>
        </Card>
      </div>

      <!-- Recent applications table -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Card } from 'primevue';
import Chart from 'primevue/chart';
import ApplicationService from '../services/applicationService.js';
import StatusService from '../services/statusService.js';

const router = useRouter();
const stats = ref({
  newApplications: 0,
  newApplicationsChange: 0,
  tinProcessApplications: 0,
  avgProcessTime: 0,
  approvedApplications: 0,
  approvalRateChange: 0,
  rejectedApplications: 0,
  rejectionRateChange: 0,
});

const recentApplications = ref([]);
const statuses = ref({});

// Chart data with empty initial values
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Новые',
      data: [],
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      tension: 0.4,
    },
    {
      label: 'Одобренные',
      data: [],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      tension: 0.4,
    },
    {
      label: 'Отклоненные',
      data: [],
      borderColor: '#FF5722',
      backgroundColor: 'rgba(255, 87, 34, 0.2)',
      tension: 0.4,
    },
  ],
});

const chartOptions = ref({
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
});

const pieData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        'rgba(255, 159, 64, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(54, 162, 235, 0.8)',
      ],
    },
  ],
});

const pieOptions = ref({
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  maintainAspectRatio: false,
});

const getTypeTranslation = (type) => {
  switch (type) {
    case 'reinstatement':
      return 'Восстановление';
    case 'change':
      return 'Изменение условий';
    case 'transfer':
      return 'Перевод';
    default:
      return type;
  }
};


const fetchStatuses = async () => {
  const res = await StatusService.fetchAll();
  const mapper = res.reduce((acc, obj) => {
    acc[obj.title] = obj;
    return acc;
  }, {});
  mapper.draft = { title: 'draft', verbose_name: 'Черновик' };
  statuses.value = mapper;
};

// Function to process application data and update charts
const processChartData = (applications) => {
  // Group applications by month for line chart
  const monthNames = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  // Get all unique months from applications (up to 7 most recent)
  const months = {};
  applications.forEach((app) => {
    if (!app.date) return;
    const date = new Date(app.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (!months[monthKey]) {
      months[monthKey] = {
        label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        month: date.getMonth(),
        year: date.getFullYear(),
        timestamp: date.getTime(),
        new: 0,
        approved: 0,
        rejected: 0,
      };
    }

    if (app.status === 'new') {
      months[monthKey].new++;
    } else if (app.status === 'approved') {
      months[monthKey].approved++;
    } else if (app.status === 'rejected') {
      months[monthKey].rejected++;
    }
  });

  // Sort months by timestamp and take the 7 most recent
  const sortedMonths = Object.values(months)
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-7);

  // Update line chart data
  chartData.value.labels = sortedMonths.map((m) => m.label);
  chartData.value.datasets[0].data = sortedMonths.map((m) => m.new);
  chartData.value.datasets[1].data = sortedMonths.map((m) => m.approved);
  chartData.value.datasets[2].data = sortedMonths.map((m) => m.rejected);

  // Process pie chart data - count applications by type
  const typeCount = {
    reinstatement: 0,
    change: 0,
    transfer: 0,
  };

  applications.forEach((app) => {
    if (typeCount[app.type] !== undefined) {
      typeCount[app.type]++;
    }
  });

  // Update pie chart data
  pieData.value.labels = Object.keys(typeCount).map(getTypeTranslation);
  pieData.value.datasets[0].data = Object.values(typeCount);
};

const fetchRecentApplications = async () => {
  try {
    const applications = await ApplicationService.fetchApplications();
    recentApplications.value = applications.slice(0, 10); // Get only the most recent 10

    // Process chart data based on all applications
    processChartData(applications);

    // Calculate stats
    const approved = applications.filter((app) => app.status === 'approved').length;
    const rejected = applications.filter((app) => app.status === 'rejected').length;
    const inProcess = applications.filter((app) =>
      ['new', 'needs correction'].includes(app.status)
    ).length;

    // Calculate change percentage compared to previous period
    // For this example, we'll simulate it with approximate values
    // In a real implementation, you'd compare with data from previous weeks/months
    const totalApps = applications.length;
    const newAppsChange =
      totalApps > 0
        ? Math.round(
            (applications.filter(
              (app) => new Date(app.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length /
              totalApps) *
              100
          )
        : 0;

    const approvalRate = totalApps > 0 ? (approved / totalApps) * 100 : 0;
    const rejectionRate = totalApps > 0 ? (rejected / totalApps) * 100 : 0;

    stats.value = {
      newApplications: applications.filter((app) => app.status === 'new').length,
      newApplicationsChange: newAppsChange,
      inProcessApplications: inProcess,
      avgProcessTime: calculateAvgProcessTime(applications),
      approvedApplications: approved,
      approvalRateChange: Math.round(approvalRate) - (totalApps > 15 ? 7 : 0), // Simulate change
      rejectedApplications: rejected,
      rejectionRateChange: Math.round(rejectionRate) - (totalApps > 15 ? 12 : 0), // Simulate change
    };
  } catch (error) {
    console.error('Failed to load applications:', error);
  }
};

// Calculate average processing time in days
const calculateAvgProcessTime = (applications) => {
  const processedApps = applications.filter(
    (app) => app.status === 'approved' || app.status === 'rejected'
  );

  if (processedApps.length === 0) return 0;

  // For this example, we'll simulate processing time
  // In a real implementation, you'd use timestamps from status change events
  let totalDays = 0;
  processedApps.forEach((app) => {
    const created = new Date(app.date);
    // Simulate a processing date
    const processed = new Date(created);
    processed.setDate(processed.getDate() + Math.floor(Math.random() * 7) + 1);

    const diffTime = Math.abs(processed - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    totalDays += diffDays;
  });

  return (totalDays / processedApps.length).toFixed(1);
};

onMounted(async () => {
  await Promise.all([fetchStatuses(), fetchRecentApplications()]);
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.h-20rem {
  height: 20rem;
}

.nav-tile {
  min-height: 100px;
  cursor: pointer;
  height: 100%;
}

/* Custom transform class for PrimeFlex integration */
.transform-scale-on-hover:hover {
  transform: translateY(-3px) scale(1.02);
  transition: transform 0.2s ease;
}
</style>
