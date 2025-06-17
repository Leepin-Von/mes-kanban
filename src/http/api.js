import axios from "axios";

/**
 * 设置 axios 的默认基础 URL
 */
axios.defaults.baseURL = "/api";

/**
 * 请求拦截器
 * 在每次请求前检查本地存储中的 Authorization token 并将其添加到请求头中
 */
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 响应错误或状态码401时删除本地存储中的 Authorization token 并导航到登录页面
 */
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("Authorization");
      localStorage.removeItem("Username");
      this.$router.push("/signIn");
    }
    return Promise.reject(error);
  }
);

/**
 * 异步发送 GET 请求
 *
 * @param {string} url - 相对路径
 * @param {Object} [param={}] - 请求参数
 * @returns {Promise<Object>} - 响应数据
 */
export async function get(url, param = {}) {
  const res = await axios.get(url, { params: param });
  return res.data;
}

/**
 * 异步发送 POST 请求
 * @param {string} url 相对路径
 * @param {Object} [param={}] 请求参数
 * @returns {Promise<Object>} 响应数据
 */
export async function post(url, param = {}) {
  const res = await axios.post(url, param);
  return res.data;
}

export async function postFile(url, param = {}) {
  const res = await axios.post(url, param, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
  return res.data;
}

window.axios = axios;