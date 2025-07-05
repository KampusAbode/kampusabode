"use client";

import "./property.css";
import React, { useState, useEffect, useCallback } from "react";
import PropStats from "./components/propertyStats/propStats";
import SaveVisitedProperty from "./functions/SaveVIsitedProperties";
import {
  fetchUsersById,
  fetchReviewsByPropertyId,
} from "../../utils";
import Image from "next/image";
import Link from "next/link";
import PropertyImages from "./components/propertyImages/PropertyImages";
import { ApartmentType, ReviewType, UserType } from "../../fetch/types";
import toast from "react-hot-toast";
import { formatDistanceToNowStrict } from "date-fns";
import BookingConfirmationModal from "../../components/modals/BookingConfirmationModal/BookingConfirmationModal";
import { useUserStore } from "../../store/userStore";
import ScheduleInspectionModal from "../../components/modals/ScheduleInspectionModel/ScheduleInspectionModel";
import Loader from "../../components/loader/Loader";
import { usePropertiesStore } from "../../store/propertiesStore";
// import { sendInspectionEmail } from "../../../utils/sendInspectionEmail";



const PropertyDetails = ({
  params,
}: {
  params: { id: string };
  }) => {
  const { id } = params;
  console.log("Property ID:", id);
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
  const { getPropertyById, getPropertiesByIds } = usePropertiesStore();

  const { user } = useUserStore((state) => state);

  // Fetch property details and agent details
  const fetchPropertyDetails = useCallback(async () => {
    try {
      const details = getPropertyById(id);
      setPropertyDetails(details);
      const agentId = details.agentId;

      const agent = await fetchUsersById(agentId);

      setAgentDetails(agent);
      // console.log("Agent Details:", agent);

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

  const handleBookingConfirm = () => {
    if (!user) {
      toast.error("Please log in to confirm your booking.");
      return;
    }

    setBookingModalOpen(false);
    setInspectionModelOpen(true);
  };

  const handleInspectionFormSubmit = async (userdata: {
    name: string;
    email: string;
    phone: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
  }) => {
    const data: {
      apartmentId: string;
      apartmentTitle: string;
      agentEmail: string;
      agentNumber: string;
      agencyName: string;

      name: string;
      email: string;
      phone: string;
      preferredDate: string;
      preferredTime: string;
      notes?: string;
    } = {
      apartmentId: propertyDetails?.id || "",
      apartmentTitle: propertyDetails?.title || "",
      agentEmail: agentDetails?.email || "",
      agentNumber: agentDetails?.phoneNumber || "",
      agencyName:
        "agencyName" in agentDetails?.userInfo
          ? agentDetails.userInfo.agencyName
          : "",
      ...userdata,
    };
    //  console.log("Form Data:", data);

    try {
      // const emailSent = await sendInspectionEmail(data);

      // if (emailSent.success) {
      //   toast.success("Email sent successfully! Redirecting to WhatsApp...");
      //   console.log("Email sent successfully:", emailSent.message);
      //   console.log("Twilio Message ID:", emailSent.twilioMessageId);

      // } else {
      //   console.error("Failed to send email:", emailSent.message);
      //   toast.error("Failed to send email. Please try again later.");
      //   console.log("Error details:", emailSent.error);

      // }

      // Now handle WhatsApp redirect on the client
      const message = `Hello ${agentDetails.name}, I'm ${
        data.name
      } and I would like to schedule an apartment inspection.\n\n📞 Phone: ${
        data.phone
      }\n📅 Date: ${data.preferredDate}\n⏰ Time: ${
        data.preferredTime
      }\n📝 Note: ${
        data.notes || "No additional notes"
      }\n\nPlease let me know if this works for you.`;

      window.open(
        `https://wa.me/+234${
          agentDetails.phoneNumber
        }?text=${encodeURIComponent(message)}`
      );

      toast.success("Redirecting to WhatsApp...");
      setInspectionModelOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to book inspection");
    }
  };

  useEffect(() => {
    fetchPropertyDetails();
    fetchReviews();
  }, [id, fetchPropertyDetails, fetchReviews]);

  if (!propertyDetails) {
    return <Loader />;
  }

  return (
    <SaveVisitedProperty id={id}>
      <section className="properties-details-page">
        <div className="prop-image-details" data-aos="fade-up">
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
                {/* <p>{propertyDetails.description}</p> */}
                <p
                  dangerouslySetInnerHTML={{
                    __html: propertyDetails.description,
                  }}
                />
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
                      src={
                        agentDetails?.avatar
                          ? agentDetails?.avatar
                          : "/assets/user_avatar.jpg"
                      }
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
                      <span>
                        {getFormattedDateDistance(review.date.toString())} ago
                      </span>
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
            <p>From Kampusabode</p>
            <span>
              We're excited to help you find your ideal property! Pricing is
              non-negotiable to ensure fairness and transparency. For inquiries,
              feel free to contact us.
            </span>
          </div>
        </div>
      </section>

      <div className="prop-cta">
        <div className="container">
          <button
            className="btn"
            title="Book Inspection"
            onClick={() => setBookingModalOpen(true)}>
            Book Inspection
          </button>
          <Link
            className="btn btn-secondary"
            title="Call Agent"
            href={user ? `tel:${agentDetails?.phoneNumber}` : `/auth/login`}>
            Call Agent
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
        apartmentTitle={propertyDetails.title}
        onSubmit={handleInspectionFormSubmit}
      />
    </SaveVisitedProperty>
  );
};

export default PropertyDetails;
