import axiosInstance from "@/lib/axios";

export const appointmentService = {
  create: (data: any) => axiosInstance.post("/appointments", data),
  getMine: () => axiosInstance.get("/appointments/me"),
  getAll: () => axiosInstance.get("/appointments"),
  update: (id: any, data: any) => axiosInstance.put(`/appointments/${id}`, data),
  delete: (id: any) => axiosInstance.delete(`/appointments/${id}`),
};
