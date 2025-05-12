"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { signupUser } from "../../utils";
import "../auth.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { uploadImageToAppwrite } from "../../utils"; // Appwrite upload function
import { UserType } from "../../fetch/types";
import data from "../../fetch/contents";

export type UserSignupInput = {
  username: string;
  email: string;
  password: string;
  userType: "student" | "agent";
  university: string;
  avatar: string;
  phoneNumber: string;
  studentInfo?: {
    department: string;
    currentYear: string;
  };
  agentInfo?: {
    agencyName: string;
  };
};

const SignupPage = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState<UserSignupInput>({
    username: "",
    email: "",
    password: "",
    userType: "student",
    avatar: "",
    phoneNumber: "",
    university: "",
    studentInfo: { department: "", currentYear: "" },
    agentInfo: { agencyName: "" },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prevState) => {
      if (name.includes(".")) {
        const [group, field] = name.split(".");
        return {
          ...prevState,
          [group]: {
            ...(prevState as any)[group],
            [field]: value,
          },
        };
      }
      return { ...prevState, [name]: value };
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let avatarUrl = formValues.avatar;

    if (avatarFile) {
      try {
        avatarUrl = await uploadImageToAppwrite(
          avatarFile,
          process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID || ""
        );
      } catch (error) {
        toast.error("Failed to upload profile picture.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await signupUser({ ...formValues, avatar: avatarUrl });
      toast.success(`${response.message} 🎉`);
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup">
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
          <h4>Sign up to start your journey</h4>
          <form onSubmit={handleSubmit}>
            {/* <div className="input-box">
              <label htmlFor="avatar">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div> */}

            <div className="input-box">
              <label htmlFor="username">User name</label>
              <input
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
              />
            </div>

            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
              />
            </div>

            <div className="input-box">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                />
                {isPasswordVisible ? (
                  <FaEye
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    className="toggle-password"
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    className="toggle-password"
                  />
                )}
              </div>
            </div>

            <div className="input-box">
              <label htmlFor="university">University</label>
              <select
                name="university"
                value={formValues.university}
                onChange={handleInputChange}>
                <option value="">Select University</option>
                {data.universities.map((uni) => (
                  <option key={uni} value={uni}>
                    {uni}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-box">
              <label htmlFor="userType">Sign up as</label>
              <select
                name="userType"
                value={formValues.userType}
                onChange={handleInputChange}>
                <option value="student">Student</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            {formValues.userType === "agent" && (
              <div className="input-box">
                <label htmlFor="agentInfo.agencyName">Agency Name</label>
                <input
                  type="text"
                  name="agentInfo.agencyName"
                  value={formValues.agentInfo?.agencyName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your agency's name"
                />
              </div>
            )}

            <button
              type="submit"
              className="btn"
              title="button"
              disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <span>
            Already have an account? <Link href={"/auth/login"}>Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
