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
      {
        path: "vform_designer",
        name: "vFromDesigner",
        component: () => import("../modules/VFormDesigner.vue"),
      },
      {
        path: "share",
        name: "biShare",
        component: () => import("@/modules/BiShare.vue"),
      },
    ],
  },
  {
    path: "/home/share/:pageName",
    name: "sharedPage",
    component: () => import("@/components/bi/DynamicPageLoader.vue"),
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
  // {
  //   path: "/approval/:paperNo",
  //   name: "approvalTest",
  //   component: () => import("../views/ApprovalCenterTestView.vue"),
  // },
  {
    path: "/approval/prptpre/:preNum",
    name: "prptpre",
    component: () => import("../views/approval/PRptPreView.vue"),
  },
  {
    path: "/approval/sealApply/:paperNo",
    name: "sealApply",
    component: () => import("@/views/approval/SealApplyView.vue"),
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
  const adminOnlyRoutes = ["/home/jmreport", "/home/drag", "/home/vform_designer"];
  const authRequired = !publicPages.includes(to.path) /*&& !to.path.startsWith("/approval")*/;
  const adminRequired = adminOnlyRoutes.includes(to.path);
  const isAdmin = localStorage.getItem("Username") === "ADMIN";

  if (authRequired && (!token || isTokenExpired(token))) {
    const preToPath = to.path;
    localStorage.setItem("preToPath", preToPath);
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
