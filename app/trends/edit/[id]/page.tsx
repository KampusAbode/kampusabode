"use client";

import "./edittrend.css";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { uploadImageToAppwrite, updateTrend } from "../../../utils";
import { useUserStore } from "../../../store/userStore";
import { useTrendStore } from "../../../store/trendStore";
import { db } from "../../../lib/firebaseConfig";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Image from "next/image";
import Loader from "../../../components/loader/Loader";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import data from "../../../fetch/contents";

function EditTrend() {
  const categories = data.trendcategories;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState<File | string | null>(null);
  const [existingImage, setExistingImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const trendId: string = Array.isArray(params.id) ? params.id[0] : params.id;

  const { user } = useUserStore((state) => state);
  const getTrendById = useTrendStore((state) => state.getTrendById);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to edit a trend");
      router.push("/auth/login");
      return;
    }

    const trend = getTrendById(trendId);
    if (!trend) {
      toast.error("Trend not found");
      router.back();
      return;
    }

    setTitle(trend.title);
    setContent(trend.content);
    setCategory(trend.category);
    setExistingImage(trend.image);
    setImage(trend?.image);
    setLoading(false);
  }, [trendId, user, getTrendById]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed.");
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
      const trend = await updateTrend({
        id: trendId,
        title,
        content,
        category,
        image,
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

  if (loading) return <Loader />;

  return (
    <section className="edit-trend">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image" className="image-edit-label">
              <input
                type="file"
                id="image"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageChange}
              />
              <Image
                
                src={
                  image
                    ? typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                    : existingImage || "/assets/upload_image.jpg"
                }
                width={1000}
                height={1000}
                alt="Trend Image"
                className="edit-image-preview"
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="quill-wrapper"
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
              onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Trend"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default EditTrend;
