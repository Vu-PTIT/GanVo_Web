// src/services/dashboardService.ts
import axiosInstance from "../lib/axios";

export interface DashboardStats {
    matchesThisMonth: number;
    matchesThisYear: number;
    appointmentsCreated: number;
    messagesSent: number;
}

export interface DashboardChartData {
    name: string;
    month?: number;
    year?: number;
    matches: number;
    appointments: number;
}

export interface ActivityItem {
    id?: string;
    type: string;
    user: string;
    action: string;
    time: string;
    createdAt: string;
    icon?: string;
    color?: string;
}

export interface DashboardOverviewResponse {
    stats: DashboardStats;
    chartData: DashboardChartData[];
    activities: ActivityItem[];
}

export const dashboardService = {
    getOverview: async (): Promise<DashboardOverviewResponse> => {
        const response = await axiosInstance.get("/dashboard/overview");
        return response.data;
    }
};
