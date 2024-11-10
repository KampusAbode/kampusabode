'use client';

import { useState } from "react";
import { getProperties } from "../../utils/api";
import { PropertyType } from "../../fetch/types";
import Link from "next/link";
import Image from "next/image";

const BookmarkedProperties = ({ user }) => {

  const bookmarkedIds = user?.userInfo.savedProperties;
  const [properties, setProperties] = useState<PropertyType[]>([]);

  async () => {
    const fetchedProperties: PropertyType[] = await getProperties();
    setProperties(fetchedProperties);
  };
  // Filter properties based on bookmarkedIds
  const bookmarkedProperties = properties.filter((property) =>
    bookmarkedIds.includes(property.id)
  );

  return (
    <div className="bookmarked-properties">
      <h4>Your bookmarked properties</h4>
      <div className="property-list">
        {bookmarkedProperties.length > 0 ? (
          <ul>
            {bookmarkedProperties.map((property) => (
              <li key={property.id}>
                <Link href={property.url}>
                  <Image src={property.images[0]} width={800} height={800} alt="property image"/>
                  <div>
                    <p>{property.title}</p>
                    <span>
                      {property.price} - {property.location}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No properties bookmarked yet.</p>
        )}
      </div>
    </div>
  );
};

export default BookmarkedProperties;
