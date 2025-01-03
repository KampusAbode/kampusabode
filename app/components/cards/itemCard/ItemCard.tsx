import React from "react";
import { ItemType } from "../../../fetch/types";
import Image from "next/image";
import ContactAgent from "../../contactagent/ContactAgent";

const ItemCard = ({ item }: { item: ItemType }) => {
  return (
    <div className="item">
      <div className="item-image">
        <Image src={item.imageUrl} width={800} height={800} alt={item.name} />
        <span>{item.condition}</span>
      </div>
      <h5 className="item-title">{item.name}</h5>
      <p className="item-description">{item.description}</p>
      <div className="bt">
        <span className="item-price">{item.price}</span>
        <ContactAgent
          name={item.sellerContact.name}
          content={`Contact ${item.sellerContact.name.split(" ")[0]}`}
          href={`https://wa.me/2347050721686?text=${encodeURIComponent(
            `Hello ${item.sellerContact.name}, I’m interested in one of your items on Kampusabode. The ${item.name}.`
          )}`}
        />
      </div>
    </div>
  );
};

export default ItemCard;
