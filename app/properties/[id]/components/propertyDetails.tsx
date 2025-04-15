"use client";

import React, { useState, useEffect, useCallback } from "react";
import PropStats from "../components/propertyStats/propStats";
import SaveVisitedProperty from "../functions/SaveVIsitedProperties";
import {
  fetchUsersById,
  fetchReviewsByPropertyId,
  useProperties,
} from "../../../utils";
import Image from "next/image";
import Link from "next/link";
import PropertyImages from "../components/propertyImages/PropertyImages";
import type { PropertyType, ReviewType, UserType } from "../../../fetch/types";
import toast from "react-hot-toast";
import { formatDistanceToNowStrict } from "date-fns";
import "../property.css";
import { useUserStore } from "../../../store/userStore";

interface PropertyDetailsProps {
  id: string;
}



const PropertyDetails: React.FC<PropertyDetailsProps> = ({ id }) => {
  const {
    getPropertyById,
    getPropertiesByIds,
  } = useProperties();
  const [agentDetails, setAgentDetails] = useState<UserType>();
  const [agentPropertyListings, setAgentPropertyListings] = useState<
    PropertyType[]
  >([]);
  const [propReviews, setPropReviews] = useState<ReviewType[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<PropertyType | null>(
    null
  );

  
    const {user} = useUserStore((state) => state);

  // Fetch property details and agent details
  const fetchPropertyDetails = useCallback(async () => {
    try {
      const details = await getPropertyById(id);
      setPropertyDetails(details);
      const agentId = details.agentId;

      const agent = await fetchUsersById(agentId);
      console.log(agent);

      setAgentDetails(agent);
      if (agent) {
        const properties = await getPropertiesByIds(
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

  useEffect(() => {
    fetchPropertyDetails();
    fetchReviews();
  }, [id, fetchPropertyDetails, fetchReviews]);

  if (!propertyDetails) {
    return <p>Loading...</p>;
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
              <h3 className="title">{propertyDetails.title}</h3>
              <span className="price">
                Total package: ₦{propertyDetails.price}{" "}
              </span>
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
                      priority
                      src={agentDetails?.avatar}
                      width={200}
                      height={200}
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
                  {agentDetails?.bio || "No bio available."}
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
            <h5>{agentDetails?.name}'s Listed Properties</h5>
            <div>
              {agentPropertyListings.length !== 0 ? (
                <div className="agentProps">
                  {agentPropertyListings.slice(0, 3).map((listing) => (
                    <Link
                      key={listing.id}
                      href={`/properties/${listing.id}`}
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
                        <h6>{listing.title}</h6>
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
            <h5>From Kampusabode</h5>
            <p>
              We're excited to help you find your ideal property! Pricing is
              non-negotiable to ensure fairness and transparency. For inquiries,
              feel free to contact us.
            </p>
          </div>
        </div>

          <div className="prop-cta">
            <div className='container'>
              <Link
                className="btn"
                href={user ? `/chat/${user.id}/${user.name}` : `/auth/login`}>
                for more info
              </Link>
              <Link
                className="btn btn-secondary"
                href={user ? `tel:+2347050721686` : `/auth/login`}>
                Make a call
              </Link>
            </div>
          </div>
      </section>
    </SaveVisitedProperty>
  );
};

export default PropertyDetails;
