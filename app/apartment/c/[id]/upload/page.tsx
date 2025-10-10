"use client";

import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  listApartment,
  uploadApartmentImagesToAppwrite,
} from "../../../../utils";
import { useUserStore } from "../../../../store/userStore";
import { ApartmentType } from "../../../../fetch/types";
import data from "../../../../fetch/contents";
import Prompt from "../../../../components/modals/prompt/Prompt";
import "./upload.css";
import { validateWithYupAndToast } from "../../../../utils/validateWithYupAndToast";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB total images+thumbs
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB per video
const FRAME_COUNT = 15;
const THUMB_EXTRACT_TIMEOUT = 10_000; // 10s per video (safety)

const UploadProperty: React.FC = () => {
  const [mediaPreviews, setMediaPreviews] = useState<File[]>([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [promptOpen, setPromptOpen] = useState(false);
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, File[]>>({});
  const [thumbnailUrlsMap, setThumbnailUrlsMap] = useState<
    Record<string, string[]>
  >({});
  const [selectedThumbnails, setSelectedThumbnails] = useState<
    Record<string, File>
  >({});
  const [selectedThumbnailUrls, setSelectedThumbnailUrls] = useState<
    Record<string, string>
  >({});

  const router = useRouter();
  const { user, addListedProperty } = useUserStore((state) => state);

  // keep refs to revoke urls on unmount
  const createdObjectUrls = useRef<string[]>([]);

  useEffect(() => {
    console.log("UploadProperty mounted");
    if (!user || user.userType !== "agent") {
      console.warn("Access denied: non-agent attempted to view upload page", {
        user,
      });
      toast.error("Access denied. Only agents can upload properties.");
      try {
        router.back();
      } catch (e) {
        console.error("router.back failed:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    return () => {
      console.log(
        "UploadProperty unmounting: revoking object URLs",
        createdObjectUrls.current.length
      );
      for (const url of createdObjectUrls.current) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.warn("Failed to revoke object URL on unmount", e);
        }
      }
      createdObjectUrls.current = [];
    };
  }, []);

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

  // SAFE helper to create and track object URLs (so we can revoke later)
  const createObjectUrl = (file: File) => {
    const url = URL.createObjectURL(file);
    createdObjectUrls.current.push(url);
    console.debug("Created object URL for file", { name: file.name, url });
    return url;
  };

  // Extract thumbnails from a video file with error handling & timeout
  const extractThumbnails = async (videoFile: File): Promise<File[]> => {
    console.groupCollapsed(`⏳ extractThumbnails start: ${videoFile.name}`);
    const thumbnails: File[] = [];
    const url = createObjectUrl(videoFile);

    return new Promise<File[]>((resolve, reject) => {
      const video = document.createElement("video");
      let timeoutId: number | null = null;
      let resolved = false;

      const cleanUp = () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
          timeoutId = null;
        }
        video.onloadedmetadata = null as any;
        video.onerror = null as any;
        video.onseeked = null as any;
      };

      video.crossOrigin = "anonymous";
      video.preload = "metadata";
      video.src = url;

      video.onerror = (e) => {
        cleanUp();
        if (!resolved) {
          resolved = true;
          try {
            URL.revokeObjectURL(url);
          } catch (e) {}
          console.error(
            `Failed to load video metadata for ${videoFile.name}`,
            e
          );
          toast.error(`Failed to load video ${videoFile.name}.`);
          console.groupEnd();
          reject(
            new Error(`Failed to load video metadata for ${videoFile.name}`)
          );
        }
      };

      video.onloadedmetadata = async () => {
        const duration = video.duration;
        if (!duration || !isFinite(duration)) {
          cleanUp();
          try {
            URL.revokeObjectURL(url);
          } catch (e) {}
          console.error(
            `Video ${videoFile.name} has invalid duration:`,
            duration
          );
          toast.error(`Video ${videoFile.name} appears to be corrupted.`);
          console.groupEnd();
          return reject(
            new Error(`Video ${videoFile.name} has invalid duration`)
          );
        }

        const interval = duration / Math.max(1, FRAME_COUNT);
        let frameIndex = 1;

        timeoutId = window.setTimeout(() => {
          cleanUp();
          if (!resolved) {
            resolved = true;
            try {
              URL.revokeObjectURL(url);
            } catch (e) {}
            toast.error(`Thumbnail extraction timed out for ${videoFile.name}`);
            console.error(
              `Thumbnail extraction timed out for ${videoFile.name}`
            );
            console.groupEnd();
            reject(
              new Error(`Thumbnail extraction timed out for ${videoFile.name}`)
            );
          }
        }, THUMB_EXTRACT_TIMEOUT);

        const seekAndCapture = async () => {
          try {
            for (; frameIndex <= FRAME_COUNT; frameIndex++) {
              const time = Math.min(duration - 0.1, frameIndex * interval);
              video.currentTime = time;
              await new Promise<void>((seekResolve, seekReject) => {
                const onseek = () => seekResolve();
                const onerror = () => seekReject(new Error("Seek error"));
                video.onseeked = onseek;
                video.onerror = onerror;
              });

              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth || 320;
              canvas.height = video.videoHeight || 240;
              const ctx = canvas.getContext("2d");
              if (!ctx) {
                console.warn(
                  "Canvas context not available for frame",
                  frameIndex
                );
                continue;
              }
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              const blob: Blob | null = await new Promise((res) =>
                canvas.toBlob(res, "image/jpeg")
              );

              if (blob) {
                const thumbFile = new File(
                  [blob],
                  `${videoFile.name}-thumb-${frameIndex}.jpg`,
                  { type: "image/jpeg" }
                );
                thumbnails.push(thumbFile);
                console.debug("Extracted thumbnail", {
                  video: videoFile.name,
                  thumb: thumbFile.name,
                  index: frameIndex,
                });
              }
            }
            cleanUp();
            try {
              URL.revokeObjectURL(url);
            } catch (e) {}
            if (!resolved) {
              resolved = true;
              console.log(
                `✅ extractThumbnails finished for ${videoFile.name}. Thumbnails: ${thumbnails.length}`
              );
              toast.success(`Thumbnails ready for ${videoFile.name}`);
              console.groupEnd();
              resolve(thumbnails);
            }
          } catch (err) {
            cleanUp();
            try {
              URL.revokeObjectURL(url);
            } catch (e) {}
            if (!resolved) {
              resolved = true;
              console.error("Error during thumbnail extraction", err);
              toast.error(`Error processing ${videoFile.name}`);
              console.groupEnd();
              reject(err);
            }
          }
        };

        seekAndCapture();
      };
    });
  };

  // keep URLs in sync with file arrays (and revoke previous ones)
  const buildPreviewUrlsForFiles = (
    files: File[],
    setter: (urls: string[]) => void,
    previousUrls: string[]
  ) => {
    for (const u of previousUrls) {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {
        console.warn("Failed to revoke previous preview URL", e);
      }
    }
    const urls = files.map((f) => createObjectUrl(f));
    setter(urls);
  };

  // handle file input changes (images + videos)
  const handleMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    console.groupCollapsed("📁 handleMediaChange triggered");
    try {
      const inputFiles = e.target.files ? Array.from(e.target.files) : [];
      console.debug(
        "Files selected:",
        inputFiles.map((f) => ({ name: f.name, size: f.size, type: f.type }))
      );
      if (inputFiles.length === 0) {
        console.groupEnd();
        return;
      }

      const newImageFiles = [...mediaPreviews];
      const newVideoFiles = [...videoFiles];
      const newThumbMap = { ...thumbnailMap };
      const newThumbnailUrlsMap = { ...thumbnailUrlsMap };

      for (const file of inputFiles) {
        if (file.type.startsWith("video/")) {
          if (file.size > MAX_VIDEO_SIZE) {
            console.warn("Video too large", {
              name: file.name,
              size: file.size,
            });
            toast.error(`${file.name} exceeds max video size of 20MB`);
            continue;
          }
          try {
            toast.loading(`Processing video ${file.name}...`, {
              id: `video-process-${file.name}`,
            });
            const thumbs = await extractThumbnails(file);
            toast.dismiss(`video-process-${file.name}`);
            if (!thumbs || thumbs.length === 0) {
              toast.error(`Could not extract thumbnails from ${file.name}`);
              newVideoFiles.push(file);
              continue;
            }
            newThumbMap[file.name] = thumbs;
            newThumbnailUrlsMap[file.name] = thumbs.map((t) =>
              createObjectUrl(t)
            );
            newVideoFiles.push(file);
            console.log(`Thumbnails extracted and stored for ${file.name}`, {
              count: thumbs.length,
            });
          } catch (err: any) {
            toast.dismiss(`video-process-${file.name}`);
            console.error("extractThumbnails error:", err);
            toast.error(
              `Error processing video ${file.name}: ${err?.message || "unknown error"}`
            );
            // still add video so user can upload video without thumbs
            newVideoFiles.push(file);
          }
        } else if (file.type.startsWith("image/")) {
          newImageFiles.push(file);
          console.debug("Image queued for upload", file.name);
        } else {
          console.warn("Unsupported file type", file.name, file.type);
          toast.error(`${file.name} is unsupported file type`);
        }
      }

      const totalSize = [...newImageFiles, ...newVideoFiles].reduce(
        (acc, f) => acc + f.size,
        0
      );
      if (totalSize > MAX_FILE_SIZE) {
        console.warn("Total selected size exceeds limit", { totalSize });
        toast.error(
          "Total file size exceeds 10MB. Please select smaller files or fewer files."
        );
        console.groupEnd();
        return;
      }

      setThumbnailMap(newThumbMap);
      setThumbnailUrlsMap(newThumbnailUrlsMap);
      setMediaPreviews(newImageFiles);
      buildPreviewUrlsForFiles(
        newImageFiles,
        setMediaPreviewUrls,
        mediaPreviewUrls
      );
      setVideoFiles(newVideoFiles);
      buildPreviewUrlsForFiles(
        newVideoFiles,
        setVideoPreviewUrls,
        videoPreviewUrls
      );

      setFieldValue("images", newImageFiles);
      toast.success("Media selected and processed");
      console.log("Media selection updated", {
        images: newImageFiles.length,
        videos: newVideoFiles.length,
      });
    } catch (err: any) {
      console.error("handleMediaChange error:", err);
      toast.error(err?.message || "Error handling selected files.");
    } finally {
      try {
        (e.target as HTMLInputElement).value = "";
      } catch (e) {}
      console.groupEnd();
    }
  };

  const removeMediaFile = (
    index: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    console.groupCollapsed("removeMediaFile");
    try {
      const updatedPreviews = [...mediaPreviews];
      const updatedPreviewUrls = [...mediaPreviewUrls];

      const fileToRemove = updatedPreviews[index];
      const urlToRemove = updatedPreviewUrls[index];

      if (!fileToRemove) {
        console.warn("No file at index to remove", index);
        console.groupEnd();
        return;
      }

      updatedPreviews.splice(index, 1);
      updatedPreviewUrls.splice(index, 1);

      try {
        if (urlToRemove) URL.revokeObjectURL(urlToRemove);
      } catch (e) {
        console.warn("Failed to revoke preview URL", e);
      }

      setMediaPreviews(updatedPreviews);
      setMediaPreviewUrls(updatedPreviewUrls);

      setFieldValue("images", updatedPreviews);
      toast.success("Image removed");
      console.log("Image removed", {
        removed: fileToRemove.name,
        remaining: updatedPreviews.length,
      });
    } catch (err) {
      console.error("removeMediaFile error:", err);
      toast.error("Unable to remove image");
    } finally {
      console.groupEnd();
    }
  };

  const removeVideoFile = (index: number) => {
    console.groupCollapsed("removeVideoFile");
    try {
      const updatedVideos = [...videoFiles];
      const updatedVideoUrls = [...videoPreviewUrls];

      const videoToRemove = updatedVideos[index];
      const urlToRemove = updatedVideoUrls[index];

      if (!videoToRemove) {
        console.warn("No video at index to remove", index);
        console.groupEnd();
        return;
      }

      const newThumbsMap = { ...thumbnailMap };
      const newThumbUrlsMap = { ...thumbnailUrlsMap };
      delete newThumbsMap[videoToRemove.name];
      const removedThumbUrls = newThumbUrlsMap[videoToRemove.name] || [];
      delete newThumbUrlsMap[videoToRemove.name];

      for (const u of removedThumbUrls) {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {
          console.warn("Failed to revoke thumb url", e);
        }
      }

      const newSelectedThumbs = { ...selectedThumbnails };
      const newSelectedThumbUrls = { ...selectedThumbnailUrls };
      delete newSelectedThumbs[videoToRemove.name];
      const urlToDel = newSelectedThumbUrls[videoToRemove.name];
      if (urlToDel) {
        try {
          URL.revokeObjectURL(urlToDel);
        } catch (e) {
          console.warn("Failed to revoke selected thumb url", e);
        }
      }
      delete newSelectedThumbUrls[videoToRemove.name];

      updatedVideos.splice(index, 1);
      updatedVideoUrls.splice(index, 1);

      try {
        if (urlToRemove) URL.revokeObjectURL(urlToRemove);
      } catch (e) {
        console.warn("Failed to revoke video preview url", e);
      }

      setVideoFiles(updatedVideos);
      setVideoPreviewUrls(updatedVideoUrls);
      setThumbnailMap(newThumbsMap);
      setThumbnailUrlsMap(newThumbUrlsMap);
      setSelectedThumbnails(newSelectedThumbs);
      setSelectedThumbnailUrls(newSelectedThumbUrls);

      toast.success("Video removed");
      console.log("Video removed", {
        name: videoToRemove.name,
        remaining: updatedVideos.length,
      });
    } catch (err) {
      console.error("removeVideoFile error:", err);
      toast.error("Unable to remove video");
    } finally {
      console.groupEnd();
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string()
      .min(50, "Description must be at least 50 characters")
      .max(1500, "Description cannot exceed 1500 characters")
      .required("Description is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required")
      .min(50000, "Price must be at least ₦50,000"),
    location: Yup.string().required("Location is required"),
    neighborhood_overview: Yup.string()
      .min(50, "Overview must be at least 50 characters")
      .max(1500, "Overview cannot exceed 1500 characters")
      .required("Neighborhood overview is required"),
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

  const [formValuesToSubmit, setFormValuesToSubmit] = useState<
    null | (ApartmentType & { images: File[]; amenities: string[] })
  >(null);
  const [formHelpers, setFormHelpers] = useState<FormikHelpers<any> | null>(
    null
  );

  const handleSubmit = (values: any, helpers: FormikHelpers<any>) => {
    console.groupCollapsed("handleSubmit invoked");
    try {
      // transform amenities
      let amenitiesArray: string[] = values.amenities || [];
      if (!Array.isArray(amenitiesArray)) {
        amenitiesArray = (values.amenities || "")
          .split(",")
          .map((a: string) => a.trim())
          .filter(Boolean);
      }
      const availableBoolean =
        typeof values.available === "string"
          ? values.available === "true"
          : !!values.available;

      setFormValuesToSubmit({
        ...values,
        amenities: amenitiesArray,
        available: availableBoolean,
      });
      setFormHelpers(helpers);
      setPromptOpen(true);
      console.log("Prepared form values for confirmation", {
        title: values.title,
        images: values.images?.length || 0,
        videos: videoFiles.length,
      });
      toast("Ready to upload — confirm to continue", { icon: "📤" });
    } catch (err: any) {
      console.error("handleSubmit error:", err);
      toast.error("Failed to prepare submission.");
      helpers.setStatus({
        error: err?.message || "Failed to prepare submission.",
      });
    } finally {
      console.groupEnd();
    }
  };

  const handleConfirm = async () => {
    console.groupCollapsed("handleConfirm: upload flow start");
    if (!formValuesToSubmit || !formHelpers) {
      console.warn("No form values or helpers found when confirming upload");
      toast.error("No data to upload.");
      console.groupEnd();
      return;
    }

    formHelpers.setSubmitting(true);
    formHelpers.setStatus(undefined);
    setPromptOpen(false);

    const loadingId = toast.loading("Uploading property...");

    try {
      const bucketId = process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID;
      if (!bucketId) {
        throw new Error(
          "Missing Appwrite bucket ID. Contact the administrator."
        );
      }

      let filesToUpload: File[] = [...mediaPreviews];

      for (const videoFile of videoFiles) {
        const thumbs = thumbnailMap[videoFile.name] || [];
        const selected = selectedThumbnails[videoFile.name];

        if (selected) filesToUpload.push(selected);
        else if (thumbs.length > 0) filesToUpload.push(thumbs[0]);
      }

      console.debug("Files prepared to upload", {
        count: filesToUpload.length,
        files: filesToUpload.map((f) => f.name),
      });

      if (filesToUpload.length < 3) {
        throw new Error(
          "At least 3 images (or thumbnails) are required before uploading."
        );
      }

      toast.loading("Uploading images...", { id: "upload-images" });
      const imageUrls = await uploadApartmentImagesToAppwrite(
        filesToUpload,
        bucketId
      );
      toast.dismiss("upload-images");

      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        throw new Error(
          "No media files were uploaded successfully. Please try again."
        );
      }

      let videoUrls: string[] = [];
      if (videoFiles.length > 0) {
        try {
          toast.loading("Uploading videos...", { id: "upload-videos" });
          const uploadedVideoUrls = await uploadApartmentImagesToAppwrite(
            videoFiles,
            bucketId
          );
          toast.dismiss("upload-videos");
          if (uploadedVideoUrls && Array.isArray(uploadedVideoUrls)) {
            videoUrls = uploadedVideoUrls;
          } else {
            console.warn(
              "Video upload returned unexpected response",
              uploadedVideoUrls
            );
            toast.error("Video upload failed. Images were uploaded.");
          }
        } catch (err) {
          console.error("Video upload error:", err);
          toast.dismiss("upload-videos");
          toast.error("Video upload failed. Images were uploaded.");
        }
      }

      const payload: ApartmentType = {
        ...formValuesToSubmit,
        images: imageUrls,
        ...(videoUrls.length > 0 && { video: videoUrls[0] }),
        agentId: user?.id ?? "",
        approved: false,
        views: 0,
        createdAt: new Date().toISOString(),
      };

      console.log("Sending payload to listApartment", payload);
      const response = await listApartment(payload);

      if (!response) {
        throw new Error(
          "Server did not return a response. Property may not have been created."
        );
      }

      const successMessage =
        (response && (response.success as string | boolean)) ||
        "Property uploaded successfully";
      const redirectUrl = response.url;
      const newId = response.id;

      toast.dismiss(loadingId);
      toast.success(
        typeof successMessage === "string"
          ? successMessage
          : "Property uploaded successfully",
        { id: "property-upload-success" }
      );
      console.log("Upload response", { response });

      if (user?.userType === "agent" && newId) {
        try {
          addListedProperty(newId);
          console.debug("Added property to user's listed properties", newId);
        } catch (e) {
          console.error("addListedProperty failed:", e);
        }
      }

      formHelpers.resetForm();

      setMediaPreviews([]);
      for (const u of mediaPreviewUrls) {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      }
      setMediaPreviewUrls([]);

      setVideoFiles([]);
      for (const u of videoPreviewUrls) {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      }
      setVideoPreviewUrls([]);

      setThumbnailMap({});
      Object.values(thumbnailUrlsMap).forEach((arr) =>
        arr.forEach((u) => {
          try {
            URL.revokeObjectURL(u);
          } catch (e) {}
        })
      );
      setThumbnailUrlsMap({});
      setSelectedThumbnails({});
      Object.values(selectedThumbnailUrls).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
      setSelectedThumbnailUrls({});

      if (redirectUrl && typeof redirectUrl === "string") {
        try {
          router.push(redirectUrl);
        } catch (e) {
          console.error("router.push failed:", e);
          toast.success(
            "Property uploaded — but navigation failed. You can view it in your listings."
          );
        }
      } else {
        toast.success("Property uploaded. No redirect URL returned by server.");
      }
    } catch (err: any) {
      console.error("handleConfirm error:", err);
      toast.dismiss();
      toast.error(err?.message || "Upload failed");
      try {
        formHelpers.setStatus({ error: err?.message || "Upload failed" });
      } catch (e) {
        console.warn("Failed to set form status after upload error", e);
      }
    } finally {
      try {
        formHelpers.setSubmitting(false);
      } catch (e) {}
      setFormValuesToSubmit(null);
      setFormHelpers(null);
      console.groupEnd();
    }
  };

  return (
    <div className="upload-property">
      <div className="container">
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
          {({ values, setFieldValue, isSubmitting, status }) => (
            <>
              <Form>
                <div className="form-group">
                  <label htmlFor="image" className="image-upload-label">
                    <input
                      id="image"
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => handleMediaChange(e, setFieldValue)}
                    />
                    <div
                      className="upload-image-preview"
                      style={{
                        width: "100%",
                        height: 160,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #ddd",
                      }}>
                      {mediaPreviewUrls[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mediaPreviewUrls[0]}
                          alt="apartment preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <img
                          src="/assets/upload_image.jpg"
                          alt="placeholder"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      )}
                    </div>
                  </label>
                </div>

                {mediaPreviews.length > 0 && (
                  <div className="media-previews-container">
                    <span>Selected Images</span>
                    <div className="media-previews-grid">
                      {mediaPreviews.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="media-preview-item">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mediaPreviewUrls[index]}
                            alt={`Preview ${index}`}
                            width={150}
                            height={150}
                            className="preview-thumbnail"
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                            }}
                          />
                          <div className="media-preview-info">
                            <span className="media-name">
                              {file.name.substring(0, 15)}...
                            </span>
                            <button
                              type="button"
                              className="remove-media-btn"
                              onClick={() =>
                                removeMediaFile(index, setFieldValue)
                              }>
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {videoFiles.length > 0 && (
                  <div className="media-previews-container">
                    <span>Selected Videos</span>
                    <div className="media-previews-grid">
                      {videoFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="media-preview-item">
                          <div className="video-preview">
                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                            <video
                              src={videoPreviewUrls[index]}
                              className="preview-thumbnail"
                              width={150}
                              height={150}
                              controls={false}
                              muted
                            />
                            <div className="video-icon">🎬</div>
                          </div>
                          <div className="media-preview-info">
                            <span className="media-name">
                              {file.name.substring(0, 15)}...
                            </span>
                            <button
                              type="button"
                              className="remove-media-btn"
                              onClick={() => removeVideoFile(index)}>
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.entries(thumbnailMap).map(([videoName, thumbs]) => (
                  <div key={videoName} className="thumbnail-preview">
                    <span>Select a thumbnail for: {videoName}</span>
                    <div>
                      {thumbs.map((thumb, idx) => {
                        const url = thumbnailUrlsMap[videoName]?.[idx];
                        return (
                          <div
                            key={thumb.name + idx}
                            className={
                              selectedThumbnails[videoName]?.name === thumb.name
                                ? "active"
                                : ""
                            }>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`thumb-${idx}`}
                              width={120}
                              height={80}
                              style={{ width: 120, height: 80 }}
                              onClick={() => {
                                setSelectedThumbnails((prev) => ({
                                  ...prev,
                                  [videoName]: thumb,
                                }));
                                setSelectedThumbnailUrls((prev) => ({
                                  ...prev,
                                  [videoName]: url || "",
                                }));
                              }}
                            />
                          </div>
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
                  <ReactQuill
                    theme="snow"
                    id="description"
                    className="quill-editor"
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter the property description..."
                    modules={{ toolbar: false }}
                  />
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
                    {data.locations.map((location) => (
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

                <button type="submit" className="btn" disabled={isSubmitting}>
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
