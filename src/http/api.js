import axios from "axios";

axios.defaults.baseURL = "/api";

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('Authorization');
      this.$router.push('/signIn');
    }
    return Promise.reject(error);
  }
);

export async function get(url, param = {}) {
  const res = await axios.get(url, { params: param });
  return res.data;
}

export async function post(url, param = {}) {
  const res = await axios.post(url, param);
  return res.data;
}
