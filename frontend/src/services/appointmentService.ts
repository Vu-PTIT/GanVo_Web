import axiosInstance from "@/lib/axios";

export const appointmentService = {
  create: (data) => axiosInstance.post("/appointments", data),
  getMine: () => axiosInstance.get("/appointments/me"),
  getAll: () => axiosInstance.get("/appointments"),
  update: (id, data) => axiosInstance.put(`/appointments/${id}`, data),
  delete: (id) => axiosInstance.delete(`/appointments/${id}`),
};
