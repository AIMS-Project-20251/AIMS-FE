import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api", // Nginx sẽ proxy cái này sang Backend port 3000
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để log lỗi nếu có (tùy chọn)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
