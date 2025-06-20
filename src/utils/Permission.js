import { get } from "@/http/api";
import Vue from "vue";

export async function hasPermission(paperNo) {
  try {
    const res = await get(`/approval/${paperNo}`);
    if (res.code === 200) {
      const permissionEmps = res.data;
      const currentUser = localStorage.getItem("Username");

      if (Array.isArray(permissionEmps) && permissionEmps.includes(currentUser)) {
        return true;
      } else {
        Vue.prototype.$notify.error({
          title: "出错",
          message: "没有权限访问该单据",
        });
        return false;
      }
    } else {
      Vue.prototype.$notify.error({
        title: "出错",
        message: res.message,
      });
      return false;
    }
  } catch (err) {
    Vue.prototype.$notify.error({
      title: "出错",
      message: err,
    });
    return false;
  }
}
