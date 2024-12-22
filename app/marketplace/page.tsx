"use client";

import React, { useEffect, useState } from "react";
import ItemCard from "../components/cards/itemCard/ItemCard";
import { allMarketplaceItems } from "../utils";
import "./marketplace.css";
// import toast from "react-hot-toast";

function MarketPlace() {
  const [martketItems, setMarketItems] = useState([]);

  useEffect(() => {
    const unsubscribe = allMarketplaceItems((fetchedMarketItems) => {
      setMarketItems(fetchedMarketItems);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="marketplace">
      <div className="container">
        <div className="items">
          {martketItems[0] ? (
            martketItems.map((item) => <ItemCard key={item.id} item={item} />)
          ) : (
            <p style={{ textAlign: "center" }}>No item available</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default MarketPlace;
