"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addProperty, uploadImagesToAppwrite } from "../../utils";
import toast from "react-hot-toast";
import { PropertyType } from "../../fetch/types";
import "./upload.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CryptoJS from "crypto-js";

const locationOptions = [
  "Asherifa",
  "Oduduwa Estate",
  "Damico Area",
  "Ibadan Road",
  "Parakin Estate",
  "May Fair",
  "Lagere",
];

const typeOptions = [
  "Self Contained",
  "Single Room",
  "Two Bedroom",
  "Three Bedroom",
];

const amenitiesOptions = [
  "Electricity",
  "Water Supply",
  "Internet",
  "Security",
  "Furnished",
  "Air Conditioning",
  "Laundry",
  "Gym",
  "Study Area",
  "Library",
  "Cafeteria",
  "Sports Facilities",
];

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string()
    .max(500, "Description must not exceed 500 characters")
    .required("Description is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),
  location: Yup.string().required("Location is required"),
  neighborhood_overview: Yup.string().required(
    "Neighborhood overview is required"
  ),
  type: Yup.string().required("Type is required"),
  bedrooms: Yup.number()
    .typeError("Bedrooms must be a number")
    .required("Bedrooms are required"),
  bathrooms: Yup.number()
    .typeError("Bathrooms must be a number")
    .required("Bathrooms are required"),
  area: Yup.number()
    .typeError("Area must be a number")
    .required("Area is required"),
  amenities: Yup.array().of(Yup.string()).required("Amenities are required"),
  images: Yup.mixed()
    .test("fileRequired", "At least one image is required", (value) => {
      return value && (value as File[]).length > 0;
    })
    .required("Images are required"),
  available: Yup.boolean().required("Availability is required"),
});

const UploadProperty: React.FC = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user || user.userType !== "agent") {
      toast.error("Access denied. Only agents can upload properties.");
      router.back();
    }
  }, [user, router]);

  const handleSubmit = async (
    values: PropertyType,
    {
      setSubmitting,
      resetForm,
      setStatus,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
      setStatus: (status: { success?: string; error?: string }) => void;
    }
  ) => {
    setSubmitting(true);

    try {
      // Upload images to Appwrite
      const imageUrls = await uploadImagesToAppwrite(
        values.images as unknown as File[],
        process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID!
      );

      // Prepare property data for database insertion
      const propertyData: PropertyType = {
        ...values,
        agentId: user.id,
        images: imageUrls,
        available: Boolean(values.available),
      };

      console.log("Property Data:", propertyData);
      const response = await addProperty(propertyData);
      toast.success(response.success);
      setStatus({ success: "Property uploaded successfully!" });
      resetForm();

      // Update local storage for agent's properties
      if (user.userType === "agent") {
        const storageKey = process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY!;
        const encKey = process.env.NEXT_PUBLIC__ENCSECRET_KEY!;
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
          try {
            const decryptedData = CryptoJS.AES.decrypt(
              storedData,
              encKey
            ).toString(CryptoJS.enc.Utf8);
            const userData: any = JSON.parse(decryptedData);
            if (
              userData.userType === "agent" &&
              userData.userInfo &&
              userData.userInfo.propertiesListed
            ) {
              userData.userInfo.propertiesListed = [
                ...userData.userInfo.propertiesListed,
                response.propertyId,
              ];
              const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(userData),
                encKey
              ).toString();
              localStorage.setItem(storageKey, encryptedData);
            }
          } catch (err) {
            console.error("Error updating local storage:", err);
          }
        }
      }

      // Redirect to the new property's page
      router.push(response.url);
    } catch (error: any) {
      toast.error(error.message);
      setStatus({ error: error.message });
    } finally {
      setSubmitting(false);
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
            id: "",
            url: "",
            agentId: "",
            approved: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage name="title" component="div" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <Field type="number" id="price" name="price" />
                <ErrorMessage name="price" component="div" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="available">Available</label>
                <Field as="select" id="available" name="available">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Field>
                <ErrorMessage
                  name="available"
                  component="div"
                  className="error"
                />
              </div>
              <div className="form-group">
                <label htmlFor="images">Images</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = event.currentTarget.files;
                    if (files) {
                      setFieldValue("images", Array.from(files));
                    }
                  }}
                />
                <ErrorMessage name="images" component="div" className="error" />
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload Property"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UploadProperty;
