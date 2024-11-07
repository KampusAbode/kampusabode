import React from "react";
import PropStats from "../../components/propertyStats/propStats";
import SaveVisitedProperty from "../../components/functions/SaveVIsitedProperties";
import { properties } from "../../fetch/data/properties";
import { agentUsers } from "../../fetch/data/users";
import reviews from "../../fetch/data/reviews";
import Image from "next/image";
import "./property.css";
import Link from "next/link";
import PropertyImages from "../../components/propertyImages/PropertyImages";
import ContactAgent from "../../components/contactagent/ContactAgent";
// import BackButton from "../../components/features/backbutton/BackButton";

type Params = {
  params: { id: string };
};

export function generateMetadata({ params }: Params) {
  // Fetch the dynamic data based on the property ID
  const { id } = params;
  const propertyDetails = properties.find((prop) => prop.id.toString() === id);

  return {
    title: `${propertyDetails.title} - Kampus Abode`,
    description: propertyDetails.description,
    keywords: "property listings, real estate, apartments, houses",
    openGraph: {
      title: propertyDetails.title,
      description: propertyDetails.description,
      images: [
        {
          url: propertyDetails.images[0],
          width: 800,
          height: 600,
          alt: propertyDetails.title,
        },
      ],
    },
    // Add the favicon link here
    link: [
      {
        rel: "icon",
        href: propertyDetails.images[0], // Path to your favicon
        type: "image/x-icon",
      },
    ],
  };
}

const PropertyDetails = ({ params }: Params) => {
  const id = params.id;
  const propertyDetails = properties.find((prop) => prop.id.toString() === id);
  const agentDetails = agentUsers.find((agent) =>
    agent.userInfo.propertiesListed.some(
      (propList) => propList.id.toString() === id
    )
  );

  if (!propertyDetails || !agentDetails) {
    return <p>Property or agent not found.</p>;
  }


  const agentPropertyListings = properties.filter((prop) =>
    agentDetails.userInfo.propertiesListed.some(
      (propList) =>
        propList.id.toString() === prop.id.toString() &&
        propList.id.toString() !== id
    )
  );
  const propertyReviews = reviews.filter(
    (review) => review.propertyId.toString() === id
  );

  function calculatePropertyRating() {
    // Check if there are any reviews for the property
    if (propertyReviews.length === 0) {
      return 0; // Return 0 if no reviews found
    }

    // Calculate the average rating
    const averageRating =
      propertyReviews.reduce((sum, review) => sum + review.rating, 0) /
      propertyReviews.length;

    return averageRating;
  }

  const rating = calculatePropertyRating();

  return (
    <SaveVisitedProperty  id={id}>
      <div className="properties-details-page">
          {/* <BackButton/> */}

        <div className="container">
          <PropertyImages propertyDetails={propertyDetails} />
        </div>

        <div className="container">
          <div className="top">
            <div className="pq">
              <h2>{propertyDetails.title}</h2>
              <div className="features">
                <span>{propertyDetails.bedrooms} bedrooms</span>
                <span>{propertyDetails.bathrooms} bathrooms</span>
                <span>{propertyDetails.area} sqft</span>
              </div>
              <p>{propertyDetails.description}</p>

              <div className="amenities">
                <span>amenities :</span>
                {propertyDetails.amenities?.length > 0 ? (
                  propertyDetails.amenities.map((amenity, index) => (
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
                    src={agentDetails.avatar}
                    width={500}
                    height={500}
                    alt={`${agentDetails.name} profile picture`}
                    
                  />
                  <h5>{agentDetails.name}</h5>
                  <p>{agentDetails.userInfo.agencyName}</p>
                  <span>
                    properties: {agentDetails.userInfo.propertiesListed.length}
                  </span>
                </div>
                <div className="agent-stats">
                  <PropStats rating={rating} reviews={propertyReviews.length} />
                </div>
                <div className="bio">
                  <p>
                    <strong>Bio: </strong>
                    {agentDetails.bio}
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
            <h5>{agentDetails.name}'s Listed properties</h5>
            <div>
              {agentPropertyListings.map((listings) => (
                <Link key={listings.id} href={`/properties/${listings.id}`}>
                  <div className="list-prop">
                    <div className="list-image">
                      <Image
                        src={listings.images[0]}
                        width={500}
                        height={500}
                        alt={listings.title}
                      />
                    </div>
                    <div className="list-details">
                      <p>{listings.title}</p>
                      <span>{listings.description}</span>
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
              <p>
                Connect with <strong>{agentDetails.name}</strong> on WhatsApp{" "}
                <ContactAgent
                  name={agentDetails.name}
                  content={"Click here"}
                  href={`https://wa.me/2347050721686?text=${encodeURIComponent(
                    `Hello, I’m interested in your listing on Kampus Abode. \n\n Here is the property link: https://kampusabode.vercel.app/properties/${id}`
                  )}`}
                />
                {/* <a
                href={`https://wa.me/${agentDetails.userInfo.phoneNumber}?text=${encodeURIComponent(`Hello, I’m interested in the property listing on Kampus Abode.%0A%0AHere is the property link: https://kampusabode.vercel.app/properties/${id}`)}`}
                target="_blank"
                rel="noopener noreferrer">
                click here
              </a> */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SaveVisitedProperty>
  );
};

export default PropertyDetails;
