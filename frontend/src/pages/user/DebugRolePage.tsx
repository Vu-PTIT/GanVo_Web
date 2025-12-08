import { useAuthStore } from "@/stores/useAuthStore";

export default function DebugRolePage() {
    const user = useAuthStore((state) => state.user);
    const isAdmin = useAuthStore((state) => state.isAdmin());
    const hasRole = useAuthStore((state) => state.hasRole);

    return (
        <div style={{ padding: "20px", fontFamily: "monospace" }}>
            <h1>🔍 Debug Role Information</h1>

            <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px", marginTop: "20px" }}>
                <h2>User Object:</h2>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>

            <div style={{ background: "#e3f2fd", padding: "15px", borderRadius: "8px", marginTop: "20px" }}>
                <h2>Role Checks:</h2>
                <p><strong>user?.role:</strong> {user?.role || "undefined"}</p>
                <p><strong>isAdmin():</strong> {isAdmin ? "✅ true" : "❌ false"}</p>
                <p><strong>hasRole("admin"):</strong> {hasRole("admin") ? "✅ true" : "❌ false"}</p>
                <p><strong>hasRole("user"):</strong> {hasRole("user") ? "✅ true" : "❌ false"}</p>
            </div>

            <div style={{ background: "#fff3e0", padding: "15px", borderRadius: "8px", marginTop: "20px" }}>
                <h2>Troubleshooting:</h2>
                <ol>
                    <li>Nếu <code>user?.role</code> là <code>undefined</code> → Backend không trả về role hoặc frontend chưa reload</li>
                    <li>Nếu <code>user?.role</code> là <code>"user"</code> → Cần cập nhật role trong DB và logout/login lại</li>
                    <li>Nếu <code>user?.role</code> là <code>"admin"</code> → RoleGuard có vấn đề</li>
                </ol>
                <button
                    onClick={async () => {
                        const { fetchMe } = useAuthStore.getState();
                        await fetchMe();
                        window.location.reload();
                    }}
                    style={{
                        padding: "10px 20px",
                        background: "#2196f3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginTop: "10px"
                    }}
                >
                    🔄 Reload User Data
                </button>
            </div>
        </div>
    );
}
