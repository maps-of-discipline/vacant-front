import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import { useAuthStore } from '../store/authStore.js';
import CreateUser from '../pages/CreateUser.vue';
import SelfApplications from '../pages/SelfApplications.vue';
import CreateApplication from '../pages/CreateApplication.vue';
import EditApplication from '../pages/EditApplication.vue';
import ExternalLogin from '../pages/ExternalLogin.vue';
import Rups from '../pages/Rups.vue';
import Profile from '../pages/Profile.vue';
import Applications from '../pages/Applications.vue';
import ProcessApplication from '../pages/ProcessApplication.vue';
import Dashboard from '../pages/Dashboard.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      permissions: [],
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      permissions: ['canViewDashboard'],
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      // notForAuthenticated: true,
    },
  },
  {
    path: '/external/login',
    name: 'External Login',
    component: ExternalLogin,
  },
  {
    path: '/external/sign-up',
    name: 'Create User',
    component: CreateUser,
    meta: {
      notForAuthenticated: true,
    },
  },
  {
    path: '/applications/all',
    name: 'Applications',
    component: Applications,
    meta: {
      permissions: ['canViewApplicationsList'],
    },
  },
  {
    path: '/applications/process/:id',
    name: 'Process application',
    component: ProcessApplication,
    props: true,
    meta: {
      permissions: ['canViewProcessApplication'],
    },
  },
  {
    path: '/applications',
    name: 'SelfApplications',
    component: SelfApplications,
    meta: {
      permissions: ['canViewOwnApplications'],
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      permissions: ['canViewProfile'],
    },
  },
  {
    path: '/applications/create',
    name: 'Create Application',
    component: CreateApplication,
    meta: {
      permissions: ['canCreateSelfApplication'],
    },
  },
  {
    path: '/applications/edit/:id',
    name: 'Edit application',
    component: EditApplication,
    props: true,
    meta: {
      permissions: ['canEditOwnApplications'],
    },
  },

  {
    path: '/applications/process/rups',
    name: 'Rups',
    component: Rups,
    meta: {
      permissions: ['canViewRups'],
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  if (to.matched.some((record) => record.meta?.permissions)) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'Login' });
    }

    if (!to.matched.some((record) => authStore.checkPermissions(record.meta?.permissions))) {
      return next({ name: 'Home' });
    }
  }

  if (to.matched.some((record) => record.meta?.notForAuthenticated) && authStore.isAuthenticated) {
    return next({ name: 'Home' });
  }

  next();
});

export default router;
