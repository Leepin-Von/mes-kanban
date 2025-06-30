export default [
  {
    path: "/approval/prptpre/:preNum",
    name: "prptpre",
    component: () => import("@/views/approval/PRptPreView.vue"), // 请假单
  },
  {
    path: "/approval/sealApply/:paperNo",
    name: "sealApply",
    component: () => import("@/views/approval/SealApplyView.vue"), // 印鉴申请单
  },
  {
    path: "/approval/subDemense/:paperNo",
    name: "subDemense",
    component: () => import("@/views/approval/SubDemenseView.vue"), // 原物料领料通知单
  },
];
