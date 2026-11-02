import React from 'react'
import { Filter as FilterIcon, X } from "lucide-react";
import { Button } from "../../button/Button";
import Chip from "../../button/Chip";
import IconButton from "../../button/IconButton";
import './filter.css'

function filter() {
  return (
    <>
      <div className="filter">
        <div className="container">
          <Button
            variant="outline"
            size="md"
            className="sort-trigger-btn"
            leftIcon={
              <FilterIcon aria-hidden="true" size={20} strokeWidth={1.75} />
            }
            onClick={() => setShowFilter(!showFilter)}>
            Sort
          </Button>
          <div className="filter-locations">
            <Chip
              type="button"
              className="filter-chip"
              aria-pressed={activeLocation === "all"}
              onClick={() => filterByLocation("all")}>
              all
            </Chip>
            {data.locations.map((location) => (
              <Chip
                type="button"
                key={location}
                className="filter-chip"
                aria-pressed={
                  activeLocation.toLowerCase() === location.toLowerCase()
                }
                onClick={() => filterByLocation(location.toLowerCase())}>
                {location}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Sliding Filter Component */}
      <div className={`filter-slide ${showFilter ? "show" : ""}`}>
        <div className="filter-overlay" onClick={() => setShowFilter(false)} />

        <div className="filter-content">
          <div className="filter-header">
            <h3>Sort Properties</h3>
            <IconButton
              type="submit"
              className="close-btn"
              aria-label="Close sort options"
              onClick={() => setShowFilter(false)}>
              <X aria-hidden="true" size={20} strokeWidth={1.75} />
            </IconButton>
          </div>

          <div className="sort-options">
            {sortOptions.map((option) => (
              <Chip
                type="button"
                key={option.value}
                className="sort-option"
                aria-pressed={sortBy === option.value}
                leadingIcon={
                  <span className="option-icon" aria-hidden="true">
                    {option.icon}
                  </span>
                }
                onClick={() => handleSortChange(option.value)}>
                {option.label}
              </Chip>
            ))}
          </div>

          <div className="filter-footer">
            <Button
              variant="primary"
              size="md"
              className="apply-btn"
              onClick={() => setShowFilter(false)}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default filter
