import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Tự động thêm token vào header của mỗi request nếu token tồn tại
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("⛔ Không thể kết nối máy chủ!");
      return Promise.reject(error);
    }

    const status = error.response.status;

    // 401 - Chưa login hoặc token hết hạn
    if (status === 401) {
      toast.warning("⚠ Bạn chưa đăng nhập hoặc token đã hết hạn!");
    }

    // 403 - Không đủ quyền
    if (status === 403) {
      toast.error("🔒 Bạn không có quyền thực hiện hành động này!");
    }

    // 404
    if (status === 404) {
      toast.info("🔍 Không tìm thấy dữ liệu!");
    }

    // 500
    if (status === 500) {
      toast.error("🔥 Lỗi server! Vui lòng thử lại sau!");
    }

    return Promise.reject(error);
  }
);

export default api;
