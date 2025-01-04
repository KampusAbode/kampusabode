"use client";

import React, { useEffect, useState } from "react";
import ItemCard from "../components/cards/itemCard/ItemCard";
import {ItemType} from '../fetch/types'
import { allMarketplaceItems } from "../utils";
import "./marketplace.css";
import Loader from "../components/loader/Loader";
import { FaSearch } from "react-icons/fa";
// import toast from "react-hot-toast";

function MarketPlace() {
  const [marketItems, setMarketItems] = useState<ItemType[]>([]);
  const [filteredMarketItems, setFilteredMarketItems] =
    useState<ItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const itemCategories = ["Furniture", "Electronics"];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchItems(searchQuery);
    }
  };

  const searchItems = (query: string) => {
    // Implement search logic here
    const words = query.toLowerCase().trim().split(" ");
    const filtered = marketItems.filter((item) => {
      const itemString =
        `${item.name} ${item.description} ${item.price}`.toLowerCase();
      return words.every((word) => itemString.includes(word));
    });
    setFilteredMarketItems(filtered);
  };

  useEffect(() => {
    const unsubscribe = allMarketplaceItems((fetchedMarketItems) => {
      setMarketItems(fetchedMarketItems);
      setFilteredMarketItems(fetchedMarketItems);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="marketplace">
      <div className="filter">
        <div className="container">
          <div className="search-items">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown} // Run search on Enter press
              placeholder="search item ..."
            />
            <div
              className="search-icon"
              onClick={() => searchItems(searchQuery)}>
              <FaSearch />
            </div>
          </div>

          <div className="filter-items">
              {itemCategories.map((category, index) => (
                <span key={index} className="category-item">
                  {category}
                </span>
              ))}
          </div>
        </div>
      </div>  
      <div className="container">
          {!loading ? () : <Loader/>}
      </div>
    </section>
  );
}

export default MarketPlace;
