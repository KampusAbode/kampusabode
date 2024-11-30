"use client";
import React, { useState, useEffect } from "react";
import PropStats from "../../components/propertyStats/propStats";
import SaveVisitedProperty from "../../components/functions/SaveVIsitedProperties";
import { agentUsers } from "../../fetch/data/users";
import reviews from "../../fetch/data/reviews";
import Image from "next/image";
import Link from "next/link";
import PropertyImages from "../../components/propertyImages/PropertyImages";
// import ContactAgent from "../../components/contactagent/ContactAgent";
import type { PropertyType } from "../../fetch/types";
import { getProperties } from "../../utils/api";
import "./property.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";



const PropertyDetails = ({ id }) => {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const propertyDetails = properties.find((prop) => prop.id.toString() === id);

<<<<<<< HEAD
  const user = useSelector(
    (state: RootState) => state.user
  );
  console.log(user);
  

=======
    
>>>>>>> 53d010e7337436bb045ea4507fd7077db798da20
  const agentDetails = agentUsers.find((agent) =>
    agent.userInfo?.propertiesListed.some(
      (propList) => propList.id === id
    )
  );

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties = await getProperties();
      setProperties(fetchedProperties);
    };
    fetchProperties();
  }, []);

  const agentPropertyListings = properties.filter((prop) =>
    agentDetails?.userInfo?.propertiesListed.some(
      (propList) =>
        propList.id.toString() === prop.id.toString() &&
        propList.id.toString() !== id
    )
  );

  const propertyReviews = reviews.filter(
    (review) => review.propertyId.toString() === id
  );

  const rating = propertyReviews.length
    ? propertyReviews.reduce((sum, review) => sum + review.rating, 0) /
      propertyReviews.length
    : 0;
  
  if (propertyDetails === undefined) {
      return null;
  }

  return (
    <SaveVisitedProperty id={id}>
      <section className="properties-details-page">
        <div className="container">
          <PropertyImages propertyDetails={propertyDetails} />
        </div>

        <div className="container">
          <div className="top">
            <div className="pq">
              <h2>{propertyDetails?.title}</h2>
              <div className="features">
                <span>{propertyDetails?.bedrooms} bedrooms</span>
                <span>{propertyDetails?.bathrooms} bathrooms</span>
                <span>{propertyDetails?.area} sqft</span>
              </div>
              <p>{propertyDetails?.description}</p>

              <div className="amenities">
                <span>amenities :</span>
                {propertyDetails?.amenities?.length > 0 ? (
                  propertyDetails?.amenities.map((amenity, index) => (
                    <span key={amenity + index}>{amenity}</span>
                  ))
                ) : (
                  <span>No amenities listed.</span>
                )}
              </div>
            </div>

            <div className="about-agent">
              <h5>About Agent</h5>
              <div>
                <div className="agent-details">
                  <Image
                    src={agentDetails?.userInfo?.avatar}
                    width={500}
                    height={500}
                    alt={`${agentDetails?.name} profile picture`}
                  />
                  <h5>{agentDetails?.name}</h5>
                  <p>{agentDetails?.userInfo?.agencyName}</p>
                  <span>
                    properties:{" "}
                    {agentDetails?.userInfo?.propertiesListed.length}
                  </span>
                </div>
                <div className="agent-stats">
                  <PropStats rating={rating} reviews={propertyReviews.length} />
                </div>
                <div className="bio">
                  <p>
                    <strong>Bio: </strong>
                    {agentDetails?.userInfo?.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="agent-reviews">
            <h5> {`Reviews (${propertyReviews.length})`}</h5>
            <div className="reviews">
              {propertyReviews[0]
                ? propertyReviews.map((review) => (
                    <div key={review.content} className="review-item">
                      <p>
                        "{review.content}" <span>{review.date}</span>
                      </p>
                    </div>
                  ))
                : "No reviews"}
            </div>
          </div>

          <div className="agent-listings">
            <h5>{agentDetails?.name}'s Listed properties</h5>
            <div>
              {agentPropertyListings.map((listing) => (
                <Link key={listing.id} href={`/properties/${listing.id}`}>
                  <div className="list-prop">
                    <div className="list-image">
                      <Image
                        src={listing.images[0]}
                        width={500}
                        height={500}
                        alt={listing.title}
                      />
                    </div>
                    <div className="list-details">
                      <p>{listing.title}</p>
                      <span>{listing.description}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="contact">
            <h5>From kampus Abode</h5>
            <div>
              <p>
                We're excited to help you find your ideal property! For most
                listings, pricing is non-negotiable to maintain fairness and
                transparency. However, if you have any inquiries or need further
                information, feel free to contact the listing agent directly
                through WhatsApp using the link below.
              </p>
              {user.userType === "student" ? <p>Start a conversation with us <Link href={"/upload"} className="btn">chat now</Link></p> : <p>{user.userType}</p> }
             
              {/* <p>
                Connect with <strong>{agentDetails?.name}</strong> on WhatsApp{" "}
                <ContactAgent
                  name={agentDetails?.name}
                  content={"Click here"}
                  href={`https://wa.me/2347050721686?text=${encodeURIComponent(
                    `Hello, I’m interested in your listing on Kampus Abode. \n\n Here is the property link: https://kampusabode.vercel.app/properties/${id}`
                  )}`}
                />
              </p> */}
            </div>
          </div>
        </div>
      </section>
    </SaveVisitedProperty>
  );
};

export default PropertyDetails;
