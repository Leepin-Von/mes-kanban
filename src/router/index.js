import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/signIn",
  },
  {
    path: "/signIn",
    name: "login",
    component: LoginView,
  },
  {
    path: "/kanban",
    name: "kanban",
    component: () => import("../views/KanbanView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("Authorization");
  const publicPages = ["/signIn"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !token) {
    next("/signIn");
  } else {
    next();
  }
});

export default router;
