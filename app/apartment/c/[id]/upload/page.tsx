"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import {
  listApartment,
  uploadFilesToAppwrite,
  checkIsAdmin,
} from "../../../../utils";
import { useUserStore } from "../../../../store/userStore";
import { ApartmentType } from "../../../../fetch/types";
import data from "../../../../fetch/contents";
import Prompt from "../../../../components/modals/prompt/Prompt";
import "./upload.css";

// Lazy load ReactQuill for better initial load performance
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: "20px", background: "#f5f5f5" }}>
      Loading editor...
    </div>
  ),
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB total images+thumbs
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB per video
const FRAME_COUNT = 15;
const THUMB_EXTRACT_TIMEOUT = 10_000; // 10s per video

// ============================================================================
// TYPES
// ============================================================================
type MediaState = {
  thumbnailMap: Record<string, File[]>;
  thumbnailUrlsMap: Record<string, string[]>;
  mediaPreviews: File[];
  mediaPreviewUrls: string[];
  videoFiles: File[];
  videoPreviewUrls: string[];
  selectedThumbnails: Record<string, File>;
  selectedThumbnailUrls: Record<string, string>;
};

type MediaAction =
  | { type: "UPDATE_ALL_MEDIA"; payload: Partial<MediaState> }
  | {
      type: "ADD_VIDEO_THUMBNAILS";
      videoName: string;
      thumbs: File[];
      thumbUrls: string[];
    }
  | { type: "REMOVE_IMAGE"; index: number }
  | { type: "REMOVE_VIDEO"; videoName: string; index: number }
  | { type: "SELECT_THUMBNAIL"; videoName: string; thumb: File; url: string }
  | { type: "RESET_ALL" };

// ============================================================================
// REDUCER FOR BATCHED STATE UPDATES
// ============================================================================
const mediaReducer = (state: MediaState, action: MediaAction): MediaState => {
  switch (action.type) {
    case "UPDATE_ALL_MEDIA":
      return { ...state, ...action.payload };

    case "ADD_VIDEO_THUMBNAILS":
      return {
        ...state,
        thumbnailMap: {
          ...state.thumbnailMap,
          [action.videoName]: action.thumbs,
        },
        thumbnailUrlsMap: {
          ...state.thumbnailUrlsMap,
          [action.videoName]: action.thumbUrls,
        },
      };

    case "REMOVE_IMAGE": {
      const newPreviews = [...state.mediaPreviews];
      const newUrls = [...state.mediaPreviewUrls];
      newPreviews.splice(action.index, 1);
      newUrls.splice(action.index, 1);
      return {
        ...state,
        mediaPreviews: newPreviews,
        mediaPreviewUrls: newUrls,
      };
    }

    case "REMOVE_VIDEO": {
      const newVideos = [...state.videoFiles];
      const newVideoUrls = [...state.videoPreviewUrls];
      newVideos.splice(action.index, 1);
      newVideoUrls.splice(action.index, 1);

      const newThumbMap = { ...state.thumbnailMap };
      const newThumbUrlsMap = { ...state.thumbnailUrlsMap };
      delete newThumbMap[action.videoName];
      delete newThumbUrlsMap[action.videoName];

      const newSelectedThumbs = { ...state.selectedThumbnails };
      const newSelectedThumbUrls = { ...state.selectedThumbnailUrls };
      delete newSelectedThumbs[action.videoName];
      delete newSelectedThumbUrls[action.videoName];

      return {
        ...state,
        videoFiles: newVideos,
        videoPreviewUrls: newVideoUrls,
        thumbnailMap: newThumbMap,
        thumbnailUrlsMap: newThumbUrlsMap,
        selectedThumbnails: newSelectedThumbs,
        selectedThumbnailUrls: newSelectedThumbUrls,
      };
    }

    case "SELECT_THUMBNAIL":
      return {
        ...state,
        selectedThumbnails: {
          ...state.selectedThumbnails,
          [action.videoName]: action.thumb,
        },
        selectedThumbnailUrls: {
          ...state.selectedThumbnailUrls,
          [action.videoName]: action.url,
        },
      };

    case "RESET_ALL":
      return {
        thumbnailMap: {},
        thumbnailUrlsMap: {},
        mediaPreviews: [],
        mediaPreviewUrls: [],
        videoFiles: [],
        videoPreviewUrls: [],
        selectedThumbnails: {},
        selectedThumbnailUrls: {},
      };

    default:
      return state;
  }
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Object URL Manager Hook
const useObjectURLManager = () => {
  const urlsRef = useRef<Set<string>>(new Set());

  const createURL = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    urlsRef.current.add(url);
    return url;
  }, []);

  const revokeURL = useCallback((url: string) => {
    if (urlsRef.current.has(url)) {
      try {
        URL.revokeObjectURL(url);
        urlsRef.current.delete(url);
      } catch (e) {
        console.warn("Failed to revoke URL:", e);
      }
    }
  }, []);

  const revokeAll = useCallback(() => {
    urlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn("Failed to revoke URL:", e);
      }
    });
    urlsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => revokeAll();
  }, [revokeAll]);

  return { createURL, revokeURL, revokeAll };
};

