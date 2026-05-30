import React from 'react'
import './filter.css'

function filter() {
  return (
    <>
      <div className="filter">
        <div className="container">
          <button
            className="sort-trigger-btn"
            onClick={() => setShowFilter(!showFilter)}>
            <FaFilter />
            <span>Sort</span>
          </button>
          <div className="filter-locations">
            <span
              className={`filter-btn ${activeLocation === "all" ? "active" : ""}`}
              onClick={() => filterByLocation("all")}>
              all
            </span>
            {data.locations.map((location) => (
              <span
                key={location}
                className={`filter-btn ${
                  activeLocation.toLowerCase() === location.toLowerCase()
                    ? "active"
                    : ""
                }`}
                onClick={() => filterByLocation(location.toLowerCase())}>
                {location}
              </span>
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
            <button className="close-btn" onClick={() => setShowFilter(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="sort-options">
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={`sort-option ${sortBy === option.value ? "active" : ""}`}
                onClick={() => handleSortChange(option.value)}>
                <div className="option-info">
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </div>
                {sortBy === option.value && <FaCheck className="check-icon" />}
              </div>
            ))}
          </div>

          <div className="filter-footer">
            <button className="apply-btn" onClick={() => setShowFilter(false)}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default filter
