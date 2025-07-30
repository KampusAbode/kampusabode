"use client";

import React, { useState } from "react";
import BookmarkButton from "../../../../components/features/bookmarkbutton/BookmarkButton";
import ShareButton from "../../../../components/features/sharebutton/ShareButton";
import Image from "next/image";
import { ApartmentType } from "../../../../fetch/types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";

function PropertyImages({
  propertyDetails,
}: {
  propertyDetails: ApartmentType;
}) {
  const [imageCount, setImageCount] = useState(0);
  const maxImageCount: number = propertyDetails?.images?.length;

  const incrementImageCount = () => {
    setImageCount((prev) => (prev < maxImageCount - 1 ? prev + 1 : 0));
  };

  const decrementImageCount = () => {
    setImageCount((prev) => (prev > 0 ? prev - 1 : maxImageCount - 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: incrementImageCount,
    onSwipedRight: decrementImageCount,
    trackMouse: true,
  });

  return (
    <div className="property-images">
      <div className="container">
        <div className="display-image" {...handlers}>
          <div className="features">
            <ShareButton />
            <BookmarkButton propertyId={propertyDetails?.id} />
          </div>

          <Image
            priority
            src={propertyDetails?.images[imageCount]}
            width={5000}
            height={5000}
            alt={`${propertyDetails?.title} image`}
          />

          <div className="image-pagination">
            <div className="left" onClick={decrementImageCount}>
              <FaChevronLeft />
            </div>
            <div className="right" onClick={incrementImageCount}>
              <FaChevronRight />
            </div>
          </div>

          <div className="image-counter">
            <span>{imageCount + 1 + "/" + maxImageCount}</span>
          </div>
        </div>

        <div className="control-image">
          {propertyDetails?.images?.map((img: string, index: number) => (
            <Image
              key={index + img}
              src={img}
              width={400}
              height={400}
              alt="property-details thumbnail"
              onClick={() => setImageCount(index)}
              className={imageCount === index ? "active" : ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PropertyImages;
