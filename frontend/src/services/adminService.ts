// src/services/adminService.ts
import axiosInstance from "../lib/axios";
import type { User } from "../types/user";

// Interface cho Stats (đã làm ở bước trước)
export interface MonthlyStat {
    name: string;
    month: number;
    year: number;
    count: number;
}

export interface AdminStats {
    totalUsers: number;
    totalAppointments: number;
    usersByMonth: MonthlyStat[];
    appointmentsByMonth: MonthlyStat[];
}

// Interface cho Form tạo/sửa User
export interface UserFormData {
    username: string;
    email: string;
    displayName: string;
    password?: string;
}

export const adminService = {
    // --- STATS ---
    getStats: async (): Promise<AdminStats> => {
        const response = await axiosInstance.get("/users/admin/stats");
        return response.data;
    },

    // --- USER MANAGEMENT ---
    getAllUsers: async (): Promise<User[]> => {
        const response = await axiosInstance.get("/users/admin/users");
        return response.data;
    },

    createUser: async (userData: UserFormData): Promise<User> => {
        const response = await axiosInstance.post("/users/admin/users", userData);
        return response.data;
    },

    updateUser: async (id: string, userData: UserFormData): Promise<User> => {
        const response = await axiosInstance.put(`/users/admin/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/users/admin/users/${id}`);
    },
};