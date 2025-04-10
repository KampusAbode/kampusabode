"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useProperties } from "../../utils";
import toast from "react-hot-toast";
import { PropertyType } from "../../fetch/types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import CryptoJS from "crypto-js";
import "./upload.css";

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

// Validdation schema
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
  const { listProperty, uploadPropertyImagesToAppwrite } = useProperties();

  useEffect(() => {
    if (!user || user.userType !== "agent") {
      toast.error("Access denied. Only agents can upload properties.");
      router.back();
    }
  }, [user, router]);

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus }: any
  ) => {
    setSubmitting(true);

    try {
      // Upload images to Appwrite
      const imageUrls = await uploadPropertyImagesToAppwrite(
        values.images,
        process.env.NEXT_PUBLIC_APPWRITE_PROPERTY_BUCKET_ID
      );

      // Prepare property data for database insertion
      const propertyData: PropertyType = {
        ...values,
        agentId: user.id,
        images: imageUrls,
        available: values.available ? true : false,
        approved: false,
      };

      const response = await listProperty(propertyData);
      // Assume response returns: { success: string, url: string, id: string }
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
            // Update propertiesListed array if it exists
            if (
              userData.userType === "agent" &&
              userData.userInfo &&
              userData.userInfo.propertiesListed
            ) {
              userData.userInfo.propertiesListed = [
                ...userData.userInfo.propertiesListed,
                response.id, // New property id returned from listProperty
              ];
              // Encrypt and store updated userData
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
            images: null,
            available: false,
            id: "",
            url: "",
            agentId: "",
            approved: false,
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
                  <option value={"false"}>No</option>
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
