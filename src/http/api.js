import axios from "axios";

export function get(url, param) {
  param = param || {};
  return axios
    .get(url, { params: param })
    .then((res) => res.data)
    .catch((err) => err);
}

export function post(url, param) {
  param = param || {};
  return axios
    .post(url, param)
    .then((res) => res.data)
    .catch((err) => err);
}
