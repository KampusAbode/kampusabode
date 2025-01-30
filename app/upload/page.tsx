"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {storage, ID } from '../lib/appwriteClient'
import "./upload.css";
import { addProperty } from "../utils";
import toast from "react-hot-toast";
import { PropertyType } from "../fetch/types";

const locationOptions = [
  "Asherifa",
  "Oduduwa Estate",
  "Damico Area",
  "Ibadan Road",
  "Parakin Estate",
  "May Fair",
  "Lagere",
];

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string()
    .max(500, "Description must not exceed 500 characters")
    .required("Description is required"),
  price: Yup.number()
    .typeError("Price must be an integer")
    .integer("Price must be an integer")
    .required("Price is required"),
  location: Yup.string()
    .oneOf(locationOptions, "Invalid location")
    .required("Location is required"),
  bedrooms: Yup.number()
    .integer("Bedrooms must be an integer")
    .min(1, "Must have at least 1 bedroom")
    .required("Bedrooms are required"),
  bathrooms: Yup.number()
    .integer("Bathrooms must be an integer")
    .min(1, "Must have at least 1 bathroom")
    .required("Bathrooms are required"),
  area: Yup.number()
    .integer("Area must be an integer")
    .min(100, "Area must be at least 100 sq ft")
    .required("Area is required"),
  images: Yup.array()
    .min(1, "At least one image is required")
    .max(10, "You must upload at most 10 images")
    .required("Images are required"),
});

const UploadProperty = () => {
  const handleFileUpload = async (files: File[]) => {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uniqueID = ID.unique();
        const response = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID,
          uniqueID,
          file
        );
        return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID}/files/${response.$id}/view?project=678caa89001b08049b5f&mode=admin`;
      })
    );
    return uploadedFiles;
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm, setStatus }: any
  ) => {
    setSubmitting(true);

    try {
      // Upload images to Appwrite
      const imageUrls = await handleFileUpload(values.images);

      // Include the uploaded image URLs in the property data
      const propertyData: PropertyType = { ...values, images: imageUrls };

      const response = await addProperty(propertyData)


      toast.success(response.success)
      // Call the backend function to save the property data (e.g., Firebase or your API)
      console.log("Property data:", propertyData);

      setStatus({ success: "Property uploaded successfully!" });
      resetForm();
    } catch (error) {
      toast.error(error.message)
      setStatus({ error: "Failed to upload Apartment. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const files = Array.from(event.target.files || []);
    setFieldValue("images", files);
  };

  return (
    <section className="upload-page">
      <div className="container">
        <h2 className="page-heading">Upload New Apartment</h2>
        <Formik
          initialValues={{
            title: "",
            description: "",
            price: "",
            location: "",
            bedrooms: 0,
            bathrooms: 0,
            area: 0,
            images: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status, setFieldValue }) => (
            <Form>
              <div>
                <label>Title:</label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter Apartment title"
                />
                <ErrorMessage name="title" component="div" className="error" />
              </div>

              <div>
                <label>Description:</label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter a brief description (max 500 characters)"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="error"
                />
              </div>

              <div>
                <label>Upload Images:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                />
                <ErrorMessage name="images" component="div" className="error" />
              </div>

              <div>
                <label>Price:</label>
                <Field
                  type="number"
                  name="price"
                  placeholder="Enter apartment price"
                />
                <ErrorMessage name="price" component="div" className="error" />
              </div>

              <div>
                <label>Location:</label>
                <Field as="select" name="location">
                  <option value="" label="Select location" />
                  {locationOptions.map((location, index) => (
                    <option key={index} value={location}>
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

              <div>
                <label>Bedrooms:</label>
                <Field
                  type="number"
                  name="bedrooms"
                  placeholder="Enter number of bedrooms"
                />
                <ErrorMessage
                  name="bedrooms"
                  component="div"
                  className="error"
                />
              </div>

              <div>
                <label>Bathrooms:</label>
                <Field
                  type="number"
                  name="bathrooms"
                  placeholder="Enter number of bathrooms"
                />
                <ErrorMessage
                  name="bathrooms"
                  component="div"
                  className="error"
                />
              </div>

              <div>
                <label>Area (sq ft):</label>
                <Field
                  type="number"
                  name="area"
                  placeholder="Enter apartment area in sq ft"
                />
                <ErrorMessage name="area" component="div" className="error" />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn">
                {isSubmitting ? "Uploading..." : "Upload Apartment"}
              </button>
              {status && status.success && (
                <p className="success">{status.success}</p>
              )}
              {status && status.error && (
                <p className="error">{status.error}</p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default UploadProperty;
