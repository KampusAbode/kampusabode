"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import { Client, Storage, ID } from "appwrite";
import "./uploadtrend.css";
import toast from "react-hot-toast";
import { uploadImageToAppwrite } from "../../utils";
import { useUserStore } from "../../store/userStore";

const categories = [
  "Real estate market",
  "Rental market",
  "Interior design",
  "OAU updates",
  "Home Buying",
  "Football",
  "Student investment",
  "Study methods",
  "Real Estate Investment",
  "Skills",
  "Business",
];

function UploadTrend() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {user} = useUserStore((state) => state);

  const client = new Client();
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const storage = new Storage(client);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const db = getFirestore(getApp());
      const trendRef = collection(db, "trends");

      // Upload image to Appwrite storage
      const imageUrl = await uploadImageToAppwrite(
        image,
        process.env.NEXT_PUBLIC_APPWRITE_TREND_BUCKET_ID
      );

      const trendData = {
        title,
        content,
        author: user?.name || "Anonymous",
        image: imageUrl,
        published_date: new Date().toISOString(),
        likes: 0,
        category,
      };

      const docRef = await addDoc(trendRef, trendData);

      setLoading(false);
      toast.success(`${trendData.content}  uploaded`);
      router.push(`/trends/${docRef.id}`);
    } catch (error) {
      console.error("Error uploading trend: ", error);
      setLoading(false);
    }
  };

  return (
    <div className="upload-trend">
      <h2>Upload New Trend</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Trend"}
        </button>
      </form>
    </div>
  );
}

export default UploadTrend;
