"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { updateUserProfile } from "../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./updateprofile.css";
import { UserType, StudentUserInfo, AgentUserInfo } from "../../fetch/types";

const CreateProfilePage = () => {
  const user = useSelector((state: RootState) => state.user);
  const userdata = useSelector((state: RootState) => state.userdata);

  const [formValues, setFormValues] = useState<UserType>({
    id: userdata.id || "",
    name: userdata.name || "",
    email: userdata.email || "",
    userType: userdata.userType || "",
    userInfo: userdata.userInfo || ({} as StudentUserInfo | AgentUserInfo),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    userType: "student",
    studentInfo: { department: "", phoneNumber: "" },
    agentInfo: { agencyName: "", phoneNumber: "" },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes("studentInfo") || name.includes("agentInfo")) {
      const [group, field] = name.split(".");
      setFormValues((prevState) => ({
        ...prevState,
        userInfo: {
          ...prevState.userInfo,
          [field]: value,
        },
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
      studentInfo: { department: "", phoneNumber: "" },
      agentInfo: { agencyName: "", phoneNumber: "" },
    };
    let isValid = true;

    if (!formValues.name) {
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
      const studentInfo = formValues.userInfo as StudentUserInfo;
      if (!studentInfo.department) {
        formErrors = {
          ...formErrors,
          studentInfo: {
            ...formErrors.studentInfo,
            department: "Department is required",
          },
        };
        isValid = false;
      }
    }

    if (formValues.userType === "agent") {
      const agentInfo = formValues.userInfo as AgentUserInfo;
      const phonePattern = /^[0-9]+$/;
      if (!agentInfo.agencyName) {
        formErrors = {
          ...formErrors,
          agentInfo: {
            ...formErrors.agentInfo,
            agencyName: "Agency name is required",
          },
        };
        isValid = false;
      }
      if (!agentInfo.phoneNumber || !phonePattern.test(agentInfo.phoneNumber)) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateUserProfile(userdata?.id, formValues);
      response.success && toast.success(`${response.message} 🎉`);
    } catch (error: any) {
      toast.error(
        error.message || "An unexpected error occurred during update."
      );
    }
    setIsSubmitting(false);
  };

  return (
    <div className="update">
      <div className="container">
        <div className="fm">
          <h4>Upload profile</h4>
          <form onSubmit={handleSubmit}>
            {/* Common Fields */}
            <div className="input-box">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Enter your username"
                disabled={userdata?.name !== ""}
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
                value={formValues.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                disabled={userdata?.email !== ""}
              />
              {errors?.email && <span className="error">{errors?.email}</span>}
            </div>

            {/* Conditional Form Fields for Students */}
            {formValues.userType === "student" && (
              <div className="input-box">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="studentInfo.department"
                  value={
                    (formValues.userInfo as StudentUserInfo).department || ""
                  }
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
            {formValues.userType === "agent" && (
              <>
                <div className="input-box">
                  <label htmlFor="agencyName">Agency Name</label>
                  <input
                    type="text"
                    name="agencyName"
                    id="agencyName"
                    value={
                      (formValues.userInfo as AgentUserInfo).agencyName || ""
                    }
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
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={
                      (formValues.userInfo as AgentUserInfo).phoneNumber || ""
                    }
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

            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"} 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePage;