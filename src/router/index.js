import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import {useAuthStore} from "../store/authStore.js";
import CreateUser from "../pages/CreateUser.vue";
import SelfApplications from "../pages/SelfApplications.vue";
import CreateApplication from "../pages/CreateApplication.vue";
import ExternalLogin from "../pages/ExternalLogin.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      notForAuthenticated: true
    }
  },
  {
    path: "/external/login",
    name: "External Login",
    component: ExternalLogin,
  },
  {
    path: "/external/sign-up",
    name: "Create User",
    component: CreateUser,
    // meta: {
    //   notForAuthenticated: true,
    // }
  },
  
  {
    path: "/applications",
    name: "SelfApplications",
    component: SelfApplications,
    meta: {
      permissions: ['canViewOwnApplications']
    },
  },
  {
    path: '/applications/create',
    name: "Create Application",
    component: CreateApplication,
    meta: {
      permissions: ['canCreateSelfApplication']
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.matched.some(record => record.meta?.permissions)) {
    if (!authStore.isAuthenticated) {
      return next({name: "Login"});
    }

    if (!to.matched.some(record => authStore.checkPermissions(record.meta?.permissions))) {
      return next({name: "Login"});
    }
  }

  if (to.matched.some(record => record.meta?.notForAuthenticated) && authStore.isAuthenticated) {
    return next({name: "Home"})
  }

  next();
});

export default router;
