'use client'

import React, { useState } from 'react'
import BookmarkButton from '../features/bookmarkbutton/BookmarkButton';
import ShareButton from '../features/sharebutton/ShareButton';
// import Image from 'next/image';
import { PropertyType } from '../../fetch/types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';




function PropertyImages({ propertyDetails }: { propertyDetails: PropertyType }) {
  const [imageCount, setImageCount] = useState(0);
  const maxImageCount: number = propertyDetails?.images?.length;

  const increamentImageCount = () => {
    if (imageCount < maxImageCount - 1) {
      setImageCount((prevCount) => prevCount + 1);
    } else {
      setImageCount(0);
    }
  };

  const decreamentImageCount = () => {
    if (imageCount > 0) {
      setImageCount((prevCount) => prevCount - 1);
    } else {
      setImageCount(maxImageCount - 1);
    }
  };
  return (
    <div className="property-images">
      <div className="display-image">
        <div className="features">
          <ShareButton />
          <BookmarkButton propertyId={propertyDetails?.id} />
        </div>
        <img
          src={propertyDetails?.images[imageCount]}
          width={1000}
          height={1000}
          alt={`${propertyDetails?.title} image`}
        
        />
        <div className="image-pagination">
          <div className="left" onClick={decreamentImageCount}>
            <FaChevronLeft />
          </div>
          <div className="right" onClick={increamentImageCount}>
            <FaChevronRight />
          </div>
        </div>
        <div className="image-counter">
          <span>{imageCount + 1 + "/" + maxImageCount}</span>
        </div>
      </div>
      <div className="control-image">
        {propertyDetails?.images?.map((img: string, index: number) => (
          <img
            key={index + img}
            src={img}
            width={500}
            height={500}
            alt="property-details thumbnail"
            onClick={() => setImageCount(index)}
            className={imageCount === index ? "active" : ""}
           
          />
        ))}
      </div>
    </div>
  );
}

export default PropertyImages