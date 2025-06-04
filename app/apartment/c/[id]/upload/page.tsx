"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useProperties } from "../../../../utils";
import { useUserStore } from "../../../../store/userStore";
import { ApartmentType } from "../../../../fetch/types";
import Prompt from "../../../../components/modals/prompt/Prompt";
import"./upload.css";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 7MB
const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB
const FRAME_COUNT = 6;

const UploadProperty = () => {
  const [mediaPreviews, setMediaPreviews] = useState<File[]>([]);
  const [promptOpen, setPromptOpen] = useState(false);
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, File[]>>({});
  const [selectedThumbnails, setSelectedThumbnails] = useState<
    Record<string, File>
  >({});

  const router = useRouter();
  const { listApartment, uploadApartmentImagesToAppwrite } = useProperties();
  const { user, addListedProperty } = useUserStore((state) => state);

  useEffect(() => {
    if (!user || user.userType !== "agent") {
      toast.error("Access denied. Only agents can upload properties.");
      router.back();
    }
  }, [user, router]);

  const locationOptions = [
    "asherifa",
    "oduduwa estate",
    "damico area",
    "ibadan road",
    "parakin estate",
    "may fair",
    "lagere",
  ];

  const typeOptions = [
    "self contained",
    "single room",
    "two bedroom",
    "three bedroom",
  ];

  const amenitiesOptions = [
    "electricity",
    "water supply",
    "internet",
    "security",
    "furnished",
    "air conditioning",
    "laundry",
    "gym",
    "study area",
    "library",
    "cafeteria",
    "sports facilities",
  ];

  // Extract thumbnails from video asynchronously
  const extractThumbnails = async (videoFile: File): Promise<File[]> => {
    const thumbnails: File[] = [];
    const url = URL.createObjectURL(videoFile);

    const video = document.createElement("video");
    video.src = url;
    video.crossOrigin = "anonymous";

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Failed to load video metadata"));
    });

    const duration = video.duration;
    const interval = duration / FRAME_COUNT;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      video.currentTime = i * interval;

      // Wait for seek to complete
      await new Promise<void>((resolve) => {
        video.onseeked = () => resolve();
      });

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Failed to get canvas context");
        continue;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg")
      );

      if (blob) {
        thumbnails.push(
          new File([blob], `${videoFile.name}-thumb-${i}.jpg`, {
            type: "image/jpeg",
          })
        );
      }
    }
    URL.revokeObjectURL(url);
    return thumbnails;
  };

  const handleMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    let finalFiles: File[] = [];
    const thumbsMap: Record<string, File[]> = {};

    for (const file of files) {
      if (file.type.startsWith("video/")) {
        if (file.size > MAX_VIDEO_SIZE) {
          toast.error(`${file.name} exceeds max video size of 5MB`);
          continue;
        }
        try {
          const thumbs = await extractThumbnails(file);
          if (thumbs.length === 0) {
            toast.error(`Could not extract thumbnails from ${file.name}`);
            continue;
          }
          thumbsMap[file.name] = thumbs;
          // Add thumbnails, not original video file
          finalFiles.push(...thumbs);
        } catch (err) {
          toast.error(`Error processing video ${file.name}`);
          console.error(err);
        }
      } else if (file.type.startsWith("image/")) {
        finalFiles.push(file);
      } else {
        toast.error(`${file.name} is unsupported file type`);
      }
    }

    const totalSize = finalFiles.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > MAX_FILE_SIZE) {
      toast.error("Total file size exceeds 7MB");
      return;
    }

    setThumbnailMap(thumbsMap);
    setMediaPreviews(finalFiles);
    setFieldValue("images", finalFiles);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string()
      .min(100, "Description must be at least 100 characters")
      .max(500, "Description cannot exceed 500 characters")
      .required("Description is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required"),
    location: Yup.string().required("Location is required"),
    neighborhood_overview: Yup.string().required(
      "Neighborhood overview is required"
    ),
    type: Yup.string().required("Property type is required"),
    bedrooms: Yup.number()
      .typeError("Bedrooms must be a number")
      .required("Bedrooms count is required"),
    bathrooms: Yup.number()
      .typeError("Bathrooms must be a number")
      .required("Bathrooms count is required"),
    area: Yup.number()
      .typeError("Area must be a number")
      .required("Area is required"),
    amenities: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one amenity")
      .required("Amenities are required"),
    images: Yup.array()
      .min(3, "At least 3 images (or thumbnails) required")
      .required("Images are required"),
    available: Yup.boolean().required("Availability is required"),
  });

  // We keep a reference to last form values for confirm
  const [formValuesToSubmit, setFormValuesToSubmit] = useState<
    null | (ApartmentType & { images: File[]; amenities: string[] })
  >(null);
  const [formHelpers, setFormHelpers] = useState<FormikHelpers<any> | null>(
    null
  );

  // Instead of submitting immediately on form submit, open prompt first
  const handleSubmit = (values: any, helpers: FormikHelpers<any>) => {
    // We transform amenities from select multiple: string[] but field is string[] - safe
    // Also convert available from string ("true"/"false") to boolean if needed
    let amenitiesArray: string[] = values.amenities;
    if (!Array.isArray(amenitiesArray)) {
      // fallback parse comma separated string if needed
      amenitiesArray = (values.amenities || "").split(",").map((a) => a.trim());
    }
    const availableBoolean =
      typeof values.available === "string"
        ? values.available === "true"
        : !!values.available;

    // Save values and helpers in state for confirm modal
    setFormValuesToSubmit({
      ...values,
      amenities: amenitiesArray,
      available: availableBoolean,
    });
    setFormHelpers(helpers);
    setPromptOpen(true);
  };

  const handleConfirm = async () => {
    if (!formValuesToSubmit || !formHelpers) return;

    formHelpers.setSubmitting(true);
    setPromptOpen(false);

    try {
      // Prepare images array starting with preferred thumbnails (if selected)
      let sortedImages = [...mediaPreviews];

      // Prepend selected thumbnails for each video file if available
      Object.entries(selectedThumbnails).forEach(([videoName, thumb]) => {
        // Remove any existing thumb for this video from sortedImages to avoid duplicates
        sortedImages = sortedImages.filter(
          (f) => f.name !== thumb.name || f !== thumb
        );
        sortedImages.unshift(thumb);
      });

      // Upload images to Appwrite
      const imageUrls = await uploadApartmentImagesToAppwrite(
        sortedImages,
        process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID || ""
      );

      const payload: ApartmentType = {
        ...formValuesToSubmit,
        images: imageUrls,
        agentId: user?.id ?? "",
        approved: false,
      };

      const response = await listApartment(payload);

      toast.success(response.success || "Property uploaded successfully");
      if (user?.userType === "agent") addListedProperty(response.id);

      formHelpers.resetForm();
      setMediaPreviews([]);
      setThumbnailMap({});
      setSelectedThumbnails({});
      router.push(response.url);
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
      formHelpers.setStatus({ error: err?.message || "Upload failed" });
    } finally {
      formHelpers.setSubmitting(false);
      setFormValuesToSubmit(null);
      setFormHelpers(null);
    }
  };

  return (
    <div className="upload-property">
      <div className="container">
        <h4>Upload New Property</h4>
        <Formik
          initialValues={{
            title: "",
            description: "",
            price: 0,
            location: "",
            neighborhood_overview: "",
            type: "",
            bedrooms: 0,
            bathrooms: 0,
            area: 0,
            amenities: [],
            images: [],
            available: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ setFieldValue, isSubmitting, status }) => (
            <>
              <Form>
                <div className="form-group">
                  <label>Upload Media</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => handleMediaChange(e, setFieldValue)}
                  />
                  <ErrorMessage
                    name="images"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Thumbnail preview and selection */}
                {Object.entries(thumbnailMap).map(([videoName, thumbs]) => (
                  <div key={videoName}>
                    <p>Select a thumbnail for: {videoName}</p>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "8px",
                        background: "#f8f8f9",
                        borderRadius: "8px",
                      }}>
                      {thumbs.map((thumb, idx) => {
                        const objectUrl = URL.createObjectURL(thumb);
                        return (
                          <img
                            key={thumb.name + idx}
                            src={objectUrl}
                            alt={`thumb-${idx}`}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: "8px",
                              border:
                                selectedThumbnails[videoName]?.name ===
                                thumb.name
                                  ? "2px solid green"
                                  : "2px solid gray",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setSelectedThumbnails((prev) => ({
                                ...prev,
                                [videoName]: thumb,
                              }))
                            }
                            onLoad={() => URL.revokeObjectURL(objectUrl)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <Field type="text" id="title" name="title" />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <Field as="textarea" id="description" name="description" />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <Field type="number" id="price" name="price" />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <Field as="select" id="location" name="location">
                    <option value="">Select Location</option>
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="neighborhood_overview">
                    Neighborhood Overview
                  </label>
                  <Field
                    as="textarea"
                    id="neighborhood_overview"
                    name="neighborhood_overview"
                  />
                  <ErrorMessage
                    name="neighborhood_overview"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="type">Property Type</label>
                  <Field as="select" id="type" name="type">
                    <option value="">Select Property Type</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="type" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label htmlFor="bedrooms">Bedrooms</label>
                  <Field type="number" id="bedrooms" name="bedrooms" />
                  <ErrorMessage
                    name="bedrooms"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bathrooms">Bathrooms</label>
                  <Field type="number" id="bathrooms" name="bathrooms" />
                  <ErrorMessage
                    name="bathrooms"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="area">Area (sqm)</label>
                  <Field type="number" id="area" name="area" />
                  <ErrorMessage name="area" component="div" className="error" />
                </div>
                <div className="form-group">
                  <label>Amenities</label>
                  <Field
                    as="select"
                    name="amenities"
                    multiple
                    size={5}
                    style={{ height: "120px" }}>
                    {amenitiesOptions.map((amenity) => (
                      <option key={amenity} value={amenity}>
                        {amenity}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="amenities"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="available">Available</label>
                  <Field as="select" id="available" name="available">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Field>
                  <ErrorMessage
                    name="available"
                    component="div"
                    className="error"
                  />
                </div>

                {status?.error && (
                  <div className="error" style={{ marginBottom: "8px" }}>
                    {status.error}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Uploading..." : "Upload Property"}
                </button>
              </Form>

              <Prompt
                isOpen={promptOpen}
                onCancel={() => setPromptOpen(false)}
                message="Are you sure you want to upload this property?"
                onConfirm={handleConfirm}
              />
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UploadProperty;
