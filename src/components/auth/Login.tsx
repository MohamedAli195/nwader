import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import Cookies from "js-cookie";

import { useLoginMutation } from "../../app/features/authApi";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { setCredentials } from "../../app/features/auth/authSlice";
interface LoginFormInputs {
  email: string;
  password: string;
}
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (formData: LoginFormInputs) => {
    try {
      const response = await login(formData).unwrap();
      console.log(response); // يحتوي على access_token فقط

      const token = response.access_token;

      if (token) {
        Cookies.set("access_token", token, { expires: 7 }); // ✅ حفظ التوكن الصحيح

        // إذا لم تكن تملك بيانات user حالياً من API
        dispatch(setCredentials({ access_token: token }));

        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          الصفحة الرئسية
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              تسجيل الدخول
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div>
                <Label>
                  البريد الالكتروني <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="info@gmail.com"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
              <div>
                <Label>
                  كلمة المرور <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="ادخل كلمة المرور"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    أبقني مسجلاً الدخول
                  </span>
                </div>
              </div>
              <div>
                <Button className="w-full" size="sm" disabled={isLoading}>
                  {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
