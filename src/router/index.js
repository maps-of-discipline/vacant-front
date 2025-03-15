import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Login from "../pages/Login.vue";
import {useAuthStore} from "../store/authStore.js";

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

  if (to.path === '/login' && authStore.isAuthenticated) {
    return next({name: "Home"})
  }

  next();
});

export default router;
