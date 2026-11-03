"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { notify } from "@/app/lib/notifications/notify";
import { signupUser } from "../../utils";
import "../auth.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { uploadImageToAppwrite } from "../../utils"; // Appwrite upload function
import { UserType } from "../../fetch/types";
import data from "../../fetch/contents";
import { sendEmailVerification } from "firebase/auth";
import { Button } from "../../components/button/Button";
import IconButton from "../../components/button/IconButton";

export type UserSignupInput = {
  username: string;
  email: string;
  password: string;
  userType: "student" | "agent";
  university: string;
  avatar: string;
  phoneNumber: string;
  referralCode?: string;
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
    referralCode: "",
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
        notify.error("Failed to upload profile picture.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await signupUser({ ...formValues, avatar: avatarUrl });
      // ✅ Send email verification
      if (response?.user) {
        await sendEmailVerification(response.user);
      }
      notify.success(`${response.message} 🎉`, { id: "email-sent" });
      router.push("/auth/verify-email");
      // router.push("/auth/login");
    } catch (error: any) {
      notify.error(error.message || "An unexpected error occurred.");
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
          <h4>Let's get started!</h4>
          <form onSubmit={handleSubmit}>
            <div className="input-box upload-image">
              <label htmlFor="avatar">
                Avatar
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  aria-describedby="file-error"
                />
                <Image
                  priority
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : "/assets/upload_avatar.jpg"
                  }
                  alt="Avatar Preview"
                  width={800}
                  height={800}
                  className="avatar-preview"
                />
              </label>
            </div>

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
                  <IconButton
                    type="button"
                    className="toggle-password"
                    aria-label="Hide password"
                    aria-pressed={isPasswordVisible}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  >
                    <Eye aria-hidden="true" size={20} strokeWidth={1.75} />
                  </IconButton>
                ) : (
                  <IconButton
                    type="button"
                    className="toggle-password"
                    aria-label="Show password"
                    aria-pressed={isPasswordVisible}
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                  >
                    <EyeOff aria-hidden="true" size={20} strokeWidth={1.75} />
                  </IconButton>
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

            <div className="input-box">
              <label htmlFor="referralCode">Referral Code (optional)</label>
              <input
                type="text"
                name="referralCode"
                value={formValues.referralCode}
                onChange={handleInputChange}
                placeholder="Enter referral code if you have one"
              />
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

            <Button
              variant="primary"
              size="lg"
              type="submit"
              title="Button"
              disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
          <span>
            Already have an account?{" "}
            <Link prefetch href={"/auth/login"}>
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
