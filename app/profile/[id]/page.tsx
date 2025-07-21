"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  updateUserProfile,
  uploadImageToAppwrite,
  deleteAppwriteImage,
} from "../../utils";
import { UserType, AgentUserInfo, StudentUserInfo } from "../../fetch/types";
import "./updateprofile.css";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";
import Prompt from "../../components/modals/prompt/Prompt";
import { FaP } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  agencyName?: string;
}

interface ProfileFormValues {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  bio: string;
  avatar: string;
  userInfo: StudentUserInfo | AgentUserInfo;
}

interface PageProp {
  params: {
    id: string;
  };
}

const CreateProfilePage = ({ params }: PageProp) => {
  const { id } = params;
  const router = useRouter();
  const { user, setUser } = useUserStore((state) => state);
  // const { deleteAppwriteImage } = useProperties();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(user?.avatar);

  // Initialize formValues with user data or empty defaults
  const [formValues, setFormValues] = useState<ProfileFormValues>();

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Sync formValues to user when user changes (on mount and updates)
  useEffect(() => {
    if (user && user.id === id) {
      setFormValues({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        id: user.id || "",
        userInfo:
          (user.userInfo as AgentUserInfo) ||
          (user.userInfo as StudentUserInfo),
      });
      setImagePreview(user.avatar);
    } else {
      router.back();
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let newErrors: FormErrors = { ...errors };
    // Clone formValues deeply enough
    let newFormValues: ProfileFormValues = {
      ...formValues,
      userInfo: { ...formValues?.userInfo },
    };

    switch (name) {
      case "name": {
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
        break;
      }

      case "agencyName": {
        // Only update agencyName if userInfo exists
        if (newFormValues.userInfo) {
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

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    const parts = phone.match(/^(\d{0,4})(\d{0,3})(\d{0,4})$/);
    if (!parts) return phone;
    return `+234 ${[parts[1], parts[2], parts[3]].filter(Boolean).join(" ")}`;
  };

  const validateBeforeSubmit = () => {
    let valid = true;
    let newErrors: FormErrors = {};

    if (!formValues?.name || formValues?.name.length < 3) {
      newErrors.name = "Username must be at least 3 characters";
      valid = false;
    }

    if (!formValues?.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!validateEmail(formValues?.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!formValues?.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      valid = false;
    } else if (formValues?.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateBeforeSubmit()) {
      toast.error("Please fill in the required input before submitting.", {
        id: "input-submit",
      });
      return;
    }

    setShowPrompt(true);
  };

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
          if (value !== user?.[key as keyof UserType]) {
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
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-box top">
              <label htmlFor="file">
                Select Profile Picture
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="profile-preview"
                  />
                )}
                <input
                  name="text"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                  id="file"
                  aria-describedby="file-error"
                />
                <label htmlFor="file" className="icon-label">
                  <FaPlusCircle />
                </label>
              </label>
            </div>

            <div className="input-box">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder={user ? user.name : "Enter new username"}
                value={formValues?.name || ""}
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

            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={user ? user.email : "Enter your email address"}
                value={formValues?.email || ""}
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

            <div className="input-box">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder={
                  user ? user.phoneNumber : "Enter your phone number"
                }
                value={formatPhoneNumber(formValues?.phoneNumber || "")}
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

            <div className="input-box">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                placeholder={user ? user.bio : "Tell us about yourself"}
                value={formValues?.bio || ""}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            {user?.userType === "agent" && (
              <div className="input-box">
                <label htmlFor="agencyName">Agency Name</label>
                <input
                  type="text"
                  id="agencyName"
                  name="agencyName"
                  placeholder={
                    (user.userInfo as AgentUserInfo)?.agencyName ||
                    "Enter your agency name"
                  }
                  value={
                    (formValues?.userInfo as AgentUserInfo)?.agencyName || ""
                  }
                  onChange={handleInputChange}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={isSubmitting}
              aria-busy={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>

      {showPrompt && (
        <Prompt
          isOpen={showPrompt}
          message="Are you sure you want to update your profile?"
          onConfirm={confirmUpdate}
          onCancel={() => setShowPrompt(false)}
        />
      )}
    </div>
  );
};

export default CreateProfilePage;
