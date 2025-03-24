"use client";

import React, { useEffect, useState } from "react";
import ItemCard from "./component/itemCard/ItemCard";
import { ItemType } from "../fetch/types";
import { allMarketplaceItems } from "../utils";
import "./marketplace.css";
import Loader from "../components/loader/Loader";
import { FaSearch } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import  {constants}  from "./component/constant";
import Image from "next/image";


function MarketPlace() {
  const [marketItems, setMarketItems] = useState<ItemType[]>([]);
  const [filteredMarketItems, setFilteredMarketItems] = useState<ItemType[]>(
    []
  );
  const [latestItems, setLatestItems] = useState<ItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const itemCategories = ["Furniture", "Electronics"];

  useEffect(() => {
    setLoading(true);
    const unsubscribe = allMarketplaceItems((fetchedMarketItems) => {
      const sortedItems = [...fetchedMarketItems].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setMarketItems(sortedItems);
      setFilteredMarketItems(sortedItems);
      setLatestItems(sortedItems.slice(0, 5)); // Get the latest 5 items
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
      .filter((word) => word);
    if (words.length === 0) {
      setFilteredMarketItems([]);
      setLoading(false);
      return;
    }

    const filtered = marketItems.filter((item) => {
      const itemString =
        `${item.name} ${item.description} ${item.price}`.toLowerCase();
      return words.every((word) => {
        const wordRegex = new RegExp(`\\b${word}\\b`, "i");
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
      <div className="container">
        <span
          style={{
            textAlign: "center",
            display: "block",
            marginBottom: "3rem",
          }}>
          {constants.intro_text}
        </span>
      </div>
      <div className="container">
        <h5 className="section-title">Latest Items</h5>
        <Swiper
          loop={true}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1.8}
          spaceBetween={10}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="latest-items-swiper">
          {latestItems.map((item) => (
            <SwiperSlide key={item.description}>
              <div className="latest">
                <div className="latest-img">
                  <Image
                    priority
                    src={item.imageUrl}
                    width={800}
                    height={800}
                    alt={item.name}
                  />
                </div>
                <h6>{item.name}</h6>
                <span>{item.price}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
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
            {constants.item_categories.map((category, index) => (
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
