"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ApartmentType, UserType } from "../../fetch/types";
import "./PropCard.css";

// Import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import navigation styles
import BookmarkButton from "../../components/features/bookmarkbutton/BookmarkButton";
import { BadgeCheck, MapPin, Play, Sparkles } from "lucide-react";
import { fetchUsersById } from "../../utils";
import PropertyDetails from "../[id]/page";

interface PropCardType {
  propertyData: ApartmentType;
}

const PropCard: React.FC<PropCardType> = ({ propertyData }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [agentDetails, setAgentDetails] = useState<UserType>();
  const isVerified =
    "isVerified" in propertyData && propertyData.isVerified === true;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Adjust breakpoint if needed
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    const fetchAgentDetails = async () => {
      const fetchedAgentDetails = await fetchUsersById(propertyData.agentId);

      setAgentDetails(fetchedAgentDetails);
    };

    fetchAgentDetails();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="prop-card">
      <div className="prop-image">
        <div className="actions">
          <BookmarkButton propertyId={propertyData.id} />
        </div>
        {isVerified && (
          <span className="verified-badge">
            <BadgeCheck aria-hidden="true" size={15} strokeWidth={1.8} />
            Verified
          </span>
        )}
        {/* {agentDetails && (
          <div className="agent-image">
            <Image
              priority
              src={agentDetails?.avatar}
              width={800}
              height={800}
              alt={`${propertyData.title} image`}
            />
            <span>
              {agentDetails?.userType === "agent" &&
              "agencyName" in agentDetails.userInfo
                ? agentDetails.userInfo.agencyName
                : ""}
            </span>
          </div>
        )} */}
        <Link prefetch href={propertyData.url}>
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{ clickable: true, dynamicBullets: true }}
            loop={true}
            spaceBetween={0}
            slidesPerView={1}
            navigation={isDesktop ? true : false}>
            {propertyData.images.map((img: string, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={img}
                  width={1800}
                  height={1800}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                  alt={`${propertyData.title} image`}
                />
              </SwiperSlide>
            ))}
            {propertyData.video && (
              <SwiperSlide>
                <div
                  className="video-container"
                  onClick={(e) => {
                    const video = e.currentTarget.querySelector("video");
                    if (video) {
                      if (video.paused) {
                        video.play();
                        e.currentTarget
                          .querySelector(".video-play-icon")
                          ?.classList.add("hidden");
                      } else {
                        video.pause();
                        e.currentTarget
                          .querySelector(".video-play-icon")
                          ?.classList.remove("hidden");
                      }
                    }
                  }}>
                  <video
                    src={propertyData.video}
                    width={1800}
                    height={1800}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="video-play-icon">
                    <Play aria-hidden="true" size={24} fill="currentColor" />
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </Link>
      </div>
      <div className="card-details">
        {/* <span className="available">
          {propertyData.available ? "available" : "not available"}
        </span> */}

        <div className="location-price">
          <div>
            {/* <span className="type">{propertyData.type}</span> - */}
            <span className="location">
              <MapPin aria-hidden="true" size={15} strokeWidth={1.75} />
              {propertyData.location}
            </span>
          </div>

          <span className="price">
            {`₦${propertyData.price} `}
            {/* {propertyData.priceType === "rent" ? "rent" : "total"} */}
          </span>
        </div>
        <span className="property-title">{propertyData.title}</span>
        {Array.isArray(propertyData.amenities) &&
          propertyData.amenities.length > 0 && (
            <div className="amenities">
              {propertyData.amenities.slice(0, 2).map((amenity) => (
                <span className="amenity" key={amenity}>
                  <Sparkles
                    aria-hidden="true"
                    size={14}
                    strokeWidth={1.75}
                  />
                  {amenity}
                </span>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default PropCard;
