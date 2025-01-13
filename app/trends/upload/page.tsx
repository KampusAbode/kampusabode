'use client'

import React, { useState } from "react";
import { useRouter } from "next/router";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import "./uploadTrend.css";

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
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      // Upload image to storage (assuming you have a function for this)
      const imageUrl = await uploadImage(image);

      await addDoc(trendRef, {
        id: "", // Firestore will generate the ID
        title,
        description,
        author: "Author Name", // Replace with actual author name
        image: imageUrl,
        published_date: new Date().toISOString(),
        likes: 0,
        category,
      });

      setLoading(false);
      router.push("/trends");
    } catch (error) {
      console.error("Error uploading trend: ", error);
      setLoading(false);
    }
  };

  const uploadImage = async (file: File | null): Promise<string> => {
    if (!file) return "";
    // Implement your image upload logic here
    // For example, using Firebase Storage
    // Return the URL of the uploaded image
    return "https://example.com/uploaded-image-url";
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
