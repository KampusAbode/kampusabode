"use client";

import React, { useState, useEffect, useCallback } from "react";
import PropStats from "./propertyStats/propStats";
import SaveVisitedProperty from "../functions/SaveVIsitedProperties";
import {
  fetchUsersById,
  fetchReviewsByPropertyId,
  useProperties,
} from "../../../utils";
import Image from "next/image";
import Link from "next/link";
import PropertyImages from "./propertyImages/PropertyImages";
import { ApartmentType, ReviewType, UserType } from "../../../fetch/types";
import toast from "react-hot-toast";
import { formatDistanceToNowStrict } from "date-fns";
import BookingConfirmationModal from "../../../components/modals/BookingConfirmationModal/BookingConfirmationModal";
import "../property.css";
import { useUserStore } from "../../../store/userStore";
import ScheduleInspectionModal from "../../../components/modals/ScheduleInspectionModel/ScheduleInspectionModel";
import Loader from "../../../components/loader/Loader";

interface PropertyDetailsProps {
  id: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ id }) => {
  const { getApartmentById, getApartmentsByIds } = useProperties();
  const [agentDetails, setAgentDetails] = useState<UserType>();
  const [agentPropertyListings, setAgentPropertyListings] = useState<
    ApartmentType[]
  >([]);
  const [propReviews, setPropReviews] = useState<ReviewType[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<ApartmentType | null>(
    null
  );
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isInspectionModelOpen, setInspectionModelOpen] = useState(false);

  const { user } = useUserStore((state) => state);

  // Fetch property details and agent details
  const fetchPropertyDetails = useCallback(async () => {
    try {
      const details = await getApartmentById(id);
      setPropertyDetails(details);
      const agentId = details.agentId;

      const agent = await fetchUsersById(agentId);

      setAgentDetails(agent);
      if (agent) {
        const properties = await getApartmentsByIds(
          "propertiesListed" in agent.userInfo
            ? agent.userInfo.propertiesListed.filter(
                (propertyId: string) => propertyId !== id
              )
            : []
        );
        setAgentPropertyListings(properties);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }, [id]);

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      const reviews = await fetchReviewsByPropertyId(id);
      setPropReviews(reviews as ReviewType[]);
    } catch (error) {
      toast.error("Failed to fetch reviews.");
    }
  }, [id]);

  // Calculate property rating
  const calculateRating = useCallback(() => {
    if (!propReviews.length) return 0;
    return (
      propReviews.reduce((sum, review) => sum + review.rating, 0) /
      propReviews.length
    );
  }, [propReviews]);

  const getFormattedDateDistance = (rawDate: string) => {
    try {
      const formattedDate = rawDate.replace(" at ", " ");
      const date = new Date(formattedDate);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return formatDistanceToNowStrict(date);
    } catch (error) {
      console.error("Error formatting date:", rawDate, error);
      return "Invalid date";
    }
  };

  const handleBookingConfirm = () => {
    if (!user) {
      toast.error("Please log in to confirm your booking.");
      return;
    }
 
    setBookingModalOpen(false);
    setInspectionModelOpen(true);
  };

  const handleInspectionFormSubmit = async (data) => {
    try {
      // Send to your API route
      const res = await fetch("/api/notify-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Inspection booked successfully!");
        setInspectionModelOpen(false);
      } else {
        toast.error("Failed to notify agent. Please try again.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
    fetchReviews();
  }, [id, fetchPropertyDetails, fetchReviews]);

  if (!propertyDetails) {
    return <Loader/>;
  }

  return (
    <SaveVisitedProperty id={id}>
      <section className="properties-details-page">
        <div className="prop-image-details">
          <PropertyImages propertyDetails={propertyDetails} />
        </div>

        <div className="container">
          <div className="top">
            {/* Property Details */}
            <div className="pq">
              <h2 className="title">{propertyDetails.title}</h2>
              <span className="price">
                Total package: ₦{propertyDetails.price.toLocaleString()}{" "}
              </span>
              <div className="features">
                <span>
                  {propertyDetails.bedrooms.toLocaleString()} bedrooms
                </span>
                <span>
                  {propertyDetails.bathrooms.toLocaleString()} bathrooms
                </span>
                <span>{propertyDetails.area.toLocaleString()} sqft</span>
              </div>
              <div className="description">
                <h4>Overview</h4>
                <p>{propertyDetails.description}</p>
              </div>
              <div className="amenities">
                <span>Amenities:</span>
                {propertyDetails.amenities.length > 0 ? (
                  propertyDetails.amenities.map((amenity, index) => (
                    <span key={index}>{amenity}</span>
                  ))
                ) : (
                  <span>No amenities listed.</span>
                )}
              </div>
            </div>

            {/* About Agent */}
            <div className="about-agent">
              <h4>Agent details</h4>
              <div className="agent-details">
                {agentDetails ? (
                  <>
                    <Image
                      priority
                      src={agentDetails?.avatar}
                      width={200}
                      height={200}
                      alt={`${agentDetails.name}'s profile picture`}
                    />
                    <h4>{agentDetails.name}</h4>
                    {"agencyName" in agentDetails.userInfo && (
                      <p>{agentDetails.userInfo.agencyName}</p>
                    )}
                    <span>
                      Properties:{" "}
                      {"propertiesListed" in agentDetails.userInfo
                        ? agentDetails.userInfo.propertiesListed.length.toLocaleString()
                        : 0}
                    </span>
                  </>
                ) : (
                  <p>Agent Details Not Found.</p>
                )}
              </div>
              <div className="agent-stats">
                <PropStats
                  rating={calculateRating()}
                  reviews={propReviews.length}
                />
              </div>
              <div className="bio">
                <p>
                  <strong>Bio: </strong>
                  {agentDetails?.bio || "No bio available."}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="agent-reviews">
            <h4>{`Reviews (${propReviews.length})`}</h4>
            <div className="reviews">
              {propReviews.length ? (
                propReviews.map((review) => (
                  <div key={review.content} className="review-item">
                    <p>"{review.content}"</p>
                    <div>
                      <span>by {review.author.name}</span>
                      <span>{getFormattedDateDistance(review.date)} ago</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews</p>
              )}
            </div>
          </div>

          {/* Agent Listings */}
          <div className="agent-listings">
            <h4>{agentDetails?.name}'s Listed Properties</h4>
            <div>
              {agentPropertyListings.length !== 0 ? (
                <div className="agentProps">
                  {agentPropertyListings.slice(0, 3).map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/apartment/${listing.id}`}
                      className="list-prop">
                      <div className="list-image">
                        <Image
                          priority
                          src={listing.images[0]}
                          width={500}
                          height={500}
                          alt={listing.title}
                        />
                      </div>
                      <div className="list-details">
                        <h5>{listing.title}</h5>
                        <span>{listing.description}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p>"no other listings found"</p>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact">
            <h4>From Kampusabode</h4>
            <p>
              We're excited to help you find your ideal property! Pricing is
              non-negotiable to ensure fairness and transparency. For inquiries,
              feel free to contact us.
            </p>
          </div>
        </div>
      </section>

      <div className="prop-cta">
        <div className="container">
          <span
            className="btn"
            title="Button"
            onClick={() => setBookingModalOpen(true)}>
            inspect apartment
          </span>
          <Link
            className="btn btn-secondary"
            title="Button"
            href={user ? `tel:+2347050721686` : `/auth/login`}>
            Make a call
          </Link>
        </div>
      </div>

      <BookingConfirmationModal
        isOpen={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        apartment={propertyDetails}
        onConfirm={handleBookingConfirm}
      />
      <ScheduleInspectionModal
        isOpen={isInspectionModelOpen}
        onClose={() => setInspectionModelOpen(false)}
        apartment={{ id: propertyDetails.id, title: propertyDetails.title }}
        agentEmail={agentDetails && agentDetails?.email}
        agentNumber={agentDetails && agentDetails?.phoneNumber}
        agencyName={agentDetails && 
          "agencyName" in agentDetails?.userInfo
            ? agentDetails?.userInfo.agencyName
            : ""
        }
        onSubmit={handleInspectionFormSubmit}
      />
    </SaveVisitedProperty>
  );
};

export default PropertyDetails;
