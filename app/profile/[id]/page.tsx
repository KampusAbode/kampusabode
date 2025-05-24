"use client";

import React, { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import {
  updateUserProfile,
  uploadImageToAppwrite,
  useProperties,
} from "../../utils";
import { UserType, AgentUserInfo } from "../../fetch/types";
import "./updateprofile.css";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";
import Prompt from "../../components/modals/prompt/Prompt"; // Ensure path is correct

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  agencyName?: string;
}

const CreateProfilePage = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore((state) => state);
  const { deleteAppwriteImage } = useProperties();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.avatar || null
  );

  // Initialize form with user's existing data or empty strings
  const [formValues, setFormValues] = useState<UserType>();

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Helper: email validation regex
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle form input changes with validation
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Clone previous errors and values
    let newErrors: FormErrors = { ...errors };
    let newFormValues: UserType = { ...formValues };

    switch (name) {
      case "name": {
        // Remove spaces, only allow letters, numbers, underscore
        const noSpaces = value.replace(/\s/g, "");
        if (!/^[a-zA-Z0-9_]*$/.test(noSpaces)) {
          newErrors.name =
            "Username can only contain letters, numbers, and underscores";
        } else if (noSpaces.length > 0 && noSpaces.length < 3) {
          newErrors.name = "Username must be at least 3 characters";
        } else {
          delete newErrors.name;
        }
        newFormValues.name = noSpaces;
        break;
      }

      case "email": {
        const trimmed = value.trim();
        newFormValues.email = trimmed;
        if (trimmed && !validateEmail(trimmed)) {
          newErrors.email = "Invalid email format";
        } else {
          delete newErrors.email;
        }
        break;
      }

      case "phoneNumber": {
        // Allow digits only, trim leading '234', max 10 digits stored
        let digitsOnly = value.replace(/\D/g, "").replace(/^234/, "");
        digitsOnly = digitsOnly.slice(0, 10);
        newFormValues.phoneNumber = digitsOnly;

        if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
          newErrors.phoneNumber = "Phone number must be exactly 10 digits";
        } else {
          delete newErrors.phoneNumber;
        }
        break;
      }

      case "bio": {
        newFormValues.bio = value;
        // Optional validation can be added here if needed
        break;
      }

      case "agencyName": {
        if ("agencyName" in newFormValues.userInfo) {
          (newFormValues.userInfo as AgentUserInfo).agencyName = value;
        }
        break;
      }

      default:
        break;
    }

    setFormValues(newFormValues);
    setErrors(newErrors);
  };

  // Format phone number for display: +234 XXX XXX XXXX
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const parts = phone.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!parts) return phone;
    return `+234 ${[parts[1], parts[2], parts[3]].filter(Boolean).join(" ")}`;
  };

  // Final validation before submit
  const validateBeforeSubmit = () => {
    let valid = true;
    let newErrors: FormErrors = {};

    if (!formValues.name || formValues.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters";
      valid = false;
    }

    if (!formValues.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(formValues.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!formValues.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      valid = false;
    } else if (formValues.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateBeforeSubmit()) {
      toast.error("Please fix errors before submitting.");
      return;
    }

    setShowPrompt(true);
  };

  // Called when user confirms update in prompt
  const confirmUpdate = async () => {
    setShowPrompt(false);
    setIsSubmitting(true);

    try {
      let avatarUrl = user?.avatar || "";

      if (imageFile) {
        if (user?.avatar) {
          await deleteAppwriteImage(user.avatar);
        }
        const uploadedImageUrl = await uploadImageToAppwrite(
          imageFile,
          process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID
        );
        if (uploadedImageUrl) {
          avatarUrl = uploadedImageUrl;
        }
      }

      const updatedUser = Object.entries(formValues || {}).reduce(
        (acc, [key, value]) => {
          if (value !== user[key as keyof UserType]) {
            acc[key as keyof UserType] = value;
          }
          return acc;
        },
        {} as Partial<UserType>
      );

      if (Object.keys(updatedUser).length === 0 && avatarUrl === user?.avatar) {
        toast.error("No changes made.");
        setIsSubmitting(false);
        return;
      }

      if (avatarUrl !== user?.avatar) {
        updatedUser.avatar = avatarUrl;
      }

      const response = await updateUserProfile(user?.id, updatedUser);
      const newData = response.userData;

      if (response.success) {
        toast.success(`${response.message} 🎉`);
        setUser(newData);
        router.push("/profile");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="profile-update">
      <div className="container">
        <div className="fm">
          <h4>Upload Profile</h4>
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-box">
              <label style={{ textAlign: "center", paddingLeft: "0rem" }}>
                Profile Picture
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="profile-preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* Username */}
            <div className="input-box">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder={user ? user.name : "Enter new username"}
                value={formValues.name}
                onChange={handleInputChange}
                autoComplete="username"
                aria-describedby="name-error"
              />
              {errors.name && (
                <span className="input-error" id="name-error" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={user? user.email : "Enter your email address"}
                value={formValues.email}
                onChange={handleInputChange}
                disabled={!!user?.email}
                autoComplete="email"
                aria-describedby="email-error"
              />
              {errors.email && (
                <span className="input-error" id="email-error" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone Number */}
            <div className="input-box">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder={
                  user ? user.phoneNumber : "Enter your phone number"
                }
                value={formatPhoneNumber(formValues.phoneNumber)}
                onChange={handleInputChange}
                autoComplete="tel"
                aria-describedby="phone-error"
              />
              {errors.phoneNumber && (
                <span className="input-error" id="phone-error" role="alert">
                  {errors.phoneNumber}
                </span>
              )}
            </div>

            {/* Bio */}
            <div className="input-box">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                placeholder={user ? user.bio : "Tell us about yourself"}
                value={formValues.bio}
                onChange={handleInputChange}
                rows={4}
              />
              {errors.bio && (
                <span className="input-error" id="bio-error" role="alert">
                  {errors.bio}
                </span>
              )}
            </div>

            {/* Agency Name */}
            {user?.userType === "agent" && (
              <div className="input-box">
                <label htmlFor="agencyName">Agency Name</label>
                <input
                  type="text"
                  id="agencyName"
                  name="agencyName"
                  placeholder={
                    user && user.userType === "agent"
                      ? (user.userInfo as AgentUserInfo).agencyName
                      : "Enter your agency name"
                  }
                  value={
                    user?.userType === "agent"
                      ? (formValues.userInfo as AgentUserInfo)?.agencyName || ""
                      : ""
                  }
                  onChange={handleInputChange}
                />
                {errors.agencyName && (
                  <span className="input-error" id="agencyName-error" role="alert">
                    {errors.agencyName}
                  </span>
                )}
              </div>
            )}

            {/* Submit Button */}

            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation prompt */}
      <Prompt
        isOpen={showPrompt}
        message="Are you sure you want to update your profile?"
        onConfirm={confirmUpdate}
        onCancel={() => setShowPrompt(false)}
      />
    </div>
  );
};

export default CreateProfilePage;
