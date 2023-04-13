import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login/index.vue"),
  },
  {
    path: "/details",
    name: "UserDetails",
    component: () => import("../views/Details/index.vue"),
  },
  {
    path: "/chat",
    name: "UserChat",
    component: () => import("../views/Chat/index.vue"),
  },
  {
    path: "/notes",
    name: "UserNotes",
    component: () => import("../views/Notes/index.vue"),
  },
  {
    path: "/panel",
    name: "UserPanel",
    component: () => import("../views/Panel/index.vue"),
  },
  {
    path: "/profile",
    name: "UserProfile",
    component: () => import("../views/Profile/index.vue"),
  },
  {
    path: "/desk/:id",
    name: "UserDesk",
    component: () => import("../views/Desk/index.vue"),
    props: true,
  },
  {
    path: "/task/:id",
    name: "UserTask",
    component: () => import("../views/Task/index.vue"),
    props: true,
  },
  {
    path: "/project/:id",
    name: "UserProject",
    component: () => import("../views/Project/index.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
