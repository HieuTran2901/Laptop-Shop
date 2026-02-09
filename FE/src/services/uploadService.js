import api from "./api";

const API_URL = "http://localhost:8080/api/upload";

// Upload SINGLE image
export const uploadImages = (file) => {
  const formData = new FormData();
  formData.append("files", file); // backend nhận 1 ảnh

  return api.post(`${API_URL}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
