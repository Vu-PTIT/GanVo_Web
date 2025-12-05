import type { ReactNode } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UserRole } from "@/types/user";

interface RoleGuardProps {
    /** Danh sách các role được phép truy cập */
    allowedRoles: UserRole[];
    /** Content hiển thị khi có quyền */
    children: ReactNode;
    /** Content hiển thị khi không có quyền (optional) */
    fallback?: ReactNode;
}

/**
 * RoleGuard - Component guard để kiểm tra role trước khi render children
 * 
 * @example
 * // Chỉ admin mới thấy
 * <RoleGuard allowedRoles={["admin"]}>
 *   <AdminDashboard />
 * </RoleGuard>
 * 
 * @example
 * // Cả user và admin đều thấy
 * <RoleGuard allowedRoles={["user", "admin"]}>
 *   <UserContent />
 * </RoleGuard>
 * 
 * @example
 * // Với fallback message
 * <RoleGuard allowedRoles={["admin"]} fallback={<p>Bạn không có quyền truy cập</p>}>
 *   <AdminPanel />
 * </RoleGuard>
 */
export const RoleGuard = ({ allowedRoles, children, fallback = null }: RoleGuardProps) => {
    const user = useAuthStore((state) => state.user);

    // Chưa đăng nhập
    if (!user) {
        return <>{fallback}</>;
    }

    // Không có role hoặc role không phù hợp
    if (!user.role || !allowedRoles.includes(user.role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default RoleGuard;
