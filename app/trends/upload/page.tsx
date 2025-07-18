"use client";

import "./uploadtrend.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { uploadTrend } from "../../utils";
import { useUserStore } from "../../store/userStore";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import data from "../../fetch/contents";

function UploadTrend() {
  const trendcategories = data.trendcategories;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(trendcategories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUserStore((state) => state);
  const [errors, setErrors] = useState({
    title: false,
    content: false,
    image: false,
    category: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed.");
        e.target.value = "";
        return;
      }

      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldErrors = {
      title: !title.trim(),
      content: !content.trim(),
      image: !image,
      category: !category.trim(),
    };

    const errorFields = Object.entries(fieldErrors)
      .filter(([_, isError]) => isError)
      .map(([field]) => field);

    if (errorFields.length > 0) {
      const fieldName =
        errorFields[0].charAt(0).toUpperCase() + errorFields[0].slice(1);
      toast.error(
        fieldName === "Image"
          ? "Please upload an image."
          : `Please enter a valid ${fieldName}.`,
        { id: "upload-error" }
      );
      return;
    }

    setLoading(true);

    try {
      const trend = await uploadTrend({
        title,
        content,
        category,
        image,
        author: user?.name || "Anonymous",
      });

      toast.success(`${trend.title} uploaded`);
      router.push(`/trends/${trend.slug}`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload trend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-trend">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image" className="image-upload-label">
              <input
                type="file"
                id="image"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageChange}
              />
              <Image
                priority
                src={image ? URL.createObjectURL(image) : "/assets/upload_image.jpg"}
                width={1000}
                height={1000}
                alt="Upload Trend Image"
                className="upload-image-preview"
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "error" : ""}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className={`quill-wrapper ${errors.content ? "quill-error" : ""}`}
              modules={{
                toolbar: [
                  [{ header: [2, false] }],
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
              className={errors.category ? "error" : ""}
              onChange={(e) => setCategory(e.target.value)}>
              {trendcategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Trend"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default UploadTrend;
