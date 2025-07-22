"use client";

import React from "react";

import data from "../../fetch/contents";
// import Swiper core and required modules
import { Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaQuoteLeft } from "react-icons/fa";
import { FaComment, FaHeart, FaArrowsRotate } from "react-icons/fa6";

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
            {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 0 24 24"
                width="24"
                height="24">
                <path
                  fill="#ff4747"
                  d="m11,7.5v3.5c0,2.206-1.794,4-4,4-.553,0-1-.447-1-1s.447-1,1-1c1.103,0,2-.897,2-2h-1.5c-.828,0-1.5-.672-1.5-1.5v-1.5c0-1.105.895-2,2-2h1.5c.828,0,1.5.672,1.5,1.5Zm5.5-1.5h-1.5c-1.105,0-2,.895-2,2v1.5c0,.828.672,1.5,1.5,1.5h1.5c0,1.103-.897,2-2,2-.553,0-1,.447-1,1s.447,1,1,1c2.206,0,4-1.794,4-4v-3.5c0-.828-.672-1.5-1.5-1.5Zm7.5-2v12c0,2.206-1.794,4-4,4h-2.853l-3.847,3.18c-.361.322-.824.484-1.292.484-.476,0-.955-.168-1.337-.508l-3.749-3.156h-2.923c-2.206,0-4-1.794-4-4V4C0,1.794,1.794,0,4,0h16c2.206,0,4,1.794,4,4Zm-2,0c0-1.103-.897-2-2-2H4c-1.103,0-2,.897-2,2v12c0,1.103.897,2,2,2h3.288c.235,0,.464.083.645.235l4.048,3.409,4.171-3.415c.179-.148.404-.229.637-.229h3.212c1.103,0,2-.897,2-2V4Z"
                />
              </svg> */}
            <div className="quote-hd">
              <Image src={quote.img} alt={quote.name} />
              <i>{quote.name}</i>
            </div>
            <FaQuoteLeft />
            <p>{quote.text}</p>
            <div className="tractions">
              <span>
                <FaHeart /> {quote.tractions.like}
              </span>
              <span>
                <FaComment /> {quote.tractions.comment}
              </span>
              <span>
                <FaArrowsRotate /> {quote.tractions.repost}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Quotes;
