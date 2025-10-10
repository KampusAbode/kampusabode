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
// validateWithYupAndToast kept in imports if you use elsewhere
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
    if (!user || user.userType !== "agent") {
      toast.error("Access denied. Only agents can upload properties.");
      // we don't throw — just navigate back
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
      // Revoke any remaining object URLs when component unmounts
      for (const url of createdObjectUrls.current) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          // ignore
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
    return url;
  };

  // Extract thumbnails from a video file with error handling & timeout
  const extractThumbnails = async (videoFile: File): Promise<File[]> => {
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
        // remove event handlers
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
          // revoke video object url right away
          try {
            URL.revokeObjectURL(url);
          } catch {}
          reject(
            new Error(`Failed to load video metadata for ${videoFile.name}`)
          );
        }
      };

      video.onloadedmetadata = async () => {
        // safety: if duration is invalid, abort
        const duration = video.duration;
        if (!duration || !isFinite(duration)) {
          cleanUp();
          try {
            URL.revokeObjectURL(url);
          } catch {}
          return reject(
            new Error(`Video ${videoFile.name} has invalid duration`)
          );
        }

        const interval = duration / Math.max(1, FRAME_COUNT);
        let frameIndex = 1;

        // set overall timeout to avoid very long extraction
        timeoutId = window.setTimeout(() => {
          cleanUp();
          if (!resolved) {
            resolved = true;
            try {
              URL.revokeObjectURL(url);
            } catch {}
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
              // Wait for seeked
              await new Promise<void>((seekResolve, seekReject) => {
                const onseek = () => {
                  seekResolve();
                };
                const onerror = () => {
                  seekReject(new Error("Seek error"));
                };
                video.onseeked = onseek;
                video.onerror = onerror;
              });

              // create canvas
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth || 320;
              canvas.height = video.videoHeight || 240;
              const ctx = canvas.getContext("2d");
              if (!ctx) {
                continue; // skip this frame if ctx not available
              }
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              // convert to blob
              const blob: Blob | null = await new Promise((res) =>
                canvas.toBlob(res, "image/jpeg")
              );

              if (blob) {
                const thumbFile = new File(
                  [blob],
                  `${videoFile.name}-thumb-${frameIndex}.jpg`,
                  {
                    type: "image/jpeg",
                  }
                );
                thumbnails.push(thumbFile);
              }
            }
            cleanUp();
            try {
              URL.revokeObjectURL(url);
            } catch {}
            if (!resolved) {
              resolved = true;
              resolve(thumbnails);
            }
          } catch (err) {
            cleanUp();
            try {
              URL.revokeObjectURL(url);
            } catch {}
            if (!resolved) {
              resolved = true;
              reject(err);
            }
          }
        };

        // start capture
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
    // revoke previous urls
    for (const u of previousUrls) {
      try {
        URL.revokeObjectURL(u);
      } catch {}
    }
    const urls = files.map((f) => createObjectUrl(f));
    setter(urls);
  };

  // handle file input changes (images + videos)
  const handleMediaChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    try {
      const inputFiles = e.target.files ? Array.from(e.target.files) : [];
      if (inputFiles.length === 0) return;

      // clone current state arrays (we'll update them immutably)
      const newImageFiles = [...mediaPreviews];
      const newVideoFiles = [...videoFiles];
      const newThumbMap = { ...thumbnailMap };
      const newThumbnailUrlsMap = { ...thumbnailUrlsMap };

      for (const file of inputFiles) {
        if (file.type.startsWith("video/")) {
          if (file.size > MAX_VIDEO_SIZE) {
            toast.error(`${file.name} exceeds max video size of 20MB`);
            continue;
          }
          // try to extract thumbnails, but guard errors
          try {
            const thumbs = await extractThumbnails(file);
            if (!thumbs || thumbs.length === 0) {
              toast.error(`Could not extract thumbnails from ${file.name}`);
              // still allow video upload (but no thumbs)
              newVideoFiles.push(file);
              continue;
            }
            newThumbMap[file.name] = thumbs;
            newThumbnailUrlsMap[file.name] = thumbs.map((t) =>
              createObjectUrl(t)
            );
            // store video
            newVideoFiles.push(file);
          } catch (err: any) {
            console.error("extractThumbnails error:", err);
            toast.error(
              `Error processing video ${file.name}: ${err?.message || "unknown error"}`
            );
            // still add video to allow upload; user might not need thumbs
            newVideoFiles.push(file);
          }
        } else if (file.type.startsWith("image/")) {
          newImageFiles.push(file);
        } else {
          toast.error(`${file.name} is unsupported file type`);
        }
      }

      // check total images+video thumbnails size (prevent sending too much)
      const totalSize = [...newImageFiles, ...newVideoFiles].reduce(
        (acc, f) => acc + f.size,
        0
      );
      if (totalSize > MAX_FILE_SIZE) {
        toast.error(
          "Total file size exceeds 10MB. Please select smaller files or fewer files."
        );
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

      // update formik field for images (images only — we push video thumbs at submit time)
      setFieldValue("images", newImageFiles);
    } catch (err: any) {
      console.error("handleMediaChange error:", err);
      toast.error(err?.message || "Error handling selected files.");
    } finally {
      // reset input value so selecting same file later triggers change
      try {
        (e.target as HTMLInputElement).value = "";
      } catch {}
    }
  };

  const removeMediaFile = (
    index: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    try {
      const updatedPreviews = [...mediaPreviews];
      const updatedPreviewUrls = [...mediaPreviewUrls];

      const fileToRemove = updatedPreviews[index];
      const urlToRemove = updatedPreviewUrls[index];

      if (!fileToRemove) return;

      updatedPreviews.splice(index, 1);
      updatedPreviewUrls.splice(index, 1);

      // revoke URL
      try {
        if (urlToRemove) URL.revokeObjectURL(urlToRemove);
      } catch (e) {}

      setMediaPreviews(updatedPreviews);
      setMediaPreviewUrls(updatedPreviewUrls);

      setFieldValue("images", updatedPreviews);
    } catch (err) {
      console.error("removeMediaFile error:", err);
      toast.error("Unable to remove image");
    }
  };

  const removeVideoFile = (index: number) => {
    try {
      const updatedVideos = [...videoFiles];
      const updatedVideoUrls = [...videoPreviewUrls];

      const videoToRemove = updatedVideos[index];
      const urlToRemove = updatedVideoUrls[index];

      if (!videoToRemove) return;

      // Remove its thumbnails from the map
      const newThumbsMap = { ...thumbnailMap };
      const newThumbUrlsMap = { ...thumbnailUrlsMap };
      delete newThumbsMap[videoToRemove.name];
      const removedThumbUrls = newThumbUrlsMap[videoToRemove.name] || [];
      delete newThumbUrlsMap[videoToRemove.name];

      // revoke thumb urls
      for (const u of removedThumbUrls) {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      }

      // Also remove from selected thumbnails if present
      const newSelectedThumbs = { ...selectedThumbnails };
      const newSelectedThumbUrls = { ...selectedThumbnailUrls };
      delete newSelectedThumbs[videoToRemove.name];
      const urlToDel = newSelectedThumbUrls[videoToRemove.name];
      if (urlToDel) {
        try {
          URL.revokeObjectURL(urlToDel);
        } catch {}
      }
      delete newSelectedThumbUrls[videoToRemove.name];

      updatedVideos.splice(index, 1);
      updatedVideoUrls.splice(index, 1);

      // revoke video preview url
      try {
        if (urlToRemove) URL.revokeObjectURL(urlToRemove);
      } catch (e) {}

      setVideoFiles(updatedVideos);
      setVideoPreviewUrls(updatedVideoUrls);
      setThumbnailMap(newThumbsMap);
      setThumbnailUrlsMap(newThumbUrlsMap);
      setSelectedThumbnails(newSelectedThumbs);
      setSelectedThumbnailUrls(newSelectedThumbUrls);
    } catch (err) {
      console.error("removeVideoFile error:", err);
      toast.error("Unable to remove video");
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
    try {
      // transform amenities
      let amenitiesArray: string[] = values.amenities || [];
      if (!Array.isArray(amenitiesArray)) {
        amenitiesArray = (values.amenities || "")
          .split(",")
          .map((a) => a.trim())
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
    } catch (err: any) {
      console.error("handleSubmit error:", err);
      toast.error("Failed to prepare submission.");
      helpers.setStatus({
        error: err?.message || "Failed to prepare submission.",
      });
    }
  };

  const handleConfirm = async () => {
    if (!formValuesToSubmit || !formHelpers) return;

    formHelpers.setSubmitting(true);
    formHelpers.setStatus(undefined);
    setPromptOpen(false);

    try {
      // validate env / bucket id
      const bucketId = process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID;
      if (!bucketId) {
        throw new Error(
          "Missing Appwrite bucket ID. Contact the administrator."
        );
      }

      // Prepare files to upload: images + selected video thumbs (or first thumb)
      let filesToUpload: File[] = [...mediaPreviews];

      for (const videoFile of videoFiles) {
        const thumbs = thumbnailMap[videoFile.name] || [];
        const selected = selectedThumbnails[videoFile.name];

        if (selected) filesToUpload.push(selected);
        else if (thumbs.length > 0) filesToUpload.push(thumbs[0]);
        // else: no thumb available — that's OK, proceed without adding one
      }

      // guard: must have at least 3 images (images + thumbs)
      if (filesToUpload.length < 3) {
        throw new Error(
          "At least 3 images (or thumbnails) are required before uploading."
        );
      }

      // Upload image files (including thumbs)
      const imageUrls = await uploadApartmentImagesToAppwrite(
        filesToUpload,
        bucketId
      );

      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        throw new Error(
          "No media files were uploaded successfully. Please try again."
        );
      }

      // upload videos separately (if any)
      let videoUrls: string[] = [];
      if (videoFiles.length > 0) {
        const uploadedVideoUrls = await uploadApartmentImagesToAppwrite(
          videoFiles,
          bucketId
        );
        if (uploadedVideoUrls && Array.isArray(uploadedVideoUrls)) {
          videoUrls = uploadedVideoUrls;
        } else {
          // video upload failed — not fatal, but notify
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

      const response = await listApartment(payload);

      if (!response) {
        throw new Error(
          "Server did not return a response. Property may not have been created."
        );
      }

      // validate response fields before using
      const successMessage =
        (response && (response.success as string | boolean)) ||
        "Property uploaded successfully";
      const redirectUrl = response.url;
      const newId = response.id;

      toast.success(
        typeof successMessage === "string"
          ? successMessage
          : "Property uploaded successfully",
        {
          id: "property-upload-success",
        }
      );

      if (user?.userType === "agent" && newId) {
        try {
          addListedProperty(newId);
        } catch (e) {
          console.error("addListedProperty failed:", e);
        }
      }

      // reset ui & form
      formHelpers.resetForm();
      setMediaPreviews([]);
      // revoke previews
      for (const u of mediaPreviewUrls) {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      }
      setMediaPreviewUrls([]);

      setVideoFiles([]);
      for (const u of videoPreviewUrls) {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      }
      setVideoPreviewUrls([]);

      setThumbnailMap({});
      // revoke thumbnail urls
      Object.values(thumbnailUrlsMap).forEach((arr) => {
        arr.forEach((u) => {
          try {
            URL.revokeObjectURL(u);
          } catch {}
        });
      });
      setThumbnailUrlsMap({});
      setSelectedThumbnails({});
      Object.values(selectedThumbnailUrls).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
      setSelectedThumbnailUrls({});

      // push to url if valid
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
        // no url returned — still success
        toast.success("Property uploaded. No redirect URL returned by server.");
      }
    } catch (err: any) {
      console.error("handleConfirm error:", err);
      toast.error(err?.message || "Upload failed");
      try {
        formHelpers.setStatus({ error: err?.message || "Upload failed" });
      } catch (e) {
        // ignore
      }
    } finally {
      try {
        formHelpers.setSubmitting(false);
      } catch (e) {
        // ignore
      }
      setFormValuesToSubmit(null);
      setFormHelpers(null);
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
                    {/* Main preview: show first image if present, otherwise fallback */}
                    <div
                      className="upload-image-preview"
                      style={{
                        width: 240,
                        height: 160,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #ddd",
                      }}>
                      {mediaPreviewUrls[0] ? (
                        // plain img for blob url preview
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

                {/* Image Previews */}
                {mediaPreviews.length > 0 && (
                  <div className="media-previews-container">
                    <h6>Selected Images</h6>
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

                {/* Video Previews */}
                {videoFiles.length > 0 && (
                  <div className="media-previews-container">
                    <h6>Selected Videos</h6>
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

                {/* Thumbnail preview and selection */}
                {Object.entries(thumbnailMap).map(([videoName, thumbs]) => (
                  <div key={videoName} className="thumbnail-preview">
                    <span>Select a thumbnail for: {videoName}</span>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "nowrap",
                        marginTop: 8,
                      }}>
                      {thumbs.map((thumb, idx) => {
                        const url = thumbnailUrlsMap[videoName]?.[idx];
                        return (
                          <div
                            key={thumb.name + idx}
                            style={{
                              cursor: "pointer",
                              border:
                                selectedThumbnails[videoName]?.name ===
                                thumb.name
                                  ? "2px solid #00ff00"
                                  : "1px solid #ddd",
                              borderRadius: 4,
                            }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`thumb-${idx}`}
                              width={120}
                              height={80}
                              style={{
                                width: 120,
                                height: 80,
                                objectFit: "cover",
                                display: "block",
                              }}
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
