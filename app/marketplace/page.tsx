import React from "react";
import ItemCard from "../components/cards/itemCard/ItemCard";
import { marketplaceItems } from "../fetch/data/marketplaceItems";
import "./marketplace.css";

function MarketPlace() {
  return (
    <section className="marketplace">
      <div className="container">

        <div className="items">
          {marketplaceItems[0] ? (
            marketplaceItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No item available</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default MarketPlace;
