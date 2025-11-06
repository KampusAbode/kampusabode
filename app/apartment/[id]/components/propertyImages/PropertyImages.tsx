"use client";

import React, { useState, useRef } from "react";
import BookmarkButton from "../../../../components/features/bookmarkbutton/BookmarkButton";
import ShareButton from "../../../../components/features/sharebutton/ShareButton";
import Image from "next/image";
import { ApartmentType } from "../../../../fetch/types";
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
function PropertyImages({
  propertyDetails,
}: {
  propertyDetails: ApartmentType;
}) {
  const [mediaCount, setMediaCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Combine images and video (if exists) into a single array, with video last
  const allMedia = React.useMemo(() => {
    const media = [...(propertyDetails?.images || [])];
    if (propertyDetails?.video) {
      media.push(propertyDetails.video);
    }
    return media;
  }, [propertyDetails?.images, propertyDetails?.video]);

  const maxMediaCount: number = allMedia.length;

  const incrementMediaCount = () => {
    setMediaCount((prev) => (prev < maxMediaCount - 1 ? prev + 1 : 0));
    setIsPlaying(false);
  };

  const decrementMediaCount = () => {
    setMediaCount((prev) => (prev > 0 ? prev - 1 : maxMediaCount - 1));
    setIsPlaying(false);
  };

  const handlers = useSwipeable({
    onSwipedLeft: incrementMediaCount,
    onSwipedRight: decrementMediaCount,
    trackMouse: true,
  });

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Check if current media is a video
  const isVideo = (url: string) => {
    // Check if this URL is the video URL from the property
    return propertyDetails?.video === url;
  };

  const currentMedia = allMedia[mediaCount];
  const currentIsVideo = isVideo(currentMedia);

  return (
    <div className="property-images">
      <div className="container">
        <div className="display-image" {...handlers}>
          {propertyDetails?.approved && (
            <div className="features">
              <ShareButton />
              <BookmarkButton propertyId={propertyDetails?.id} />
            </div>
          )}

          {currentIsVideo ? (
  <div className="video-container">
    <video
      ref={videoRef}
      src={currentMedia}
      muted
      playsInline
      preload="metadata"
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onClick={togglePlayPause}
    />

    <div className="video-controls" onClick={togglePlayPause}>
      {isPlaying ? <FaPause /> : <FaPlay />}
    </div>
  </div>
) : (
  <Image
    priority
    src={currentMedia}
    width={5000}
    height={5000}
    alt={`${propertyDetails?.title} image`}
  />
)}

          <div className="image-pagination">
            <div className="left" onClick={decrementMediaCount}>
              <FaChevronLeft />
            </div>
            <div className="right" onClick={incrementMediaCount}>
              <FaChevronRight />
            </div>
          </div>

          <div className="image-counter">
            <span>{mediaCount + 1 + "/" + maxMediaCount}</span>
          </div>
        </div>

        <div className="control-image">
          {allMedia.map((media: string, index: number) => (
            <div
              key={index + media}
              onClick={() => setMediaCount(index)}
              className={`thumbnail-container ${mediaCount === index ? "active" : ""}`}>
              {isVideo(media) ? (
  <video
    className={`video-thumbnail ${mediaCount === index ? "active" : ""}`}
    src={media}
    width={60}
    height={60}
    muted
    playsInline
  />
) : (
  <Image
    className={mediaCount === index ? "active" : ""}
    src={media}
    width={400}
    height={400}
    alt="property-details thumbnail"
  />
)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PropertyImages;
