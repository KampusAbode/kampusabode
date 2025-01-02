"use client";

import React, { useState, useEffect } from "react";
import PropStats from "../../components/propertyStats/propStats";
import SaveVisitedProperty from "../../components/functions/SaveVIsitedProperties";
import {
  fetchUsersById,
  fetchReviewsByPropertyId,
  fetchPropertyById,
  fetchPropertiesByIds,
} from "../../utils";
import Image from "next/image";
import Link from "next/link";
import PropertyImages from "../../components/propertyImages/PropertyImages";
import type { PropertyType, ReviewType, UserType } from "../../fetch/types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import "./property.css";

interface PropertyDetailsProps {
  id: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ id }) => {
  const [agentDetails, setAgentDetails] = useState<UserType>();
  const [agentPropertyListings, setAgentPropertyListings] = useState<
    PropertyType[]
  >([]);
  const [propReviews, setPropReviews] = useState<ReviewType[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<PropertyType>();
  const user = useSelector((state: RootState) => state.userdata);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const details = await fetchPropertyById(id);
        console.log(details);
        setPropertyDetails(details);
        fetchAgentDetails(details.agentId);
      } catch {
        toast.error("Failed to fetch property details.");
      }
    };

    fetchPropertyDetails();

    // Fetch Agent Details
    const fetchAgentDetails = async (agentId: string) => {
      if (propertyDetails) {
        try {
          const user = await fetchUsersById(agentId);
          console.log(user);
          if (user && !Array.isArray(user)) {
            setAgentDetails(user);
            fetchAgentPropertyListings(user);
          } else {
            toast.error("Invalid user data");
          }
        } catch (error) {
          toast.error("Failed to fetch agent details.");
        }
      }
    };

    // Fetch Agent Property Listings
    const fetchAgentPropertyListings = async (user) => {
      try {
        const properties = await fetchPropertiesByIds(
          "propertiesListed" in user.userInfo
            ? user.userInfo.propertiesListed.map((property: PropertyType) => property.id !== id)
            : []
        );
        console.log(properties);
        setAgentPropertyListings(properties);
      } catch (error) {
        toast.error("Failed to fetch agent properties.");
      }
    };

    // Fetch Reviews
    const fetchReviews = async () => {
      try {
        const fetchedReviews = (await fetchReviewsByPropertyId(
          id
        )) as ReviewType[];
        console.log(fetchedReviews);
        setPropReviews(fetchedReviews);
      } catch {
        toast.error("Failed to fetch reviews.");
      }
    };
    fetchReviews();
  }, [id]);


  // Calculate Property Rating
  const rating = propReviews?.length
    ? propReviews?.reduce((sum, review: ReviewType) => sum + review.rating, 0) /
      propReviews?.length
    : 0;

  return (
    <SaveVisitedProperty id={id}>
      <section className="properties-details-page">
        <div className="container prop-image-details">
          <PropertyImages propertyDetails={propertyDetails} />
        </div>

        <div className="container">
          {/* Property Details */}
          <div className="top">
            <div className="pq">
              <h2>{propertyDetails?.title}</h2>
              <div className="features">
                <span>{propertyDetails?.bedrooms} bedrooms</span>
                <span>{propertyDetails?.bathrooms} bathrooms</span>
                <span>{propertyDetails?.area} sqft</span>
              </div>
              <p>{propertyDetails?.description}</p>
              <div className="amenities">
                <span>Amenities:</span>
                {propertyDetails?.amenities.length > 0 ? (
                  propertyDetails?.amenities.map((amenity, index) => (
                    <span key={index}>{amenity}</span>
                  ))
                ) : (
                  <span>No amenities listed.</span>
                )}
              </div>
            </div>

            {/* About Agent */}
            <div className="about-agent">
              <h5>About Agent</h5>
              {agentDetails && (
                <div>
                  <div className="agent-details">
                    <Image
                      src={agentDetails?.userInfo.avatar}
                      width={500}
                      height={500}
                      alt={`${agentDetails?.name} profile picture`}
                    />
                    <h5>{agentDetails?.name}</h5>
                    {"agencyName" in agentDetails?.userInfo &&
                      agentDetails?.userInfo.agencyName && (
                        <p>{agentDetails?.userInfo.agencyName}</p>
                      )}
                    <span>
                      Properties:{" "}
                      {"propertiesListed" in agentDetails?.userInfo
                        ? agentDetails?.userInfo.propertiesListed.length
                        : 0}
                    </span>
                  </div>
                  <div className="agent-stats">
                    <PropStats rating={rating} reviews={propReviews?.length} />
                  </div>
                  <div className="bio">
                    <p>
                      <strong>Bio: </strong>
                      {agentDetails?.userInfo.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="agent-reviews">
            <h5>{`Reviews (${propReviews?.length})`}</h5>
            <div className="reviews">
              {propReviews?.length ? (
                propReviews?.map((review) => (
                  <div key={review.content} className="review-item">
                    <p>
                      "{review.content}" <span>{review.date.toString()}</span>
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
              {agentPropertyListings?.slice(0,3).map((listing) => (
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
