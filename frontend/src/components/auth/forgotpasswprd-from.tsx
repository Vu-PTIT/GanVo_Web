import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
// import { useAuthStore } from "@/stores/useAuthStore"; // Có thể không cần nếu store không có hàm forgotPassword
// import { useNavigate } from "react-router"; // Có thể không cần nếu không chuyển hướng ngay lập tức

// Schema chỉ cần trường email
const forgotPasswordSchema = z.object({
  email: z.email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  // Thay thế bằng logic cần thiết, ví dụ: const { forgotPassword } = useAuthStore();
  // Nếu có useNavigate, hãy giữ lại
  // const navigate = useNavigate(); 
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Hàm xử lý khi submit form
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const { email } = data;

    // TODO: GỌI BACKEND ĐỂ GỬI EMAIL ĐẶT LẠI MẬT KHẨU
    console.log("Gửi yêu cầu đặt lại mật khẩu cho email:", email);
    // await forgotPassword(email);

    // TODO: Sau khi gọi backend thành công, thông báo cho người dùng và có thể chuyển hướng
    // navigate("/message/check-email");
  };

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a
                  href="/"
                  className="mx-auto block w-fit text-center"
                >
                  <img
                    src="/logo.svg"
                    alt="logo"
                  />
                </a>

                <h1 className="text-2xl font-bold">Quên Mật khẩu</h1>
                <p className="text-muted-foreground text-balance">
                  Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                </p>
              </div>

              {/* email */}
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="email"
                  className="block text-sm"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="m@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* nút gửi yêu cầu */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                Gửi Yêu cầu Đặt lại
              </Button>

              <div className="text-center text-sm">
                Nhớ mật khẩu rồi?{" "}
                <a
                  href="/signin"
                  className="underline underline-offset-4"
                >
                  Đăng nhập
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
      <div className=" text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
        Chúng tôi sẽ gửi một liên kết đặt lại mật khẩu đến email này.
      </div>
    </div>
  );
}