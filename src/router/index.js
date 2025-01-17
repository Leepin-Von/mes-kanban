import Vue from "vue";
import VueRouter from "vue-router";
import { jwtDecode } from "jwt-decode";

Vue.use(VueRouter);

const routes = [
  {
    path: "/signIn",
    name: "signIn",
    component: () => import("../views/SignInView.vue"),
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

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/") {
    next("/signIn");
  }
  const token = localStorage.getItem("Authorization");
  const publicPages = ["/signIn"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && (!token || isTokenExpired(token))) {
    if (to.path !== "/signIn") {
      next({ path: "/signIn", query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else if (to.path === "/signIn" && token) {
    if (to.query.redirect) {
      next(to.query.redirect); // 重定向到原始页面
    } else {
      next({ path: "/kanban" }); // 如果已经登录
    }
  } else {
    next();
  }
});

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    if (localStorage.getItem("Authorization") === token) {
      localStorage.removeItem("Authorization");
      if (localStorage.getItem("Username")) {
        localStorage.removeItem("Username");
      }
    }
    return true; // 如果解析失败，认为 token 已过期
  }
}

export default router;
