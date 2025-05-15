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
  {
    path: "/approval_helper",
    name: "approvalHelper",
    component: () => import("../components/erp/ToApprovalCenterTestComponent.vue"),
  },
  {
    path: "/approval/:paperNo",
    name: "approval",
    component: () => import("../views/ApprovalCenterView.vue"),
  },
  {
    path: "/vform_designer",
    name: "vfromDesigner",
    component: () => import("../views/VFormDesignView.vue"),
  }
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
  const adminOnlyRoutes = ["/home/jmreport", "/home/drag"];
  const authRequired = !publicPages.includes(to.path) && !to.path.startsWith("/approval/");
  const adminRequired = adminOnlyRoutes.includes(to.path);
  const isAdmin = localStorage.getItem("Username") === "ADMIN";

  if (authRequired && (!token || isTokenExpired(token))) {
    return next("/signIn");
  } else if (to.path === "/signIn" && token) {
    if (to.query.redirect) {
      return next(to.query.redirect);
    } else {
      return next({ path: "/home" });
    }
  } else if (adminRequired && !isAdmin) {
    Vue.prototype.$notify.error({
      message: `员工【${localStorage.getItem("Username")}】无权限访问此页面，请联系管理员！`,
      title: "警告",
    });
    return next("/home");
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
