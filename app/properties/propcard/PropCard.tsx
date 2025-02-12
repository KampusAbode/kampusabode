"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PropertyType } from "../../fetch/types";
import "./PropCard.css";

// Import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import BookmarkButton from "../../components/features/bookmarkbutton/BookmarkButton";
import { FaLocationDot } from "react-icons/fa6";

interface PropCardType {
  propertyData: PropertyType;
}

const PropCard: React.FC<PropCardType> = ({ propertyData }) => {
  return (
    <div className="prop-card">
      <div className="prop-image">
        <div className="actions">
          <BookmarkButton propertyId={propertyData.id} />
        </div>
        <Link href={propertyData.url}>
          <Swiper
            modules={[Pagination]}
            loop={true}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}>
            {propertyData.images.map((img: string, index) => (
              <SwiperSlide key={index}>
                <Image
                  priority
                  src={img}
                  width={1000}
                  height={1000}
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
          <span className="price">{`${
            propertyData.available ? "available" : "not available"
          }`}</span>
        </div>
        <div className="brief">
          <h5>{propertyData.title}</h5>
          <Link
            href={propertyData.url}
            className="btn">{`₦${propertyData.price}`}</Link>
        </div>
        <span>
          <FaLocationDot /> {propertyData.location}
        </span>
      </div>
    </div>
  );
};

export default PropCard;
