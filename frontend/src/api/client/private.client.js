import axios from "axios";
import queryString from "query-string";

const baseURL = "https://movieee-backend.vercel.app/api/v1";

const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

privateClient.interceptors.request.use(async config => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("actkn")}`
    }
  };
});

privateClient.interceptors.response.use((response) => {
  if (response && response.data) return response.data;
  return response;
}, (err) => {
  if (err.response?.status === 401) {
      // Token might be expired or invalid
      localStorage.removeItem("actkn");
      // Optionally redirect to login
      // window.location.href = "/login";
  }
  throw err?.response?.data || { message: "Something went wrong!" };

});

export default privateClient;
