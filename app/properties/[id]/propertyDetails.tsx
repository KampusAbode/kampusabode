"use client";

import React, { useState, useEffect, useCallback } from "react";
import PropStats from "./components/propertyStats/propStats";
import SaveVisitedProperty from "./functions/SaveVIsitedProperties";
import {
  fetchUsersById,
  fetchReviewsByPropertyId,
  fetchPropertyById,
  fetchPropertiesByIds,
} from "../../utils";
import Image from "next/image";
import Link from "next/link";
import PropertyImages from "./components/propertyImages/PropertyImages";
import type { PropertyType, ReviewType, UserType } from "../../fetch/types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import { formatDistanceToNowStrict } from "date-fns";
import "./property.css";

interface PropertyDetailsProps {
  id: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ id }) => {
  const [agentDetails, setAgentDetails] = useState<UserType | null>(null);
  const [agentPropertyListings, setAgentPropertyListings] = useState<
    PropertyType[]
  >([]);
  const [propReviews, setPropReviews] = useState<ReviewType[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<PropertyType | null>(
    null
  );

  const user = useSelector((state: RootState) => state.userdata);

  // Fetch property details and agent details
  const fetchPropertyDetails = useCallback(async () => {
    try {
      const details = await fetchPropertyById(id);
      setPropertyDetails(details);
      if (propertyDetails) {
        const agent = await fetchUsersById(propertyDetails.agentId);
        setAgentDetails(agent);
        if (agent) {
          const properties = await fetchPropertiesByIds(
            "propertiesListed" in agent.userInfo
              ? agent.userInfo.propertiesListed
                  .filter((property: PropertyType) => property.id !== id)
                  .map((property: PropertyType) => property.id)
              : []
          );
          setAgentPropertyListings(properties);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch property or agent details.");
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

  useEffect(() => {
    fetchPropertyDetails();
    fetchReviews();
  }, [fetchPropertyDetails, fetchReviews]);

  if (!propertyDetails) {
    return <p>Loading...</p>;
  }

  return (
    <SaveVisitedProperty id={id}>
      <section className="properties-details-page">
        <div className="container prop-image-details">
          <PropertyImages propertyDetails={propertyDetails} />
        </div>

        <div className="container">
          <div className="top">
            {/* Property Details */}
            <div className="pq">
              <h2>{propertyDetails.title}</h2>
              <div className="features">
                <span>{propertyDetails.bedrooms} bedrooms</span>
                <span>{propertyDetails.bathrooms} bathrooms</span>
                <span>{propertyDetails.area} sqft</span>
              </div>
              <div className="description">
                <h5>Overview</h5>
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
              <h5>Agent details</h5>
              <div className="agent-details">
                {agentDetails ? (
                  <>
                    <Image
                      src={
                        agentDetails.userInfo?.avatar || "/assets/person1.jpg"
                      }
                      width={500}
                      height={500}
                      alt={`${agentDetails.name}'s profile picture`}
                    />
                    <h5>{agentDetails.name}</h5>
                    {"agencyName" in agentDetails.userInfo && (
                      <p>{agentDetails.userInfo.agencyName}</p>
                    )}
                    <span>
                      Properties:{" "}
                      {"propertiesListed" in agentDetails.userInfo
                        ? agentDetails.userInfo.propertiesListed.length
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
                  {agentDetails?.userInfo?.bio || "No bio available."}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="agent-reviews">
            <h5>{`Reviews (${propReviews.length})`}</h5>
            <div className="reviews">
              {propReviews.length ? (
                propReviews.map((review) => (
                  <div key={review.content} className="review-item">
                    <p>
                      "{review.content}"{" "}
                      <span>{getFormattedDateDistance(review.date)} ago</span>
                    </p>
                  </div>
                ))
              ) : (
                <p>No reviews</p>
              )}
            </div>
          </div>

          {/* Agent Listings */}
          <div className="agent-listings">
            <h5>{agentDetails?.name}'s Listed Properties</h5>
            <div>
              {agentPropertyListings.slice(0, 3).map((listing) => (
                <Link key={listing.id} href={`/properties/${listing.id}`}>
                  <div className="list-prop">
                    <Image
                      src={listing.images[0]}
                      width={500}
                      height={500}
                      alt={listing.title}
                    />
                    <div className="list-details">
                      <h6>{listing.title}</h6>
                      <span>{listing.description}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="contact">
            <h5>From Kampusabode</h5>
            <p>
              We're excited to help you find your ideal property! Pricing is
              non-negotiable to ensure fairness and transparency. For inquiries,
              feel free to contact us.
            </p>
            {user?.userType === "student" && (
              <p>
                Start a conversation with us{" "}
                {user ? (
                  <Link href={`/chat/${user.id}/${user.name}`}>chat now</Link>
                ) : (
                  <Link href="/auth/signup">signup</Link>
                )}
              </p>
            )}
          </div>
        </div>
      </section>
    </SaveVisitedProperty>
  );
};

export default PropertyDetails;
