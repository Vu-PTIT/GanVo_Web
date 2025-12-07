import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import "./signup-form.css";

const signUpSchema = z.object({
  firstname: z.string().min(1, "Tên bắt buộc phải có"),
  lastname: z.string().min(1, "Họ bắt buộc phải có"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm() {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { firstname, lastname, username, email, password } = data;

    await signUp(username, password, email, firstname, lastname);

    navigate("/signin");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="signup-form">

          {/* header */}
          <div className="signup-header">
            <a href="/">
              <img src="/logo.svg" alt="logo" className="signup-logo" />
            </a>
            <h1>Tạo tài khoản GanVo</h1>
            <p>Chào mừng bạn! Hãy đăng ký để bắt đầu!</p>
          </div>

          {/* firstname + lastname */}
          <div className="signup-row">
            <div className="signup-group">
              <label htmlFor="lastname">Họ</label>
              <input
                type="text"
                id="lastname"
                {...register("lastname")}
              />
              {errors.lastname && (
                <p className="signup-error">{errors.lastname.message}</p>
              )}
            </div>

            <div className="signup-group">
              <label htmlFor="firstname">Tên</label>
              <input
                type="text"
                id="firstname"
                {...register("firstname")}
              />
              {errors.firstname && (
                <p className="signup-error">{errors.firstname.message}</p>
              )}
            </div>
          </div>

          {/* username */}
          <div className="signup-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              placeholder="GanVo"
              {...register("username")}
            />
            {errors.username && (
              <p className="signup-error">{errors.username.message}</p>
            )}
          </div>

          {/* email */}
          <div className="signup-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="m@gmail.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="signup-error">{errors.email.message}</p>
            )}
          </div>

          {/* password */}
          <div className="signup-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="signup-error">{errors.password.message}</p>
            )}
          </div>

          {/* button */}
          <button type="submit" disabled={isSubmitting} className="signup-btn">
            Tạo tài khoản
          </button>

          <div className="signup-footer">
            Đã có tài khoản? <a href="/signin">Đăng nhập</a>
          </div>
        </form>

        {/* IMAGE */}
        <div className="signup-image">
          <img src="/placeholderSignUp.png" alt="sign up" />
        </div>
      </div>
    </div>
  );
}