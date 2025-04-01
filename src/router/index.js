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
    path: "/home",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    children: [
      {
        path: "kanban",
        name: "modules-kanban",
        component: () => import("../modules/MesKanban.vue"),
      },
      {
        path: "jmreport",
        name: "jmreport",
        component: () => import("../modules/JimuReport.vue"),
      },
      {
        path: "drag",
        name: "jmbi",
        component: () => import("../modules/JimuBI.vue"),
      },
      {
        path: "erp",
        name: "erp",
        component: () => import("../modules/ERP.vue"),
      },
    ],
  },
  {
    path: "/editor",
    name: "editor",
    component: () => import("../views/QuillTestView.vue"),
  },
  {
    path: "/upload",
    name: "upload",
    component: () => import("../views/UploadTestView.vue"),
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
    return next("/home");
  }
  const token = localStorage.getItem("Authorization");
  const publicPages = ["/signIn"];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && (!token || isTokenExpired(token))) {
    return next("/signIn");
  } else if (to.path === "/signIn" && token) {
    if (to.query.redirect) {
      return next(to.query.redirect); // 重定向到原始页面
    } else {
      return next({ path: "/home" }); // 如果已经登录
    }
  } else {
    return next();
  }
});

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("Authorization");
      localStorage.removeItem("Username");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("Username");
    return true; // 如果解析失败，认为 token 已过期
  }
}

export default router;
