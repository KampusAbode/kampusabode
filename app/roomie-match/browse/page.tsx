"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import data from "../../fetch/contents";
import RoomieCard from "../../components/roomimatch/RoomieCard";
import { getRoomieProfiles, incrementProfileViews } from "../../utils/roomieMatchFirebase";
import toast from "react-hot-toast";
import "./BrowseRoomiematches.css";

const { locations } = data;

const BrowseRoommates = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  // Filter state
  const [filters, setFilters] = useState({
    location: "",
    gender: "",
    budgetMin: "",
    budgetMax: "",
    sleepSchedule: "",
    cleanlinessLevel: "",
    noisePreference: "",
  });

  useEffect(() => {
    // In production, fetch profiles from Firebase
    async function fetchProfiles() {
      setIsLoading(true);
      const profilesData = await getRoomieProfiles();
      setProfiles(profilesData);
      setFilteredProfiles(profilesData);
      setIsLoading(false);
    }
    fetchProfiles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    let filtered = [...profiles];

    if (filters.location) {
      filtered = filtered.filter((p) =>
        p.preferredLocations.includes(filters.location)
      );
    }

    if (filters.gender) {
      filtered = filtered.filter((p) => p.gender === filters.gender);
    }

    if (filters.budgetMin) {
      filtered = filtered.filter(
        (p) => p.budgetMax >= parseInt(filters.budgetMin)
      );
    }

    if (filters.budgetMax) {
      filtered = filtered.filter(
        (p) => p.budgetMin <= parseInt(filters.budgetMax)
      );
    }

    if (filters.sleepSchedule) {
      filtered = filtered.filter(
        (p) =>
          p.sleepSchedule === filters.sleepSchedule ||
          p.sleepSchedule === "flexible"
      );
    }

    if (filters.cleanlinessLevel) {
      const level = parseInt(filters.cleanlinessLevel);
      filtered = filtered.filter(
        (p) => Math.abs(p.cleanlinessLevel - level) <= 1
      );
    }

    if (filters.noisePreference) {
      filtered = filtered.filter(
        (p) =>
          p.noisePreference === filters.noisePreference ||
          p.noisePreference === "moderate"
      );
    }

    setFilteredProfiles(filtered);
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      gender: "",
      budgetMin: "",
      budgetMax: "",
      sleepSchedule: "",
      cleanlinessLevel: "",
      noisePreference: "",
    });
  };


  const handleViewProfile = (profile: any) => {
    setSelectedProfile(profile);

    // In production: increment view count in Firebase
    const runViewsincrement = async (profileId: string) => {
      await incrementProfileViews(profileId);
    };
    runViewsincrement (profile.id);
  };

  const handleWhatsAppConnect = (profile: any) => {
  let number = profile.whatsappNumber.trim();

  // Normalize common mistakes or local formats
  if (number.startsWith("0")) {
    // Convert from 07012345678 → +2347012345678
    number = "+234" + number.slice(1);
  } else if (number.startsWith("234")) {
    // Convert from 2347012345678 → +2347012345678
    number = "+" + number;
  } else if (!number.startsWith("+")) {
    // If user enters something like "7012345678"
    number = "+234" + number;
  }

  // Optional: Basic validation to ensure it looks like a Nigerian number
  const phoneRegex = /^\+234\d{10}$/;
  if (!phoneRegex.test(number)) {
    console.error("Invalid WhatsApp number format:", number);
    return toast.error("Invalid WhatsApp number format. Please check and try again.");
  }

  const message = encodeURIComponent(
    `Hi ${profile.fullName}! I saw your RoomieMatch profile on Kampus Abode and I think we could be a great match. I'd love to chat about possibly being roommates!`
  );

  // Open WhatsApp chat
  window.open(`https://wa.me/${number.replace("+", "")}?text=${message}`, "_blank");
};

  const getLifestyleIcon = (type: string, value: any) => {
    const icons: Record<string, string> = {
      "early-bird": "🌅",
      "night-owl": "🦉",
      flexible: "⏰",
      quiet: "🤫",
      moderate: "😊",
      social: "🎉",
    };
    return icons[value] || "✨";
  };

  return (
    <section className="browse-roommates">
      <div className="container">
        {/* Header */}
        <div className="pageHeader">
          <div className="headerContainer">
            <h1 className="headerTitle">Find Your Roommate</h1>
            <p className="headerSubtitle">
              {filteredProfiles.length} students looking for roommates
            </p>
          </div>
        </div>

        <div className="contentContainer">
          <div className="contentFlex">
            {/* Filters Sidebar */}
            <div className="filtersSidebar">
              <div className="filtersCard">
                <div className="filtersHeader">
                  <h2 className="filtersTitle">Filters</h2>
                  <button onClick={clearFilters} className="clearButton">
                    Clear All
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="mobileFilterToggle">
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>

                <div
                  className={`filtersContent ${showFilters ? "" : "hidden"}`}>
                  {/* Location */}
                  <div className="filterField">
                    <label>Location</label>
                    <select
                      value={filters.location}
                      onChange={(e) =>
                        setFilters({ ...filters, location: e.target.value })
                      }>
                      <option value="">All Locations</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gender */}
                  <div className="filterField">
                    <label>Gender</label>
                    <select
                      value={filters.gender}
                      onChange={(e) =>
                        setFilters({ ...filters, gender: e.target.value })
                      }>
                      <option value="">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="filterField">
                    <label>Budget Range (₦/year)</label>
                    <div className="budgetInputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.budgetMin}
                        onChange={(e) =>
                          setFilters({ ...filters, budgetMin: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.budgetMax}
                        onChange={(e) =>
                          setFilters({ ...filters, budgetMax: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Sleep Schedule */}
                  <div className="filterField">
                    <label>Sleep Schedule</label>
                    <select
                      value={filters.sleepSchedule}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sleepSchedule: e.target.value,
                        })
                      }>
                      <option value="">Any</option>
                      <option value="early-bird">🌅 Early Bird</option>
                      <option value="night-owl">🦉 Night Owl</option>
                      <option value="flexible">⏰ Flexible</option>
                    </select>
                  </div>

                  {/* Cleanliness */}
                  <div className="filterField">
                    <label>Cleanliness Level</label>
                    <select
                      value={filters.cleanlinessLevel}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          cleanlinessLevel: e.target.value,
                        })
                      }>
                      <option value="">Any</option>
                      <option value="1">1 - Casual</option>
                      <option value="2">2 - Relaxed</option>
                      <option value="3">3 - Moderate</option>
                      <option value="4">4 - Clean</option>
                      <option value="5">5 - Very Clean</option>
                    </select>
                  </div>

                  {/* Noise Preference */}
                  <div className="filterField">
                    <label>Noise Preference</label>
                    <select
                      value={filters.noisePreference}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          noisePreference: e.target.value,
                        })
                      }>
                      <option value="">Any</option>
                      <option value="quiet">🤫 Quiet</option>
                      <option value="moderate">😊 Moderate</option>
                      <option value="social">🎉 Social</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Profiles Grid */}
            <div className="profilesContainer">
              {filteredProfiles.length === 0 ? (
                <div className="emptyState">
                  <div className="emptyIcon">😕</div>
                  <h3 className="emptyTitle">No roommates found</h3>
                  <p className="emptyText">
                    Try adjusting your filters or check back later
                  </p>
                  <button onClick={clearFilters} className="emptyButton">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="profilesGrid">
                  {filteredProfiles.map((profile) => (
                    <RoomieCard
                      key={profile.id}
                      profile={profile}
                      onViewProfile={handleViewProfile}
                      onWhatsAppConnect={handleWhatsAppConnect}
                      variant="default"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Modal */}
        {selectedProfile && (
          <div
            className="modalOverlay"
            onClick={() => setSelectedProfile(null)}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <div className="modalInner">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="modalCloseButton">
                  ×
                </button>

                {/* Profile Header */}
                <div className="modalHeader">
                  <img
                    src={selectedProfile.profilePhoto}
                    alt={selectedProfile.fullName}
                    className="modalAvatar"
                  />
                  <div className="modalHeaderInfo">
                    <h2 className="modalName">
                      {selectedProfile.fullName}, {selectedProfile.age}
                    </h2>
                    <p className="modalCourse">
                      {selectedProfile.course} • {selectedProfile.yearOfStudy}
                    </p>
                    <p className="modalUniversity">
                      {selectedProfile.university}
                    </p>
                    <p className="modalGender">
                      Gender:{" "}
                      {selectedProfile.gender.charAt(0).toUpperCase() +
                        selectedProfile.gender.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="modalDetails">
                  <div className="detailSection">
                    <h3>Housing Preferences</h3>
                    <div className="detailBox">
                      <p>
                        <strong>Locations:</strong>{" "}
                        {selectedProfile.preferredLocations.join(", ")}
                      </p>
                      <p>
                        <strong>Budget:</strong> ₦
                        {(selectedProfile.budgetMin / 1000).toFixed(0)}k - ₦
                        {(selectedProfile.budgetMax / 1000).toFixed(0)}k per
                        year
                      </p>
                      <p>
                        <strong>Move-in Date:</strong>{" "}
                        {new Date(
                          selectedProfile.moveInDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="detailSection">
                    <h3>Lifestyle</h3>
                    <div className="detailBox">
                      <p>
                        <strong>Sleep Schedule:</strong>{" "}
                        {getLifestyleIcon(
                          "sleep",
                          selectedProfile.sleepSchedule
                        )}{" "}
                        {selectedProfile.sleepSchedule.replace("-", " ")}
                      </p>
                      <p>
                        <strong>Cleanliness Level:</strong>{" "}
                        {selectedProfile.cleanlinessLevel}/5
                      </p>
                      <p>
                        <strong>Noise Preference:</strong>{" "}
                        {getLifestyleIcon(
                          "noise",
                          selectedProfile.noisePreference
                        )}{" "}
                        {selectedProfile.noisePreference}
                      </p>
                    </div>
                  </div>

                  <div className="detailSection">
                    <h3>Hobbies & Interests</h3>
                    <div className="hobbiesContainer">
                      {selectedProfile.hobbies.map(
                        (hobby: string, idx: number) => (
                          <span key={idx} className="hobbyTag">
                            {hobby}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="detailSection">
                    <h3>About</h3>
                    <p className="bioText">{selectedProfile.bio}</p>
                  </div>

                  <button
                    onClick={() => handleWhatsAppConnect(selectedProfile)}
                    className="whatsappButton">
                    💬 Connect on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseRoommates;
