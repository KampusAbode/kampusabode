"use client";

import React, { useEffect, useState } from "react";
import ItemCard from "../components/cards/itemCard/ItemCard";
import { allMarketplaceItems } from "../utils";
import "./marketplace.css";
import Loader from "../components/loader/Loader";
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
            <Loader/>
          )}
        </div>
      </div>
    </section>
  );
}

export default MarketPlace;
