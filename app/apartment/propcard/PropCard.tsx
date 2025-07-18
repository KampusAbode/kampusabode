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
import { FaLocationDot } from "react-icons/fa6";
import { fetchUsersById } from "../../utils";

interface PropCardType {
  propertyData: ApartmentType;
}

const PropCard: React.FC<PropCardType> = ({ propertyData }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [agentDetails, setAgentDetails] = useState<UserType>();

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
                  priority
                  src={img}
                  width={1800}
                  height={1800}
                  alt={`${propertyData.title} image`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Link>
      </div>
      <div className="card-details">
        <div className="type-price">
          <span className="type">{propertyData.type}</span>
          <span className="available">
            {propertyData.available ? "available" : "not available"}
          </span>
        </div>
        <h5>{propertyData.title}</h5>

        <div>
          <span>{propertyData.location}</span>
          <span className="price">{`₦${propertyData.price}`} total</span>
        </div>
      </div>
    </div>
  );
};

export default PropCard;
