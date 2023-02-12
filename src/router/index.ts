import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login/index.vue"),
  },
  {
    path: "/panel/:id",
    name: "UserPanel",
    component: () => import("../views/Panel/index.vue"),
    children: [
      {
        path: "",
        name: "UserDashboard",
        component: () => import("../views/Panel/Dashboard/index.vue"),
      },
      {
        path: "project",
        name: "UserProject",
        component: () => import("../views/Panel/Project/index.vue"),
      },
      {
        path: "task",
        name: "UserTask",
        component: () => import("../views/Panel/Task/index.vue"),
      },
    ],
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
