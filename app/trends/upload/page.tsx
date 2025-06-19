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
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";


const categories = [
  "Trending",
  "School updates",
  "Events",
  "Sports",
  "Music & Entertainment",
  "Football",
  "Tech & Innovations",
  "Departments",
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

  function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  }

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

      const slug = generateSlug(title);

      const trendData = {
        slug
        title,
        content,
        author: user?.name || "Anonymous",
        image: imageUrl,
        published_date: new Date().toISOString(),
        category,
      };

      const docRef = await addDoc(trendRef, trendData);

      setLoading(false);
      toast.success(`${trendData.content}  uploaded`);
      router.push(`/trends/${docRef.slug}`);
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
          <label htmlFor="content">Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["clean"],
              ],
            }}
            formats={[
              "header",
              "bold",
              "italic",
              "underline",
              "list",
              "bullet",
            ]}
          />
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
