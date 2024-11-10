"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addProperty } from "../utils/api";
import { PropertyType } from "../fetch/types";

const locationOptions = [
  "asherifa",
  "oduduwa estate",
  "damico area",
  "ibadan road",
  "parakin estate",
  "may fair",
  "lagere",
];

// Define validation schema with Yup
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
});

const UploadProperty = () => {
  const initialValues: PropertyType = {
    id: 0,
    url: "",
    agentId: 0,
    title: "",
    description: "",
    price: "",
    location: "",
    neighborhood_overview: "",
    type: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    amenities: [],
    images: [],
    saved: false,
    available: true,
  };

  const handleSubmit = async (
    values: PropertyType,
    { setSubmitting, resetForm, setStatus }
  ) => {
    setSubmitting(true);
    try {
      await addProperty(values);
      setStatus({ success: "Property uploaded successfully!" });
      resetForm();
    } catch (error) {
      setStatus({ error: "Failed to upload property. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Upload New Property</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting, status }) => (
          <Form>
            <div>
              <label>Title:</label>
              <Field
                type="text"
                name="title"
                placeholder="Enter property title"
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
              <ErrorMessage name="location" component="div" className="error" />
            </div>

            <div>
              <label>Bedrooms:</label>
              <Field
                type="number"
                name="bedrooms"
                placeholder="Enter number of bedrooms"
              />
              <ErrorMessage name="bedrooms" component="div" className="error" />
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

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Upload Property"}
            </button>
            {status && status.success && (
              <p className="success">{status.success}</p>
            )}
            {status && status.error && <p className="error">{status.error}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UploadProperty;
