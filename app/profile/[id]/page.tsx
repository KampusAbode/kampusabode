"use client";

import React, { useState } from "react";

import { toast } from "react-hot-toast";
import { signupUser, updateUserProfile } from "../../utils";
import "../auth.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { userAgent } from "next/server";

type UserSignupInput = {
  username: string;
  email: string;
  userType: "student" | "agent";
  studentInfo: {
    department: string;
  };
  agentInfo: {
    agencyName: string;
    phoneNumber: string;
  };
};

const CreateProfilePage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user) as {
    isAuthenticated: boolean;
    email: string;
    id: string;
    username: string;
    userType: string;
  };

  const [formValues, setFormValues] = useState<UserSignupInput>({
    username: "",
    email: "",
    userType: "student",
    studentInfo: { department: "" },
    agentInfo: { agencyName: "", phoneNumber: "" },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    userType: "student",
    studentInfo: { department: "" },
    agentInfo: { agencyName: "", phoneNumber: "" },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("studentInfo") || name.includes("agentInfo")) {
      const [group, field] = name.split(".");
      setFormValues((prevState) => ({
        ...prevState,
        [group]: { ...prevState[group], [field]: value },
      }));
    } else {
      setFormValues((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const validateForm = () => {
    let formErrors = {
      username: "",
      email: "",
      userType: "student",
      studentInfo: { department: "" },
      agentInfo: { agencyName: "", phoneNumber: "" },
    };
    let isValid = true;

    if (!formValues.username) {
      formErrors.username = "Username is required";
      isValid = false;
    }

    if (!formValues.email) {
      formErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      formErrors.email = "Invalid email address";
      isValid = false;
    }

    if (formValues.userType === "student") {
      if (!formValues.studentInfo.department) {
        formErrors = {
          ...formErrors,
          studentInfo: {
            ...formErrors.studentInfo,
            department: "Program is required",
          },
        };
        isValid = false;
      }
    }

    if (formValues.userType === "agent") {
      const phonePattern = /^[0-9]+$/;
      if (!formValues.agentInfo.agencyName) {
        formErrors = {
          ...formErrors,
          agentInfo: {
            ...formErrors.agentInfo,
            agencyName: "Agency name is required",
          },
        };
        isValid = false;
      }
      if (
        !formValues.agentInfo.phoneNumber ||
        !phonePattern.test(formValues.agentInfo.phoneNumber)
      ) {
        formErrors = {
          ...formErrors,
          agentInfo: {
            ...formErrors.agentInfo,
            phoneNumber: "Please enter a valid phone number",
          },
        };
        isValid = false;
      }
    }

    setErrors(formErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateUserProfile(user.id, formValues);
      response.success && toast.success(`${response.message} 🎉`);
    
    } catch (error) {
      toast.error(
        error.message || "An unexpected error occurred during signup."
      );
    }
    setIsSubmitting(false);
  };

  return (
    <div className="signup">
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
          <h4>Upload profile</h4>
          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div className="input-box">
              <label htmlFor="username">User name</label>
              <input
                type="text"
                name="username"
                id="username"
                value={formValues.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
              />
              {errors?.username && (
                <span className="error">{errors?.username}</span>
              )}
            </div>

            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={user.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
              />
              {errors?.email && <span className="error">{errors?.email}</span>}
            </div>

            {/* User Type Selection */}
            <div className="input-box">
              <label htmlFor="userType">Sign up as</label>
              <select
                name="userType"
                id="userType"
                value={user.userType}
                disabled>
                <option value="student">Student</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            {/* Conditional Form Fields for Students */}
            {user.userType === "student" && (
              <div className="input-box">
                <label htmlFor="studentInfo.department">Department</label>
                <input
                  type="text"
                  id="studentInfo.department"
                  name="studentInfo.department"
                  value={formValues.studentInfo.department}
                  onChange={handleInputChange}
                  placeholder="Your current department"
                />
                {errors?.studentInfo.department && (
                  <span className="error">
                    {errors?.studentInfo.department}
                  </span>
                )}
              </div>
            )}

            {/* Conditional Form Fields for Agents */}
            {user.userType === "agent" && (
              <>
                <div className="input-box">
                  <label htmlFor="agentInfo.agencyName">Agency Name</label>
                  <input
                    type="text"
                    name="agentInfo.agencyName"
                    id="agentInfo.agencyName"
                    value={formValues.agentInfo.agencyName}
                    onChange={handleInputChange}
                    placeholder="Enter your agency's name"
                  />
                  {errors?.agentInfo.agencyName && (
                    <span className="error">
                      {errors?.agentInfo.agencyName}
                    </span>
                  )}
                </div>

                <div className="input-box">
                  <label htmlFor="agentInfo.phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    name="agentInfo.phoneNumber"
                    id="agentInfo.phoneNumber"
                    value={formValues.agentInfo.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                  {errors?.agentInfo.phoneNumber && (
                    <span className="error">
                      {errors?.agentInfo.phoneNumber}
                    </span>
                  )}
                </div>
              </>
            )}

            <button className={"btn"} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </form>

          <span>
            Have an account already? <Link href={"/auth/login"}>Log In</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;
