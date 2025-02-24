"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { storage, ID } from "../../lib/appwriteClient";
import { addProperty, uploadImagesToAppwrite } from "../../utils";
import toast from "react-hot-toast";
import { PropertyType } from "../../fetch/types";
import "./upload.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

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
  images: Yup.mixed().required("Images are required"),
  available: Yup.boolean().required("Availability is required"),
});

const UploadProperty = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user || user.userType !== "agent") {
      toast.error("Access denied. Only agents can upload properties.");
      router.back(); // Redirect to the previous page
    }
  }, [user, router]);

  

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm, setStatus }: any
  ) => {
    setSubmitting(true);

    try {
      // Upload images to Appwrite
      const imageUrls = await uploadImagesToAppwrite(
        values.images,
        process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID
      );

      // Include the uploaded image URLs in the property data
      const propertyData = {
        ...values,
        agentId: user.id,
        images: imageUrls,
        available: values.available === "true" ? true : false,
      };
      console.log(propertyData);
      const response = await addProperty(propertyData);

      toast.success(response.success);

      setStatus({ success: "Property uploaded successfully!" });
      resetForm();

      // Redirect to the property page
      router.push(response.url);
    } catch (error) {
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
            price: "",
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
            <Form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage name="title" component="div" className="error" />
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
                <Field type="text" id="price" name="price" />
                <ErrorMessage name="price" component="div" className="error" />
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
                <label htmlFor="type">Type</label>
                <Field as="select" id="type" name="type">
                  <option value="">Select Type</option>
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
                <label htmlFor="area">Area (sqft)</label>
                <Field type="number" id="area" name="area" />
                <ErrorMessage name="area" component="div" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="amenities">Amenities (comma separated)</label>
                <Field as="select" id="amenities" name="amenities" multiple>
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
              <div className="form-group">
                <label htmlFor="available">Available</label>
                <Field as="select" id="available" name="available">
                  <option value={"true"}>Yes</option>
                  <option value="false">No</option>
                </Field>
                <ErrorMessage
                  name="available"
                  component="div"
                  className="error"
                />
              </div>
              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload Property"}
              </button>
              {status && status.success && (
                <div className="success">{status.success}</div>
              )}
              {status && status.error && (
                <div className="error">{status.error}</div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UploadProperty;
