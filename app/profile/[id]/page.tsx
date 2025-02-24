"use client";

import React, { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { updateUserProfile } from "../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UserType, StudentUserInfo, AgentUserInfo } from "../../fetch/types";
import { Client, Storage } from "appwrite";
import './updateprofile.css'

  const client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

const CreateProfilePage = () => {
  const user = useSelector((state: RootState) => state.user);
  const userdata = useSelector((state: RootState) => state.userdata);

  const [formValues, setFormValues] = useState<UserType>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    userdata?.avatar || null
  );

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const uploadImageToAppwrite = async (): Promise<string | null> => {
    if (!imageFile) return null;

    try {
      const response = await storage.createFile(
        "your_bucket_id", // Replace with your Appwrite storage bucket ID
        imageFile.name,
        imageFile
      );

      toast.success("profile picture uploaded");

      const fileId = response.$id;
      return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&mode=admin`;
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      let avatarUrl = formValues?.avatar || "";

      if (imageFile) {
        const uploadedImageUrl = await uploadImageToAppwrite();
        if (uploadedImageUrl) {
          avatarUrl = uploadedImageUrl;
        }
      }

      const updatedUserData = {
        ...formValues,
        userInfo: {
          ...formValues?.userInfo,
          avatar: avatarUrl,
        },
      };

      const response = await updateUserProfile(userdata?.id, updatedUserData);
      if (response.success) {
        toast.success(`${response.message} 🎉`);
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
                disabled={userdata?.name !== ""}
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
                disabled={userdata?.email !== ""}
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
                value={formValues.bio || ""}
                onChange={handleInputChange}
              />
            </div>

            {/* Conditional Fields */}
            {formValues?.userType === "student" && (
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

            {formValues?.userType === "agent" && (
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
