import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import "./signin-form.css"

const signInSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({ className, ...props }: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { username, password } = data;
    await signIn(username, password);

    const user = useAuthStore.getState().user;
    const role = user?.role || "user";

    if (role === "admin") {
      navigate("/admin/appointments");
    } else if (role === "user") {
      navigate("/appointment");
    } else {
      // Unknown role — fallback to home
      navigate("/");
    }
  };

  return (
    <div className={cn("signin-container", className)} {...props}>
      <div className="signin-card">
        <form onSubmit={handleSubmit(onSubmit)} className="signin-form">

          {/* logo */}
          <div className="signin-header">
            <a href="/">
              <img src="/logo.svg" alt="logo" className="signin-logo" />
            </a>

            <h1>Chào mừng quay lại</h1>
            <p>Đăng nhập vào tài khoản GanVo của bạn</p>
          </div>

          {/* username */}
          <div className="signin-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              placeholder="GanVo"
              {...register("username")}
            />
            {errors.username && (
              <p className="signin-error">{errors.username.message}</p>
            )}
          </div>

          {/* password */}
          <div className="signin-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="signin-error">{errors.password.message}</p>
            )}
          </div>

          {/* button */}
          <button type="submit" disabled={isSubmitting} className="signin-btn">
            Đăng nhập
          </button>

          <div className="signin-footer">
            Chưa có tài khoản?{" "}
            <a href="/signup">Đăng ký</a>
          </div>

        </form>

        <div className="signin-image">
          <img src="/placeholder.png" alt="image" />
        </div>
      </div>
    </div>
  );
}