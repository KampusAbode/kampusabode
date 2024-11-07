"use client";

import { useState } from "react";
// import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { loginUser } from "../../utils/api";
import { useRouter } from "next/navigation"; // Import useRouter for client-side redirection
import Link from "next/link";
import "../auth.css";
// import { setUser } from "../../redux/stateSlice/userSlice";
import Image from "next/image";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  // const dispatch = useDispatch();
  const router = useRouter(); // Initialize the useRouter hook for navigation

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, password });

      // Show success toast
      
      if (response.message == 'Email not found') {
        toast.error(response.message);
        
      } else {
        toast.success(`${response.message} 👌`);
        
      }


      // Refresh the page
      window.location.reload()
      
    } catch (error) {
      // Show error toast
      toast.error(error.message || "An unexpected error occurred.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="login">
      <div className="container">
        <div className="im">
          <Image
            src={"/assets/authimage.png"}
            width={1000}
            height={1000}
            alt="auth image"
          />
        </div>
        <div className="fm">
          <h4>Login with your account</h4>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input-box">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>

            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
          <span>
            Don't have an account? <Link href={"/auth/signup"}>Sign Up</Link>{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
