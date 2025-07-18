"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import Prompt from "../../../components/modals/prompt/Prompt";
import dynamic from "next/dynamic";
import "./edit.css";

import "react-quill/dist/quill.snow.css";
import {
  uploadImagesToAppwrite,
  deleteAppwriteImage,
  getApartmentById,
  updateapartment,
} from "../../../utils";
import Loader from "../../../components/loader/Loader";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../store/userStore";
import { ApartmentType } from "../../../fetch/types";
import toast from "react-hot-toast";
import { availableMemory, title } from "process";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string()
    .min(50, "Description must be at least 50 characters")
    .max(500, "Description cannot exceed 1500 characters")
    .required("Description is required"),
  // price: Yup.number()
  //   .typeError("Price must be a number")
  //   .required("Price is required")
  //   .min(50000, "Price must be at least ₦80,000"),
  // location: Yup.string().required("Location is required"),
  // neighborhood_overview: Yup.string()
  //   .min(50, "overview must be at least 50 characters")
  //   .max(1500, "Description cannot exceed 1500 characters")
  //   .required("Neighborhood overview is required"),
  // type: Yup.string().required("Property type is required"),
  // bedrooms: Yup.number()
  //   .typeError("Bedrooms must be a number")
  //   .required("Bedrooms count is required"),
  // bathrooms: Yup.number()
  //   .typeError("Bathrooms must be a number")
  //   .required("Bathrooms count is required"),
  // area: Yup.number()
  //   .typeError("Area must be a number")
  //   .required("Area is required"),
  // amenities: Yup.array()
  //   .of(Yup.string())
  //   .min(1, "Select at least one amenity")
  //   .required("Amenities are required"),
  // images: Yup.array()
  //   .min(3, "At least 3 images (or thumbnails) required")
  //   .required("Images are required"),
  available: Yup.boolean().required("Availability is required"),
});

export default function EditApartment({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user } = useUserStore();
  const [apartment, setApartment] = useState<ApartmentType>();
  const [promptOpen, setPromptOpen] = useState(false);
  const [submitPromptOpen, setSubmitPromptOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const formikRef = useRef<FormikProps<any>>(null);
  
  
  // const [selectedThumbnails, setSelectedThumbnails] = useState<
  // Record<string, File>
  // >({});
  // const [deleteImage, setDeleteImage] = useState(null);
  // const [images, setImages] = useState(apartment?.images || []);
  // const [mediaPreviews, setMediaPreviews] = useState<File[]>([]);
  // const [thumbnailMap, setThumbnailMap] = useState<Record<string, File[]>>({});
  // const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (!id) return;

    const getApartment = async () => {
      try {
        const apartmentDetails = await getApartmentById(id);
        console.log("Fetched apartment details:", apartmentDetails);
        if (!apartmentDetails) {
          setError("Apartment not found");
        } else {
          setApartment(apartmentDetails);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch apartment details");
      } finally {
        setLoading(false);
      }
    };

    getApartment();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="error">{error}</p>;
  if (!apartment) return null;

  // const handleImageDelete = (img) => {
  //   setDeleteImage(img);
  //   setPromptOpen(true);
  // };

  // const confirmImageDelete = async () => {
  //   await deleteAppwriteImage(deleteImage);
  //   const updatedImages = [...images];
  //   // updatedImages.slice(deleteImage);
  //   setImages(updatedImages);
  //   setPromptOpen(false);
  //   setDeleteImage(null);
  // };

  // const handleImageUpload = (e) => {
  //   setNewImages([...newImages, ...Array.from(e.target.files)]);
  // };


  const handleConfirmUpdate = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
    setPromptOpen(false);
  };
 


  function handleSubmit(values, { setSubmitting }) {
    setSubmitting(true);
    updateapartment(id, values)
      .then(() => {
        toast.success("Apartment updated successfully!");
        router.push(`/dashboard/${user.name}`);
      })
      .catch((err) => {
        toast.error("Update failed.");
        console.error(err);
      })
      .finally(() => setSubmitting(false));
  }


  return (
    <div className="edit-property">
      <div className="container">
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={{
            title: apartment?.title || "",
            description: apartment?.description || "",
            available: apartment?.available ?? false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ values, setFieldValue, isSubmitting, status }) => (
            <>
              <Form>
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
                    modules={{ toolbar: false }} // hides toolbar completely
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="available">Available</label>
                  <Field
                    as="select"
                    id="available"
                    name="available"
                    onChange={(e) =>
                      setFieldValue("available", e.target.value === "true")
                    }>
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

                <button
                  type="button"
                  className="btn"
                  onClick={() => setPromptOpen(true)}>
                  Upload Property
                </button>
              </Form>

              <Prompt
                isOpen={promptOpen}
                onCancel={() => setPromptOpen(false)}
                message="Are you sure you want to upload this property?"
                onConfirm={handleConfirmUpdate}
              />
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}
