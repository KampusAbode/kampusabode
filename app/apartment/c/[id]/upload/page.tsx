"use client";

import React, { useState, useEffect, useRef } from "react";
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

  // Form state
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    neighborhood_overview: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    amenities: [] as string[],
    available: false,
    images: [] as File[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ error?: string } | undefined>(
    undefined
  );

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
  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // sync to controlled form state
      setFormValues((prev) => ({ ...prev, images: newImageFiles }));

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

  const removeMediaFile = (index: number) => {
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

      // sync to controlled form state
      setFormValues((prev) => ({ ...prev, images: updatedPreviews }));

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

  // UPDATED VALIDATION SCHEMA: Dynamic image requirement based on video presence
  const getValidationSchema = (hasVideo: boolean) => {
    return Yup.object().shape({
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
      // UPDATED: If video exists, minimum 1 image; otherwise minimum 3 images
      images: hasVideo
        ? Yup.array()
            .min(1, "At least 1 image required when uploading video")
            .required("Images are required")
        : Yup.array()
            .min(3, "At least 3 images required when no video is uploaded")
            .required("Images are required"),
      video: Yup.array().max(1, "You can upload up to 1 video").notRequired(),
      available: Yup.boolean().required("Availability is required"),
    });
  };

  const [formValuesToSubmit, setFormValuesToSubmit] = useState<
    | null
    | (Omit<ApartmentType, "images"> & { images: File[]; amenities: string[] })
  >(null);

  // UPDATED handleSubmit: uses dynamic validation schema
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    console.groupCollapsed("handleSubmit invoked (controlled)");

    try {
      setIsSubmitting(true);
      setErrors({});
      setFormStatus(undefined);

      // UPDATED: Determine if video exists for validation
      const hasVideo = videoFiles.length > 0;
      const validationSchema = getValidationSchema(hasVideo);

      // Validate with Yup: collect errors if any
      try {
        // convert numeric-like fields to numbers where schema expects numbers
        const valuesForValidation = {
          ...formValues,
          price: formValues.price === "" ? undefined : Number(formValues.price),
          bedrooms:
            formValues.bedrooms === ""
              ? undefined
              : Number(formValues.bedrooms),
          bathrooms:
            formValues.bathrooms === ""
              ? undefined
              : Number(formValues.bathrooms),
          area: formValues.area === "" ? undefined : Number(formValues.area),
        };

        await validationSchema.validate(valuesForValidation, {
          abortEarly: false,
        });

        // if no validation errors, prepare payload for confirmation
        let amenitiesArray: string[] = formValues.amenities || [];
        if (!Array.isArray(amenitiesArray)) {
          amenitiesArray = (formValues.amenities || "")
            .toString()
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean);
        }
        const availableBoolean =
          typeof formValues.available === "string"
            ? formValues.available === "true"
            : !!formValues.available;

        setFormValuesToSubmit({
          ...formValues,
          price: Number(formValues.price),
          bedrooms: Number(formValues.bedrooms as any) || 0,
          bathrooms: Number(formValues.bathrooms as any) || 0,
          area: Number(formValues.area as any) || 0,
          amenities: amenitiesArray,
          available: availableBoolean,
          // Add required ApartmentType fields with placeholder/default values
          id: "",
          url: "",
          agentId: user?.id ?? "",
          approved: false,
          views: 0,
          createdAt: new Date().toISOString(),
          images: formValues.images, // File[] for extended type
          video: videoFiles.length > 0 ? videoPreviewUrls[0] : undefined, // use preview URL as string
        });

        setPromptOpen(true);
        console.log("Prepared form values for confirmation", {
          title: formValues.title,
          images: formValues.images?.length || 0,
          videos: videoFiles.length,
        });
        toast("Ready to upload — confirm to continue", { icon: "📤" });
      } catch (validationErr: any) {
        // Build errors map similar to Formik behavior
        const newErrors: Record<string, string> = {};
        if (validationErr.inner && Array.isArray(validationErr.inner)) {
          validationErr.inner.forEach((ve: any) => {
            if (ve.path && !newErrors[ve.path]) newErrors[ve.path] = ve.message;
          });
        } else if (validationErr.path) {
          newErrors[validationErr.path] = validationErr.message;
        } else {
          setFormStatus({
            error: validationErr.message || "Validation failed",
          });
        }
        setErrors(newErrors);
        toast.error("Please fix the highlighted errors.");
      }
    } catch (err: any) {
      console.error("handleSubmit error:", err);
      toast.error("Failed to prepare submission.");
      setFormStatus({ error: err?.message || "Failed to prepare submission." });
    } finally {
      setIsSubmitting(false);
      console.groupEnd();
    }
  };

  const handleConfirm = async () => {
    console.groupCollapsed("handleConfirm: upload flow start");
    if (!formValuesToSubmit) {
      console.warn("No form values found when confirming upload");
      toast.error("No data to upload.");
      console.groupEnd();
      return;
    }

    setIsSubmitting(true);
    setPromptOpen(false);
    setFormStatus(undefined);

    const loadingId = toast.loading("Uploading property...");

    try {
      const bucketId = process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID;
      if (!bucketId) {
        throw new Error(
          "Missing Appwrite bucket ID. Contact the administrator."
        );
      }

      let filesToUpload: File[] = [...mediaPreviews];

      // UPDATED: Add video thumbnails to upload (if available)
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

      // UPDATED: Check minimum files based on video presence
      const hasVideo = videoFiles.length > 0;
      const minFiles = hasVideo ? 1 : 3;

      if (filesToUpload.length < minFiles) {
        throw new Error(
          hasVideo
            ? "At least 1 image (or thumbnail) is required when uploading a video."
            : "At least 3 images are required when not uploading a video."
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

      // reset the controlled form state
      setFormValues({
        title: "",
        description: "",
        price: "",
        location: "",
        neighborhood_overview: "",
        type: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        amenities: [],
        available: false,
        images: [],
      });

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
      setFormStatus({ error: err?.message || "Upload failed" });
    } finally {
      setIsSubmitting(false);
      setFormValuesToSubmit(null);
      console.groupEnd();
    }
  };

  return (
    <div className="upload-property">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image" className="image-upload-label">
              <input
                id="image"
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaChange}
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

          {/* UPDATED: Show helper text about upload requirements */}
          <div
            style={{ marginBottom: "16px", fontSize: "14px", color: "#666" }}>
            {videoFiles.length > 0 ? (
              <p>
                ✓ Video detected: At least 1 image required (or use video
                thumbnail)
              </p>
            ) : (
              <p>ℹ️ No video: At least 3 images required</p>
            )}
          </div>

          {mediaPreviews.length > 0 && (
            <div className="media-previews-container">
              <span>Selected Images ({mediaPreviews.length})</span>
              <div className="media-previews-grid">
                {mediaPreviews.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="media-preview-item">
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
                        onClick={() => removeMediaFile(index)}>
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
              <span>Selected Videos ({videoFiles.length})</span>
              <div className="media-previews-grid">
                {videoFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="media-preview-item">
                    <div className="video-preview">
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
                    <img
                      key={thumb.name + idx}
                      className={
                        selectedThumbnails[videoName]?.name === thumb.name
                          ? "active"
                          : ""
                      }
                      src={url}
                      alt={`thumb-${idx}`}
                      width={120}
                      height={80}
                      style={{ width: 120, height: 80, cursor: "pointer" }}
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
                  );
                })}
              </div>
            </div>
          ))}

          {/* ===== Controlled Inputs ===== */}

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={formValues.title}
              onChange={(e) =>
                setFormValues((p) => ({ ...p, title: e.target.value }))
              }
            />
            {errors.title && <div className="error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <ReactQuill
              theme="snow"
              id="description"
              className="quill-editor"
              value={formValues.description}
              onChange={(value) =>
                setFormValues((p) => ({ ...p, description: value }))
              }
              placeholder="Enter the property description..."
              modules={{ toolbar: false }}
            />
            {errors.description && (
              <div className="error">{errors.description}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={formValues.price}
              onChange={(e) =>
                setFormValues((p) => ({ ...p, price: e.target.value }))
              }
            />
            {errors.price && <div className="error">{errors.price}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select
              id="location"
              value={formValues.location}
              onChange={(e) =>
                setFormValues((p) => ({ ...p, location: e.target.value }))
              }>
              <option value="">Select Location</option>
              {data.locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {errors.location && <div className="error">{errors.location}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="neighborhood_overview">Neighborhood Overview</label>
            <textarea
              id="neighborhood_overview"
              value={formValues.neighborhood_overview}
              onChange={(e) =>
                setFormValues((p) => ({
                  ...p,
                  neighborhood_overview: e.target.value,
                }))
              }
            />
            {errors.neighborhood_overview && (
              <div className="error">{errors.neighborhood_overview}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="type">Property Type</label>
            <select
              id="type"
              value={formValues.type}
              onChange={(e) =>
                setFormValues((p) => ({ ...p, type: e.target.value }))
              }>
              <option value="">Select Property Type</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.type && <div className="error">{errors.type}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <input
              id="bedrooms"
              type="number"
              value={formValues.bedrooms}
              onChange={(e) =>
                setFormValues((p) => ({ ...p, bedrooms: e.target.value }))
              }
            />
            {errors.bedrooms && <div className="error">{errors.bedrooms}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="bathrooms">Bathrooms</label>
            <input
              id="bathrooms"
              type="number"
              value={formValues.bathrooms}
              onChange={(e) =>
                setFormValues((p) => ({ ...p, bathrooms: e.target.value }))
              }
            />
            {errors.bathrooms && (
              <div className="error">{errors.bathrooms}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="area">Area (sqm)</label>
            <input
              id="area"
              type="number"
              value={formValues.area}
              onChange={(e) =>
                setFormValues((p) => ({ ...p, area: e.target.value }))
              }
            />
            {errors.area && <div className="error">{errors.area}</div>}
          </div>

          <div className="form-group">
            <label>Amenities</label>
            <select
              multiple
              size={5}
              value={formValues.amenities}
              onChange={(e) => {
                const options = Array.from(e.target.options);
                const selected = options
                  .filter((o) => o.selected)
                  .map((o) => o.value);
                setFormValues((p) => ({ ...p, amenities: selected }));
              }}
              style={{ height: "120px" }}>
              {amenitiesOptions.map((amenity) => (
                <option key={amenity} value={amenity}>
                  {amenity}
                </option>
              ))}
            </select>
            {errors.amenities && (
              <div className="error">{errors.amenities}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="available">Available</label>
            <select
              id="available"
              value={String(formValues.available)}
              onChange={(e) =>
                setFormValues((p) => ({
                  ...p,
                  available: e.target.value === "true",
                }))
              }>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
            {errors.available && (
              <div className="error">{errors.available}</div>
            )}
          </div>

          {/* UPDATED: Show images validation error if exists */}
          {errors.images && (
            <div className="error" style={{ marginBottom: "8px" }}>
              {errors.images}
            </div>
          )}

          {formStatus?.error && (
            <div className="error" style={{ marginBottom: "8px" }}>
              {formStatus.error}
            </div>
          )}

          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Property"}
          </button>
        </form>

        <Prompt
          isOpen={promptOpen}
          onCancel={() => setPromptOpen(false)}
          message="Are you sure you want to upload this property?"
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};

export default UploadProperty;
