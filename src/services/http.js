/*eslint-disable*/

import axios from "axios";

if (
  process.env &&
  process.env.NODE_ENV &&
  process.env.NODE_ENV === "production"
)
  axios.defaults.baseURL = "https://api.campusxr.org/";
else axios.defaults.baseURL = "http://localhost:8001/";
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
