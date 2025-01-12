"use client";

import React, { useEffect, useState } from "react";
import ItemCard from "./component/itemCard/ItemCard";
import { ItemType } from "../fetch/types";
import { allMarketplaceItems } from "../utils";
import "./marketplace.css";
import Loader from "../components/loader/Loader";
import { FaSearch } from "react-icons/fa";
// import toast from "react-hot-toast";

function MarketPlace() {
  const [marketItems, setMarketItems] = useState<ItemType[]>([]);
  const [filteredMarketItems, setFilteredMarketItems] = useState<ItemType[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const itemCategories = ["Furniture", "Electronics"];

  useEffect(() => {
    setLoading(true);
    const unsubscribe = allMarketplaceItems((fetchedMarketItems) => {
      setMarketItems(fetchedMarketItems);
      setFilteredMarketItems(fetchedMarketItems);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setLoading(true);
      searchItems(searchQuery);
      setSearchQuery("");
    }
  };

  const searchItems = (query: string) => {
    const words = query
      .toLowerCase()
      .trim()
      .split(" ")
      .filter((word) => word); // Remove empty words
    if (words.length === 0) {
      setFilteredMarketItems([]); // No search results for empty input
      setLoading(false);
      return;
    }

    const filtered = marketItems.filter((item) => {
      const itemString =
        `${item.name} ${item.description} ${item.price}`.toLowerCase();
      return words.every((word) => {
        const wordRegex = new RegExp(`\\b${word}\\b`, "i"); // Match whole words
        return wordRegex.test(itemString);
      });
    });

    setFilteredMarketItems(filtered);
    setLoading(false);
  };

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredMarketItems(marketItems);
    } else {
      const filtered = marketItems.filter((item) => {
        return item.category.toLowerCase() === category.toLowerCase();
      });
      setFilteredMarketItems(filtered);
    }
    setLoading(false);
  };

  return (
    <section className="marketplace">
      <div className="filter-marketplaceitems">
        <div className="container">
          <div className="search-items">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="search item ..."
            />
            <div
              className="search-icon"
              onClick={() => searchItems(searchQuery)}>
              <FaSearch />
            </div>
          </div>

          <div className="filter-items">
            <span
              className={`category-item ${
                activeCategory === "all" ? "active" : ""
              }`}
              onClick={() => filterByCategory("all")}>
              All
            </span>
            {itemCategories.map((category, index) => (
              <span
                key={index}
                className={`category-item ${
                  activeCategory === category ? "active" : ""
                }`}
                onClick={() => {
                  setLoading(true);
                  filterByCategory(category);
                }}>
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="container">
        {!loading ? (
          filteredMarketItems.length > 0 ? (
            <div className="items">
              {filteredMarketItems.map((item) => (
                <ItemCard key={item.description} item={item} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", marginBlock: "2rem" }}>
              No available item.
            </p>
          )
        ) : (
          <Loader />
        )}
      </div>
    </section>
  );
}

export default MarketPlace;
