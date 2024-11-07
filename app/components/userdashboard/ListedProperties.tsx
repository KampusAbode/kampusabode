import { properties } from "../../fetch/data/properties";
import { AgentType } from '../../fetch/types';


const ListedProperties = ({ user }: {user: AgentType}) => {
  const { propertiesListed } = user.userInfo; 

  // Filter properties based on IDs in propertiesListed
  const filteredProperties = properties.filter((property) =>
    propertiesListed.some((listedProperty) => listedProperty.id === property.id)
  );

  return (
    <div className="listed-properties">
      <h4>Your Listed Properties</h4>
      <div className="property-list">
        <ul>
          {filteredProperties && filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <li key={property.id}>
                <span>{property.title}</span> <span>₦{property.price}</span>
              </li>
            ))
          ) : (
            <p>You have no listed properties.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ListedProperties;
