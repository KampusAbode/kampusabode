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
import Prompt from "../../components/modals/prompt/Prompt"; // Adjust path if needed

const CreateProfilePage = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore((state) => state);
  const { deleteAppwriteImage } = useProperties();

  const [formValues, setFormValues] = useState<UserType>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.avatar || null
  );

  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingSubmit, setPendingSubmit] =
    useState<React.FormEvent<HTMLFormElement> | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prevState) => ({
      ...prevState,
      ...(value.trim() !== "" && { [name]: value }),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPendingSubmit(e);
    setShowPrompt(true);
  };

  const submitProfileUpdate = async () => {
    if (!pendingSubmit) return;

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

      const updateduser = Object.entries(formValues || {}).reduce(
        (acc, [key, value]) => {
          if (value !== user[key as keyof UserType]) {
            acc[key as keyof UserType] = value;
          }
          return acc;
        },
        {} as Partial<UserType>
      );

      if (Object.keys(updateduser).length === 0 && avatarUrl === user?.avatar) {
        toast.error("No changes made.");
        setIsSubmitting(false);
        return;
      }

      if (avatarUrl !== user?.avatar) {
        updateduser.avatar = avatarUrl;
      }

      const response = await updateUserProfile(user?.id, updateduser);

      if (response.success) {
        toast.success(`${response.message} 🎉`);
        setUser(response.userData);
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
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label style={{ textAlign: "center" }}>Profile Picture</label>
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

            <div className="input-box">
              <label htmlFor="name">Username: {user?.name}</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formValues?.name}
                placeholder={user ? user.name : "Enter new username"}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-box">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formValues?.email}
                onChange={handleInputChange}
                disabled={user?.email !== ""}
              />
            </div>

            <div className="input-box">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder={
                  user ? user.phoneNumber : "Enter your phone number"
                }
                onChange={handleInputChange}
              />
            </div>

            <div className="input-box">
              <label htmlFor="bio">Bio</label>
              <textarea
                name="bio"
                id="bio"
                placeholder={user ? user.bio : "Tell us about yourself"}
                value={formValues?.bio || ""}
                onChange={handleInputChange}
              />
            </div>

            {user?.userType === "agent" && (
              <div className="input-box">
                <label htmlFor="agencyName">Agency Name</label>
                <input
                  type="text"
                  name="agencyName"
                  id="agencyName"
                  placeholder={(user.userInfo as AgentUserInfo)?.agencyName}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <button
              className="btn"
              title="Button"
              type="submit"
              disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>

      <Prompt
        message="Are you sure you want to update your profile?"
        isOpen={showPrompt}
        onConfirm={submitProfileUpdate}
        onCancel={() => setShowPrompt(false)}
      />
    </div>
  );
};

export default CreateProfilePage;
