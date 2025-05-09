"use client";

import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useUserStore } from "../../../store/userStore";
import "./propertyUploadGuide.css";

function PropertyUploadGuide() {
  const { user } = useUserStore((state) => state);
  return (
    <div className="property-upload-guide">
      <div className="container">
        <h2>Property Upload Guidelines</h2>

        <section>
          <h3>Before You Upload</h3>
          <ol>
            <li>
              Ensure the property is real, available, and ready for student
              accommodation.
            </li>
            <li>
              You must be a verified agent on Kampus Abode to upload properties.
            </li>
            <li>
              Only upload apartments you are legally authorized to list and
              manage.
            </li>
          </ol>
        </section>

        <section>
          <h3>Required Information</h3>
          <ol>
            <li>
              <strong>Property Title:</strong> A short name for the apartment
              (e.g., “2-Bedroom Flat near campus gate”).
            </li>
            <li>
              <strong>Location:</strong> Exact address or description (street
              name, landmarks, etc.).
            </li>
            <li>
              <strong>Type:</strong> Self-contained, single room, flat, shared
              apartment, etc.
            </li>
            <li>
              <strong>Price:</strong> Rent amount .
            </li>
            <li>
              <strong>Features:</strong> Include features like ensuite bathroom,
              kitchen, furnished, electricity, water, etc. in your description.
            </li>
            <li>
              <strong>Photos:</strong> Upload clear, real, and up-to-date images
              of the apartment.
            </li>
            <li>
              <strong>Description:</strong> Provide any additional information
              to help students decide.
            </li>
          </ol>
        </section>

        <section>
          <h3>Terms & Conditions</h3>
          <ol>
            <li>
              False, misleading, or duplicate listings will be removed without
              notice.
            </li>
            <li>
              All listed apartments must be accessible for viewing upon request.
            </li>
            <li>
              Agents are expected to respond to booking requests within 24
              hours.
            </li>
            <li>
              Kampus Abode reserves the right to suspend or ban agents who
              violate listing standards.
            </li>
          </ol>
        </section>

        <div>
          <p>
            <em>
              By continuing to upload, you agree to follow these guidelines and
              uphold the quality of listings on Kampus Abode.
            </em>
          </p>
        </div>

        <div>
          <p>
            If you have any questions or need assistance, please contact our
            support team at{" "}
            <a href="mailto: contactkampusabode@gmail.com">send a mail</a> or
            reach out to us on our
            <a href="https://wa.me/2347050721686" target="_blank">
              {" "}
              WhatsApp
            </a>{" "}
            for immediate assistance.
          </p>
        </div>

        <div className="upload-btn">
          <a href={`/apartment/c/${user?.id}/upload`} className="btn">
            next <FaArrowRightLong />
          </a>
        </div>
      </div>
    </div>
  );
}

export default PropertyUploadGuide;
