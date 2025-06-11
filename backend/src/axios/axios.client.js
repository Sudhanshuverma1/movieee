import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL, // https://api.themoviedb.org/3
  paramsSerializer: {
    encode: params => queryString.stringify(params)
  }
});

// ✅ Automatically attach TMDB API key
axiosClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: process.env.TMDB_KEY
  };
  return config;
}, (error) => Promise.reject(error));

// ✅ Response handling
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("❌ TMDB API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || { message: "TMDB API error" });
  }
);

export default axiosClient;