// Debounce Hook
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Image Compression
const compressImage = async (file: File, maxSizeMB = 1): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            } else {
              resolve(file); // Fallback to original
            }
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => resolve(file); // Fallback to original
      img.src = e.target!.result as string;
    };
    reader.onerror = () => resolve(file); // Fallback to original
    reader.readAsDataURL(file);
  });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UploadProperty: React.FC = () => {
  // Media state managed by reducer
  const [mediaState, dispatchMedia] = useReducer(mediaReducer, {
    thumbnailMap: {},
    thumbnailUrlsMap: {},
    mediaPreviews: [],
    mediaPreviewUrls: [],
    videoFiles: [],
    videoPreviewUrls: [],
    selectedThumbnails: {},
    selectedThumbnailUrls: {},
  });

  const [promptOpen, setPromptOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, addListedProperty } = useUserStore((state) => state);

  const urlAgentId = searchParams.get("agentId");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [targetAgentId, setTargetAgentId] = useState<string>("");
  const [agentName, setAgentName] = useState<string>("");
  const [accessGranted, setAccessGranted] = useState(false);

  const { createURL, revokeURL, revokeAll } = useObjectURLManager();

  // Form state
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: "",
    priceType: "rent" as "rent" | "total_package",
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
    "Self contained",
    "Single room",
    "Room and parlour",
    "2 bedroom",
    "3 bedroom",
    "4 bedroom",
  ];

  const amenitiesOptions = [
    // Critical
    "electricity",
    "backup generator",
    "water supply",
    "borehole water",
    "internet/Wi-Fi",

    // Security (very important)
    "24/7 security",
    "gated estate",
    "CCTV cameras",

    // Basic needs
    "furnished",
    "semi-furnished",
    "private bathroom",
    "shared bathroom",
    "kitchen",
    "bedframe",
    "wardrope",

    // Comfort
    "air conditioning",
    "ceiling fans",
    "hot water",

    // Study
    "study desk",
    "quiet environment",
    "reading area",

    // Convenience
    "laundry services",
    "cleaning services",
    "proximity to campus",
    "proximity to market",
    "on-site caretaker",

    // Extras
    "parking space",
    "waste disposal",
    "balcony",
    "gym",
    "sports area",
  ];

  // Memoized validation schema
  const getValidationSchema = useMemo(() => {
    return (hasVideo: boolean) => {
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
        priceType: Yup.string()
          .oneOf(["rent", "total_package"], "Invalid price type")
          .required("Price type is required"),
        location: Yup.string().required("Location is required"),
        neighborhood_overview: Yup.string()
          .max(1500, "Overview cannot exceed 1500 characters")
          .notRequired(),
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
        images: hasVideo
          ? Yup.array()
              .min(1, "At least 1 image required when uploading video")
              .required("Images are required")
          : Yup.array()
              .min(3, "At least 3 images required when no video is uploaded")
              .required("Images are required"),
        available: Yup.boolean().required("Availability is required"),
      });
    };
  }, []);

  // Access control with abort controller
  useEffect(() => {
    const abortController = new AbortController();

    async function checkAccess() {
      if (!user) {
        toast.error("Please log in to upload properties.");
        try {
          router.back();
        } catch (e) {
          console.error("router.back failed:", e);
        }
        return;
      }

      if (urlAgentId) {
        try {
          const isAdmin = await checkIsAdmin(user.id);

          if (abortController.signal.aborted) return;

          if (!isAdmin) {
            toast.error(
              "Access denied. Only admins can upload for other agents."
            );
            router.back();
            return;
          }

          setAgentName(`Agent ${urlAgentId.substring(0, 8)}`);
          setIsAdminMode(true);
          setTargetAgentId(urlAgentId);
          setAccessGranted(true);
          toast.success(
            `Admin mode: Uploading for ${urlAgentId.substring(0, 8)}`
          );
        } catch (error: any) {
          if (error.name === "AbortError") return;
          console.error("Failed to verify admin status:", error);
          toast.error("Failed to verify permissions.");
          router.back();
        }
      } else {
        if (user.userType !== "agent") {
          toast.error("Access denied. Only agents can upload properties.");
          router.back();
          return;
        }

        setIsAdminMode(false);
        setTargetAgentId(user.id);
        setAccessGranted(true);
      }
    }

    checkAccess();

    return () => {
      abortController.abort();
    };
  }, [user, urlAgentId, router]);

  // Optimized thumbnail extraction with parallel processing
  // Optimized thumbnail extraction with SEQUENTIAL processing (more reliable)
  const extractThumbnails = useCallback(
    async (videoFile: File): Promise<File[]> => {
      const thumbnails: File[] = [];
      const url = createURL(videoFile);

      return new Promise<File[]>((resolve, reject) => {
        const video = document.createElement("video");
        let timeoutId: NodeJS.Timeout | null = null;
        let resolved = false;

        const cleanUp = () => {
          if (timeoutId) clearTimeout(timeoutId);
          video.onloadedmetadata = null;
          video.onerror = null;
          video.onseeked = null;
          video.ontimeupdate = null;
        };

        // Better error handling
        video.onerror = (e) => {
          cleanUp();
          if (!resolved) {
            resolved = true;
            revokeURL(url);
            const errorMsg = video.error
              ? `Video error code: ${video.error.code} - ${video.error.message}`
              : "Failed to load video";
            console.error(`Video error for ${videoFile.name}:`, errorMsg);
            reject(new Error(errorMsg));
          }
        };

        video.crossOrigin = "anonymous";
        video.preload = "metadata";
        video.muted = true; // Important for autoplay policies

        video.onloadedmetadata = async () => {
          const duration = video.duration;

          if (!duration || !isFinite(duration) || duration <= 0) {
            cleanUp();
            revokeURL(url);
            console.error(`Invalid duration for ${videoFile.name}:`, duration);
            return reject(new Error(`Invalid video duration: ${duration}`));
          }

          console.log(
            `Video loaded: ${videoFile.name}, duration: ${duration}s`
          );

          const interval = duration / (FRAME_COUNT + 1); // +1 to avoid last frame issues

          timeoutId = setTimeout(() => {
            cleanUp();
            if (!resolved) {
              resolved = true;
              revokeURL(url);
              console.error(
                `Timeout extracting thumbnails from ${videoFile.name}`
              );
              reject(new Error(`Thumbnail extraction timed out`));
            }
          }, THUMB_EXTRACT_TIMEOUT);

          try {
            // SEQUENTIAL extraction (more reliable than parallel)
            for (let i = 1; i <= FRAME_COUNT; i++) {
              const time = Math.min(duration - 0.5, i * interval); // 0.5s buffer from end

              await new Promise<void>((resolveSeeked, rejectSeeked) => {
                let seekTimeout: NodeJS.Timeout;

                const onSeeked = () => {
                  clearTimeout(seekTimeout);
                  video.onseeked = null;
                  resolveSeeked();
                };

                const onSeekError = () => {
                  clearTimeout(seekTimeout);
                  video.onseeked = null;
                  rejectSeeked(new Error(`Failed to seek to ${time}s`));
                };

                video.onseeked = onSeeked;

                // Fallback timeout for seek operation
                seekTimeout = setTimeout(() => {
                  video.onseeked = null;
                  rejectSeeked(new Error(`Seek timeout at ${time}s`));
                }, 3000); // 3s per seek

                video.currentTime = time;
              });

              // Small delay to ensure frame is rendered
              await new Promise((resolve) => setTimeout(resolve, 100));

              // Capture frame
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth || 640;
              canvas.height = video.videoHeight || 480;
              const ctx = canvas.getContext("2d");

              if (!ctx) {
                console.warn(`No canvas context for frame ${i}`);
                continue;
              }

              try {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const blob = await new Promise<Blob | null>((resolveBlob) => {
                  canvas.toBlob((b) => resolveBlob(b), "image/jpeg", 0.8);
                });

                if (blob) {
                  const thumbFile = new File(
                    [blob],
                    `${videoFile.name}-thumb-${i}.jpg`,
                    { type: "image/jpeg" }
                  );
                  thumbnails.push(thumbFile);
                }
              } catch (err) {
                console.warn(`Failed to capture frame ${i}:`, err);
              }
            }

            cleanUp();
            revokeURL(url);

            if (!resolved) {
              resolved = true;

              if (thumbnails.length === 0) {
                reject(new Error("No thumbnails could be extracted"));
              } else {
                console.log(
                  `Successfully extracted ${thumbnails.length} thumbnails from ${videoFile.name}`
                );
                resolve(thumbnails);
              }
            }
          } catch (err: any) {
            cleanUp();
            revokeURL(url);
            if (!resolved) {
              resolved = true;
              console.error("Thumbnail extraction error:", err);
              reject(err);
            }
          }
        };

        // Set source AFTER attaching all handlers
        try {
          video.src = url;
          video.load(); // Explicitly load the video
        } catch (err) {
          cleanUp();
          revokeURL(url);
          reject(new Error(`Failed to load video file: ${err}`));
        }
      });
    },
    [createURL, revokeURL]
  );

  // Handle media change with compression and optimization
  const handleMediaChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const inputFiles = e.target.files ? Array.from(e.target.files) : [];
        if (inputFiles.length === 0) return;

        const newImageFiles = [...mediaState.mediaPreviews];
        const newVideoFiles = [...mediaState.videoFiles];
        const newThumbMap = { ...mediaState.thumbnailMap };
        const newThumbnailUrlsMap = { ...mediaState.thumbnailUrlsMap };

        for (const file of inputFiles) {
          // In handleMediaChange, replace the video processing block:
          if (file.type.startsWith("video/")) {
            if (file.size > MAX_VIDEO_SIZE) {
              toast.error(`${file.name} exceeds max video size of 20MB`);
              continue;
            }

            console.log(
              `Processing video: ${file.name}, size: ${file.size}, type: ${file.type}`
            );

            try {
              const toastId = toast.loading(`Processing video ${file.name}...`);
              const thumbs = await extractThumbnails(file);
              toast.dismiss(toastId);

              if (!thumbs || thumbs.length === 0) {
                console.error(`No thumbnails extracted from ${file.name}`);
                toast.error(`Could not extract thumbnails from ${file.name}`);
                newVideoFiles.push(file);
                continue;
              }

              console.log(
                `✅ Extracted ${thumbs.length} thumbnails from ${file.name}`
              );
              newThumbMap[file.name] = thumbs;
              newThumbnailUrlsMap[file.name] = thumbs.map((t) => createURL(t));
              newVideoFiles.push(file);
              toast.success(
                `${thumbs.length} thumbnails ready for ${file.name}`
              );
            } catch (err: any) {
              console.error(
                `❌ Video processing failed for ${file.name}:`,
                err
              );
              toast.error(
                `Error processing video: ${err?.message || "unknown error"}`
              );
              newVideoFiles.push(file);
            }
          } else if (file.type.startsWith("image/")) {
            // Compress images before adding
            const compressedFile = await compressImage(file);
            newImageFiles.push(compressedFile);
          } else {
            toast.error(`${file.name} is unsupported file type`);
          }
        }

        const totalSize = [...newImageFiles, ...newVideoFiles].reduce(
          (acc, f) => acc + f.size,
          0
        );
        if (totalSize > MAX_FILE_SIZE) {
          toast.error(
            "Total file size exceeds 10MB. Please select smaller files."
          );
          return;
        }

        // Batch state update
        dispatchMedia({
          type: "UPDATE_ALL_MEDIA",
          payload: {
            thumbnailMap: newThumbMap,
            thumbnailUrlsMap: newThumbnailUrlsMap,
            mediaPreviews: newImageFiles,
            mediaPreviewUrls: newImageFiles.map((f) => createURL(f)),
            videoFiles: newVideoFiles,
            videoPreviewUrls: newVideoFiles.map((f) => createURL(f)),
          },
        });

        setFormValues((prev) => ({ ...prev, images: newImageFiles }));
        toast.success("Media selected and processed");
      } catch (err: any) {
        console.error("handleMediaChange error:", err);
        toast.error(err?.message || "Error handling selected files.");
      } finally {
        (e.target as HTMLInputElement).value = "";
      }
    },
    [mediaState, createURL, extractThumbnails]
  );

  // Remove media file
  const removeMediaFile = useCallback(
    (index: number) => {
      const urlToRemove = mediaState.mediaPreviewUrls[index];
      if (urlToRemove) revokeURL(urlToRemove);

      dispatchMedia({ type: "REMOVE_IMAGE", index });

      const updatedPreviews = [...mediaState.mediaPreviews];
      updatedPreviews.splice(index, 1);
      setFormValues((prev) => ({ ...prev, images: updatedPreviews }));

      toast.success("Image removed");
    },
    [mediaState.mediaPreviews, mediaState.mediaPreviewUrls, revokeURL]
  );

  // Remove video file
  const removeVideoFile = useCallback(
    (index: number) => {
      const videoToRemove = mediaState.videoFiles[index];
      const urlToRemove = mediaState.videoPreviewUrls[index];

      if (!videoToRemove) return;

      if (urlToRemove) revokeURL(urlToRemove);

      const thumbUrls = mediaState.thumbnailUrlsMap[videoToRemove.name] || [];
      thumbUrls.forEach((u) => revokeURL(u));

      const selectedThumbUrl =
        mediaState.selectedThumbnailUrls[videoToRemove.name];
      if (selectedThumbUrl) revokeURL(selectedThumbUrl);

      dispatchMedia({
        type: "REMOVE_VIDEO",
        videoName: videoToRemove.name,
        index,
      });

      toast.success("Video removed");
    },
    [mediaState, revokeURL]
  );

  // Handle thumbnail selection
  const handleThumbnailSelect = useCallback(
    (videoName: string, thumb: File, url: string) => {
      dispatchMedia({
        type: "SELECT_THUMBNAIL",
        videoName,
        thumb,
        url,
      });

      toast.success(`Thumbnail selected for ${videoName}`);
    },
    []
  );

  // Debounced validation
  const validateForm = useCallback(
    async (values: typeof formValues) => {
      try {
        const hasVideo = mediaState.videoFiles.length > 0;
        const schema = getValidationSchema(hasVideo);

        const valuesForValidation = {
          ...values,
          price: values.price === "" ? undefined : Number(values.price),
          bedrooms:
            values.bedrooms === "" ? undefined : Number(values.bedrooms),
          bathrooms:
            values.bathrooms === "" ? undefined : Number(values.bathrooms),
          area: values.area === "" ? undefined : Number(values.area),
        };

        await schema.validate(valuesForValidation, { abortEarly: false });
        setErrors({});
      } catch (err: any) {
        const newErrors: Record<string, string> = {};
        if (err.inner && Array.isArray(err.inner)) {
          err.inner.forEach((ve: any) => {
            if (ve.path && !newErrors[ve.path]) newErrors[ve.path] = ve.message;
          });
        }
        setErrors(newErrors);
      }
    },
    [mediaState.videoFiles.length, getValidationSchema]
  );

  const debouncedValidate = useDebounce(validateForm, 500);

  const [formValuesToSubmit, setFormValuesToSubmit] = useState<
    | null
    | (Omit<ApartmentType, "images"> & { images: File[]; amenities: string[] })
  >(null);

  // Handle submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      if (e) e.preventDefault();

      try {
        setIsSubmitting(true);
        setErrors({});
        setFormStatus(undefined);

        const hasVideo = mediaState.videoFiles.length > 0;
        const validationSchema = getValidationSchema(hasVideo);

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
          priceType: formValues.priceType,
          bedrooms: Number(formValues.bedrooms) || 0,
          bathrooms: Number(formValues.bathrooms) || 0,
          area: Number(formValues.area) || 0,
          amenities: amenitiesArray,
          available: availableBoolean,
          id: "",
          url: "",
          agentId: targetAgentId,
          approved: false,
          views: 0,
          createdAt: new Date().toISOString(),
          images: formValues.images,
          video:
            mediaState.videoFiles.length > 0
              ? mediaState.videoPreviewUrls[0]
              : undefined,
        });

        setPromptOpen(true);
        toast("Ready to upload — confirm to continue", { icon: "📤" });
      } catch (validationErr: any) {
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
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, mediaState, getValidationSchema, targetAgentId]
  );

  // Handle confirm upload
  const handleConfirm = useCallback(async () => {
    if (!formValuesToSubmit) {
      toast.error("No data to upload.");
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

      let filesToUpload: File[] = [...mediaState.mediaPreviews];

      // Add selected thumbnails (kept separate from images)
      for (const videoFile of mediaState.videoFiles) {
        const thumbs = mediaState.thumbnailMap[videoFile.name] || [];
        const selected = mediaState.selectedThumbnails[videoFile.name];

        if (selected) {
          filesToUpload.push(selected);
        } else if (thumbs.length > 0) {
          filesToUpload.push(thumbs[0]);
        }
      }

      const hasVideo = mediaState.videoFiles.length > 0;
      const minFiles = hasVideo ? 1 : 3;

      if (filesToUpload.length < minFiles) {
        throw new Error(
          hasVideo
            ? "At least 1 image (or thumbnail) is required when uploading a video."
            : "At least 3 images are required when not uploading a video."
        );
      }

      toast.loading("Uploading images...", { id: "upload-images" });
      const imageUrls = await uploadFilesToAppwrite(filesToUpload, bucketId);
      toast.dismiss("upload-images");

      if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
        throw new Error(
          "No media files were uploaded successfully. Please try again."
        );
      }

      let videoUrls: string[] = [];
      if (mediaState.videoFiles.length > 0) {
        try {
          toast.loading("Uploading videos...", { id: "upload-videos" });
          const uploadedVideoUrls = await uploadFilesToAppwrite(
            mediaState.videoFiles,
            bucketId
          );
          toast.dismiss("upload-videos");

          if (uploadedVideoUrls && Array.isArray(uploadedVideoUrls)) {
            videoUrls = uploadedVideoUrls;
          } else {
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
        agentId: targetAgentId,
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

      // Only add to user's listed properties if they're uploading their own
      if (!isAdminMode && user?.userType === "agent" && newId) {
        try {
          addListedProperty(newId);
        } catch (e) {
          console.error("addListedProperty failed:", e);
        }
      }

      // Reset form
      setFormValues({
        title: "",
        description: "",
        price: "",
        priceType: "rent",
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

      // Revoke all URLs and reset media state
      revokeAll();
      dispatchMedia({ type: "RESET_ALL" });

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
    }
  }, [
    formValuesToSubmit,
    mediaState,
    targetAgentId,
    isAdminMode,
    user,
    addListedProperty,
    revokeAll,
    router,
  ]);

  // Don't render until access is verified
  if (!accessGranted) {
    return (
      <div className="upload-property">
        <div className="container">
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-property">
      <div className="container">
        {/* Admin Mode Banner */}
        {isAdminMode && (
          <div className="admin-mode-banner">
            <span className="admin-icon">👨‍💼</span>
            <p>
              Uploading for Agent: <strong>{agentName}</strong>
            </p>
          </div>
        )}

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
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px dashed #ddd",
                }}>
                {mediaState.mediaPreviewUrls[0] ? (
                  <img
                    src={mediaState.mediaPreviewUrls[0]}
                    alt="apartment preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "cover",
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

          <div
            style={{ marginBottom: "16px", fontSize: "12px", color: "#666" }}>
            {mediaState.videoFiles.length > 0 ? (
              <p>
                ✓ Video detected: At least 1 image required (thumbnails selected
                from videos will be included automatically)
              </p>
            ) : (
              <p>ℹ️ No video: At least 3 images required</p>
            )}
          </div>

          {mediaState.mediaPreviews.length > 0 && (
            <div className="media-previews-container">
              <span>Selected Images ({mediaState.mediaPreviews.length})</span>
              <div className="media-previews-grid">
                {mediaState.mediaPreviews.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="media-preview-item">
                    <img
                      src={mediaState.mediaPreviewUrls[index]}
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

          {mediaState.videoFiles.length > 0 && (
            <div className="media-previews-container">
              <span>Selected Videos ({mediaState.videoFiles.length})</span>
              <div className="media-previews-grid">
                {mediaState.videoFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="media-preview-item">
                    <div className="video-preview">
                      <video
                        src={mediaState.videoPreviewUrls[index]}
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

          {Object.entries(mediaState.thumbnailMap).map(
            ([videoName, thumbs]) => (
              <div key={videoName} className="thumbnail-preview">
                <span>Select a thumbnail for: {videoName}</span>
                <div>
                  {thumbs.map((thumb, idx) => {
                    const url = mediaState.thumbnailUrlsMap[videoName]?.[idx];
                    return (
                      <img
                        key={thumb.name + idx}
                        className={
                          mediaState.selectedThumbnails[videoName]?.name ===
                          thumb.name
                            ? "active"
                            : ""
                        }
                        src={url}
                        alt={`thumb-${idx}`}
                        width={120}
                        height={80}
                        style={{ width: 120, height: 80, cursor: "pointer" }}
                        onClick={() =>
                          handleThumbnailSelect(videoName, thumb, url || "")
                        }
                      />
                    );
                  })}
                </div>
              </div>
            )
          )}

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={formValues.title}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormValues((p) => ({ ...p, title: newValue }));
                debouncedValidate({ ...formValues, title: newValue });
              }}
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
              onChange={(value) => {
                setFormValues((p) => ({ ...p, description: value }));
                debouncedValidate({ ...formValues, description: value });
              }}
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
              onChange={(e) => {
                const newValue = e.target.value;
                setFormValues((p) => ({ ...p, price: newValue }));
                debouncedValidate({ ...formValues, price: newValue });
              }}
            />
            {errors.price && <div className="error">{errors.price}</div>}
          </div>

          <div className="form-group">
            <label>Price Type</label>
            <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}>
                <input
                  type="radio"
                  name="priceType"
                  value="rent"
                  checked={formValues.priceType === "rent"}
                  onChange={(e) =>
                    setFormValues((p) => ({
                      ...p,
                      priceType: e.target.value as "rent" | "total_package",
                    }))
                  }
                  style={{ marginRight: "8px" }}
                />
                Rent (per year/session)
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}>
                <input
                  type="radio"
                  name="priceType"
                  value="total_package"
                  checked={formValues.priceType === "total_package"}
                  onChange={(e) =>
                    setFormValues((p) => ({
                      ...p,
                      priceType: e.target.value as "rent" | "total_package",
                    }))
                  }
                  style={{ marginRight: "8px" }}
                />
                Total Package (one-time)
              </label>
            </div>
            {errors.priceType && (
              <div className="error">{errors.priceType}</div>
            )}
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
            <label htmlFor="neighborhood_overview">
              Neighborhood Overview (Optional)
            </label>
            <textarea
              id="neighborhood_overview"
              value={formValues.neighborhood_overview}
              onChange={(e) =>
                setFormValues((p) => ({
                  ...p,
                  neighborhood_overview: e.target.value,
                }))
              }
              placeholder="Optional: Describe the neighborhood..."
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
