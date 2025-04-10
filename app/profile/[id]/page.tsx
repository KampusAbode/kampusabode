"use client";

import React, { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import {
  updateUserProfile,
  uploadImageToAppwrite,
  useProperties
} from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UserType, StudentUserInfo, AgentUserInfo } from "../../fetch/types";
import "./updateprofile.css";
import { useRouter } from "next/navigation";
import { setUser } from "../../redux/stateSlice/userSlice";
import { setUserData } from "../../redux/stateSlice/userdataSlice";
import CryptoJS from "crypto-js";

const CreateProfilePage = () => {
  const router = useRouter();
  // const user = useSelector((state: RootState) => state.user);
  const userdata = useSelector((state: RootState) => state.userdata);
  const { deleteAppwriteImage }= useProperties();
  const dispatch = useDispatch();

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
      let avatarUrl = userdata?.avatar || "";

      // If a new image is uploaded
      if (imageFile) {
        if (userdata?.avatar) {
          await deleteAppwriteImage(userdata.avatar);
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
      const updatedUserData = Object.entries(formValues || {}).reduce(
        (acc, [key, value]) => {
          if (value !== userdata[key as keyof UserType]) {
            acc[key as keyof UserType] = value;
          }
          return acc;
        },
        {} as Partial<UserType>
      );

      if (
        Object.keys(updatedUserData).length === 0 &&
        avatarUrl === userdata?.avatar
      ) {
        toast.error("No changes made.");
        setIsSubmitting(false);
        return;
      }

      // Add avatar to update if it changed
      if (avatarUrl !== userdata?.avatar) {
        updatedUserData.avatar = avatarUrl;
      }

      const response = await updateUserProfile(userdata?.id, updatedUserData);

      const newData = response.userData;

      if (response.success) {
        toast.success(`${response.message} 🎉`);

        // Encrypt and store in localStorage
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify({ newData }),
          process.env.NEXT_PUBLIC__ENCSECRET_KEY!
        ).toString();

        localStorage.setItem(
          process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY!,
          encryptedData
        );

        // Dispatch updates to Redux store
        dispatch(
          setUser({
            id: userdata?.id,
            username: newData.name,
            email: newData.email,
            userType: newData.userType,
            isAuthenticated: true,
          })
        );

        // Dispatch updates to Redux store
        dispatch(setUserData({ ...userdata, ...newData }));

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
                value={formValues?.bio || ""}
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
