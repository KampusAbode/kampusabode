"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import SaveVisitedProperty from "./functions/SaveVIsitedProperties";
import PropertyImages from "./components/propertyImages/PropertyImages";
import PropStats from "./components/propertyStats/propStats";
import { formatDistanceToNowStrict } from "date-fns";
import {
  fetchUsersById,
  fetchReviewsByPropertyId,
  fetchPropertyById,
  fetchPropertiesByIds,
} from "../../utils";
import type { PropertyType, ReviewType, UserType } from "../../fetch/types";
import "./property.css";

interface PropertyDetailsProps {
  id: string;
}

// Utility to format dates
const getFormattedDateDistance = (rawDate: string): string => {
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

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ id }) => {
  const [propertyDetails, setPropertyDetails] = useState<PropertyType | null>(
    null
  );
  const [agentDetails, setAgentDetails] = useState<UserType | null>(null);
  const [agentPropertyListings, setAgentPropertyListings] = useState<
    PropertyType[]
  >([]);
  const [propReviews, setPropReviews] = useState<ReviewType[]>([]);

  const user = useSelector((state: RootState) => state.userdata);

  // Fetch property details, agent, and reviews
  const fetchDetails = useCallback(async () => {
    try {
      const [details, reviews] = await Promise.all([
        fetchPropertyById(id),
        fetchReviewsByPropertyId(id),
      ]);

      setPropertyDetails(details);
      setPropReviews(reviews as ReviewType[]);

      if (details) {
        const agent = await fetchUsersById(details.agentId);
        setAgentDetails(agent);

        if (agent && "propertiesListed" in agent.userInfo) {
          const otherProperties = await fetchPropertiesByIds(
            agent.userInfo.propertiesListed
              .filter((property) => property.id !== id)
              .map((property) => property.id)
          );
          setAgentPropertyListings(otherProperties);
        }
      }
    } catch (error) {
      toast.error("Failed to load property details. Please try again.");
    }
  }, [id]);

  // Calculate property rating
  const calculateRating = () => {
    if (!propReviews.length) return 0;
    return (
      propReviews.reduce((sum, review) => sum + review.rating, 0) /
      propReviews.length
    );
  };

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  if (!propertyDetails) return <p>Loading...</p>;

  return (
    <SaveVisitedProperty id={id}>
      <section className="properties-details-page">
        <div className="container prop-image-details">
          <PropertyImages propertyDetails={propertyDetails} />
        </div>

        <div className="container">
          {/* Property Info */}
          <PropertyInfo propertyDetails={propertyDetails} />

          {/* Agent Details */}
          <AgentDetails
            agentDetails={agentDetails}
            agentPropertyListings={agentPropertyListings}
            calculateRating={calculateRating}
            propReviews={propReviews}
          />

          {/* Reviews Section */}
          <ReviewsSection reviews={propReviews} />

          {/* Contact Section */}
          <ContactSection user={user} />
        </div>
      </section>
    </SaveVisitedProperty>
  );
};

export default PropertyDetails;

// Subcomponents for better modularity

const PropertyInfo: React.FC<{ propertyDetails: PropertyType }> = ({
  propertyDetails,
}) => (
  <div className="pq">
    <h2>{propertyDetails.title}</h2>
    <div className="features">
      <span>{propertyDetails.bedrooms} bedrooms</span>
      <span>{propertyDetails.bathrooms} bathrooms</span>
      <span>{propertyDetails.area} sqft</span>
    </div>
    <p>{propertyDetails.description}</p>
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
);

const AgentDetails: React.FC<{
  agentDetails: UserType | null;
  agentPropertyListings: PropertyType[];
  calculateRating: () => number;
  propReviews: ReviewType[];
}> = ({
  agentDetails,
  agentPropertyListings,
  calculateRating,
  propReviews,
}) => (
  <div className="about-agent">
    <h5>About Agent</h5>
    {agentDetails ? (
      <>
        <Image
          src={agentDetails.userInfo?.avatar || "/assets/person1.jpg"}
          width={500}
          height={500}
          alt={`${agentDetails.name}'s profile`}
        />
        <h5>{agentDetails.name}</h5>
        <PropStats rating={calculateRating()} reviews={propReviews.length} />
      </>
    ) : (
      <p>Agent Details Not Found.</p>
    )}
    <div>
      <h5>{agentDetails?.name}'s Listings</h5>
      {agentPropertyListings.map((listing) => (
        <Link key={listing.id} href={`/properties/${listing.id}`}>
          <div className="list-prop">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              width={500}
              height={500}
            />
            <div className="list-details">
              <h6>{listing.title}</h6>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const ReviewsSection: React.FC<{ reviews: ReviewType[] }> = ({ reviews }) => (
  <div className="agent-reviews">
    <h5>{`Reviews (${reviews.length})`}</h5>
    {reviews.length > 0 ? (
      reviews.map((review) => (
        <div key={review.content} className="review-item">
          <p>
            "{review.content}"{" "}
            <span>{getFormattedDateDistance(review.date)} ago</span>
          </p>
        </div>
      ))
    ) : (
      <p>No reviews yet.</p>
    )}
  </div>
);

const ContactSection: React.FC<{ user: RootState["userdata"] }> = ({
  user,
}) => (
  <div className="contact">
    <h5>Contact Kampusabode</h5>
    <p>We’re here to help you find your perfect property!</p>
    {user?.userType === "student" && (
      <p>
        <Link href={user ? `/chat/${user.id}/${user.name}` : "/auth/signup"}>
          {user ? "Chat now" : "Sign up"}
        </Link>
      </p>
    )}
  </div>
);
