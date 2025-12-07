import type { ReactNode } from "react";
import { RoleGuard } from "./RoleGuard";

interface RequireAdminProps {
    /** Content hiển thị khi user là admin */
    children: ReactNode;
    /** Content hiển thị khi không phải admin (optional) */
    fallback?: ReactNode;
}


export const RequireAdmin = ({ children, fallback }: RequireAdminProps) => {
    return (
        <RoleGuard allowedRoles={["admin"]} fallback={fallback}>
            {children}
        </RoleGuard>
    );
};

export default RequireAdmin;
