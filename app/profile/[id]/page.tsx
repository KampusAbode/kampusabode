"use client";

import React, { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import {
  updateUserProfile,
  uploadImageToAppwrite,
  useProperties
} from "../../utils";
import { UserType, StudentUserInfo, AgentUserInfo } from "../../fetch/types";
import "./updateprofile.css";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../store/userStore";

const CreateProfilePage = () => {
  const router = useRouter();
  const {user, setUser}=useUserStore((state)=>state)
  const { deleteAppwriteImage }= useProperties();

  const [formValues, setFormValues] = useState<UserType>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.avatar || null
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prevState) => ({
      ...prevState,
      ...(value.trim() !== "" && { [name]: value }), // Only store non-empty values
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let avatarUrl = user?.avatar || "";

      // If a new image is uploaded
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

      // Filter out unchanged fields
      const updateduser = Object.entries(formValues || {}).reduce(
        (acc, [key, value]) => {
          if (value !== user[key as keyof UserType]) {
            acc[key as keyof UserType] = value;
          }
          return acc;
        },
        {} as Partial<UserType>
      );

      if (
        Object.keys(updateduser).length === 0 &&
        avatarUrl === user?.avatar
      ) {
        toast.error("No changes made.");
        setIsSubmitting(false);
        return;
      }

      // Add avatar to update if it changed
      if (avatarUrl !== user?.avatar) {
        updateduser.avatar = avatarUrl;
      }

      const response = await updateUserProfile(user?.id, updateduser);

      const newData = response.userData;

      if (response.success) {
        toast.success(`${response.message} 🎉`);

        // update the use store
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
          <form onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <div className="input-box">
              <label>Profile Picture</label>
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
                name="name"
                id="name"
                value={formValues?.name}
                onChange={handleInputChange}
                
              />
            </div>

            {/* Email */}
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
                placeholder={formValues?.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-box">
              <label htmlFor="bio">Bio</label>
              <textarea
                name="bio"
                id="bio"
                placeholder="Tell us about yourself"
                value={formValues?.bio || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Conditional Fields */}
            {user?.userType === "student" && (
              <div className="input-box">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="studentInfo.department"
                  value={
                    (formValues?.userInfo as StudentUserInfo).department || ""
                  }
                  onChange={handleInputChange}
                />
              </div>
            )}

            {user?.userType === "agent" && (
              <>
                <div className="input-box">
                  <label htmlFor="agencyName">Agency Name</label>
                  <input
                    type="text"
                    name="agencyName"
                    id="agencyName"
                    placeholder={
                      (formValues?.userInfo as AgentUserInfo).agencyName
                    }
                    onChange={handleInputChange}
                  />
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
