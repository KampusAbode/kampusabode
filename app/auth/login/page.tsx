"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { loginUser } from "../../utils";
import Link from "next/link";
import "../auth.css";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/button/Button";
import IconButton from "../../components/button/IconButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const router = useRouter();

  const validateForm = () => {
    let formErrors = { email: "", password: "" };
    let valid = true;

    if (!email) {
      formErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Invalid email address";
      valid = false;
    }

    if (!password) {
      formErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 8) {
      formErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, password });

      if (response.message === "Email not found") {
        toast.error(response.message);
      } else {
        router.push("/profile");
        // router.refresh();
        toast.success(`${response.message} 👋`, { id: "login-successful" });
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="login">
      <div className="container">
        <div className="im">
          <Image
            priority
            src={"/assets/authimage.png"}
            width={1000}
            height={1000}
            alt="auth image"
          />
        </div>
        <div className="fm">
          <h4>Welcome back!</h4>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kampusabode@gmail.com"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-box">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="*********"
                />
                {isPasswordVisible ? (
                  <IconButton
                    type="button"
                    className="toggle-password"
                    aria-label="Toggle password visibility"
                    aria-pressed={isPasswordVisible}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  >
                    <Eye aria-hidden="true" size={20} strokeWidth={1.75} />
                  </IconButton>
                ) : (
                  <IconButton
                    type="button"
                    className="toggle-password"
                    aria-label="Toggle password visibility"
                    aria-pressed={isPasswordVisible}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  >
                    <EyeOff aria-hidden="true" size={20} strokeWidth={1.75} />
                  </IconButton>
                )}
              </div>
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <div>
              <Link
                prefetch
                href="/auth/forget-password"
                className="forget-password">
                Forget password?
              </Link>
            </div>

            <Button
              variant="primary"
              size="lg"
              title="Button"
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
          <span>
            Don't have an account?{" "}
            <Link prefetch href={"/auth/signup"}>
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
