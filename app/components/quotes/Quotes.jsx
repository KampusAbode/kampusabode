"use client";

import React from "react";

import data from "../../fetch/contents";
import Image from "next/image";
// import Swiper core and required modules
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Heart, MessageCircle, Quote, Repeat2 } from "lucide-react";

const { homeSection } = data;
const { quotes } = homeSection;

function Quotes() {
  return (
    <div className="quotes">
      <Swiper
        aria-label="Quotes Carousel"
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          1200: {
            spaceBetween: 10,
            slidesPerView: 3,
          },
          780: {
            spaceBetween: 5,
            slidesPerView: 2,
          },
        }}
        centeredSlides={true}>
        {quotes.map((quote) => (
          <SwiperSlide key={quote.name} className="quote">
            <div className="quote-hd">
              <Image src={quote.img} width={400} height={400} alt={quote.name} />
              <i>{quote.name}</i>
            </div>
            <div className="content">
              <Quote aria-hidden="true" size={20} strokeWidth={1.75} />
              <p>{quote.text}</p>
            </div>
            <div className="tractions">
              <span>
                <Heart aria-hidden="true" size={16} strokeWidth={1.75} /> {quote.tractions.like}
              </span>
              <span>
                <MessageCircle aria-hidden="true" size={16} strokeWidth={1.75} /> {quote.tractions.comment}
              </span>
              <span>
                <Repeat2 aria-hidden="true" size={16} strokeWidth={1.75} /> {quote.tractions.repost}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Quotes;
