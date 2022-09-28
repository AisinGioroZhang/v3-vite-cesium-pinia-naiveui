import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import homeVue from "../Pages/home/home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: homeVue,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
