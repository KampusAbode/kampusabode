"use client";

import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useUserStore } from "../../../store/userStore";
import "./propertyUploadGuide.css";
import Link from "next/link";

function PropertyUploadGuide() {
  const { user } = useUserStore((state) => state);

  return (
    <div className="property-upload-guide">
      <div className="container">
        <h2>Property Upload Guidelines</h2>

        <section>
          <h3>Getting Started</h3>
          <ol>
            <li>
              Only verified agents on Kampus Abode can upload listings. Make
              sure your profile is verified before proceeding.
            </li>
            <li>
              You must have legal authority to list the apartment and handle
              bookings on behalf of the property owner.
            </li>
            <li>
              Every property must be genuine, currently available, and move-in
              ready for students.
            </li>
          </ol>
        </section>

        <section>
          <h3>What You’ll Need</h3>
          <ol>
            <li>
              <strong>Property Title:</strong> A clear, simple name students can
              understand (e.g., “Self-Contained Room Near Main Gate”).
            </li>
            <li>
              <strong>Location:</strong> Be specific—include street names,
              landmarks, or nearby faculties.
            </li>
            <li>
              <strong>Property Type:</strong> Specify if it’s a self-contained
              unit, shared flat, single room, or full apartment.
            </li>
            <li>
              <strong>Rent Price:</strong> Enter the accurate cost of rent.
            </li>
            <li>
              <strong>Features:</strong> Highlight essentials like water,
              electricity, kitchen, ensuite bathroom, WiFi, or furnishings.
            </li>
            <li>
              <strong>Photos:</strong> Upload real, high-quality, and recent
              images that reflect the current state of the apartment.
            </li>
            <li>
              <strong>Description:</strong> Provide extra context—who it’s best
              suited for, proximity to key places, and unique features.
            </li>
          </ol>
        </section>

        <section>
          <h3>Important Guidelines</h3>
          <ol>
            <li>
              Duplicate, misleading, or false listings will be taken down
              without notice.
            </li>
            <li>
              Listed properties must be open and accessible for student
              inspections when requested.
            </li>
            <li>
              Agents should respond to booking inquiries within 24 hours to
              maintain trust and visibility.
            </li>
            <li>
              Kampus Abode reserves the right to review, restrict, or suspend
              any agent or listing that doesn’t align with our standards.
            </li>
          </ol>
        </section>

        <div className="acknowledgment">
          <p>
            <em>
              By continuing, you confirm that your listing complies with Kampus
              Abode’s upload guidelines. Your commitment helps us maintain a
              safe, trusted space for students.
            </em>
          </p>
        </div>

        <div className="support-info">
          <p>
            Need help? Our team is here to assist you.{" "}
            <Link href="mailto:contactkampusabode@gmail.com">Email us</Link> or
            chat directly on{" "}
            <Link href="https://wa.me/23470121059595" target="_blank">
              WhatsApp
            </Link>
            .
          </p>
        </div>

        <div className="upload-btn">
          <Link href={`/apartment/c/${user?.id}/upload`} className="btn">
            Continue to Upload <FaArrowRightLong />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyUploadGuide;
