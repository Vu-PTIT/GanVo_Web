import { SigninForm } from "@/components/auth/signin-form";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10 bg-gradient-purple">
      <div className="w-full max-w-sm md:max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <SigninForm />
      </div>
    </div>
  );
};

export default SignInPage;
