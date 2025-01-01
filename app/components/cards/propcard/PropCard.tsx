"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PropertyType } from "../../../fetch/types";
import "./PropCard.css";

// Import Swiper core and required modules
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import BookmarkButton from "../../features/bookmarkbutton/BookmarkButton";
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
        <Swiper
          // modules={[Pagination, Navigation]}
          modules={[Pagination]}
          loop={true}
          // navigation
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}>
          {propertyData.images.map((img: string) => (
            <SwiperSlide key={img}>
              <Image
                src={img}
                width={1000}
                height={1000}
                alt={`${propertyData.title} image`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="card-details">
        <div className="type-price">
          <span className="type">{propertyData.type}</span>
          <span className="price">₦{propertyData.price.toLocaleString()}</span>
        </div>
        <div className="brief">
          <h5>{propertyData.title}</h5>
          <Link href={propertyData.url} className="btn">
            View
          </Link>
        </div>
        <p>
          <FaLocationDot /> {propertyData.location}
        </p>
      </div>
    </div>
  );
};

export default PropCard;
