"use client"


import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import data from "../../fetch/contents";
import RoomieCard from "../../components/roomimatch/RoomieCard";


// Mock data - replace with actual Firebase data
const mockProfiles = [
  {
    id: "1",
    profilePhoto: "https://i.pravatar.cc/150?img=1",
    fullName: "Sarah Johnson",
    age: 21,
    university: "University of Ibadan",
    yearOfStudy: "Year 2",
    course: "Law",
    gender: "female",
    preferredLocations: ["Bodija", "Agbowo"],
    budgetMin: 80000,
    budgetMax: 120000,
    moveInDate: "2026-01-15",
    sleepSchedule: "night-owl",
    cleanlinessLevel: 4,
    noisePreference: "moderate",
    hobbies: ["Reading", "Music", "Fitness"],
    bio: "Law student looking for a chill roommate who respects boundaries. I love music and staying up late studying. Looking for someone neat and respectful.",
    whatsappNumber: "+2348012345678",
    views: 24,
  },
  {
    id: "2",
    profilePhoto: "https://i.pravatar.cc/150?img=2",
    fullName: "David Okoye",
    age: 22,
    university: "University of Ibadan",
    yearOfStudy: "Year 3",
    course: "Computer Science",
    gender: "male",
    preferredLocations: ["Sango", "Gate"],
    budgetMin: 60000,
    budgetMax: 100000,
    moveInDate: "2026-02-01",
    sleepSchedule: "flexible",
    cleanlinessLevel: 3,
    noisePreference: "quiet",
    hobbies: ["Gaming", "Coding", "Movies"],
    bio: "CS student and gamer. Looking for someone who can tolerate occasional gaming sessions but generally keeps things quiet. Budget-conscious.",
    whatsappNumber: "+2348023456789",
    views: 18,
  },
  {
    id: "3",
    profilePhoto: "https://i.pravatar.cc/150?img=3",
    fullName: "Blessing Adeyemi",
    age: 20,
    university: "University of Ibadan",
    yearOfStudy: "Year 1",
    course: "Medicine",
    gender: "female",
    preferredLocations: ["Bodija", "Samonda", "Mokola"],
    budgetMin: 100000,
    budgetMax: 150000,
    moveInDate: "2026-01-20",
    sleepSchedule: "early-bird",
    cleanlinessLevel: 5,
    noisePreference: "quiet",
    hobbies: ["Reading", "Fitness", "Cooking"],
    bio: "Med student looking for a serious, neat roommate. Early riser who values cleanliness and quiet study time. No parties please!",
    whatsappNumber: "+2348034567890",
    views: 31,
  },
];

const { locations } = data;;

const BrowseRoommates = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState(mockProfiles);
  const [filteredProfiles, setFilteredProfiles] = useState(mockProfiles);
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
    // fetchProfiles();
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
    // incrementProfileViews(profile.id);
  };

  const handleWhatsAppConnect = (profile: any) => {
    const message = encodeURIComponent(
      `Hi ${profile.fullName}! I saw your RoomieMatch profile on Kampus Abode and I think we could be a great match. I'd love to chat about possibly being roommates!`
    );
    window.open(
      `https://wa.me/${profile.whatsappNumber}?text=${message}`,
      "_blank"
    );
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Find Your Roommate
          </h1>
          <p className="text-blue-100">
            {filteredProfiles.length} students looking for roommates
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:underline">
                  Clear All
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full mb-4 px-4 py-2 bg-gray-100 rounded-lg font-medium">
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              <div
                className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) =>
                      setFilters({ ...filters, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    <option value="">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range (₦/year)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.budgetMin}
                      onChange={(e) =>
                        setFilters({ ...filters, budgetMin: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.budgetMax}
                      onChange={(e) =>
                        setFilters({ ...filters, budgetMax: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Sleep Schedule */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Schedule
                  </label>
                  <select
                    value={filters.sleepSchedule}
                    onChange={(e) =>
                      setFilters({ ...filters, sleepSchedule: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    <option value="">Any</option>
                    <option value="early-bird">🌅 Early Bird</option>
                    <option value="night-owl">🦉 Night Owl</option>
                    <option value="flexible">⏰ Flexible</option>
                  </select>
                </div>

                {/* Cleanliness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleanliness Level
                  </label>
                  <select
                    value={filters.cleanlinessLevel}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        cleanlinessLevel: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    <option value="">Any</option>
                    <option value="1">1 - Casual</option>
                    <option value="2">2 - Relaxed</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Clean</option>
                    <option value="5">5 - Very Clean</option>
                  </select>
                </div>

                {/* Noise Preference */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Noise Preference
                  </label>
                  <select
                    value={filters.noisePreference}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        noisePreference: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
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
          <div className="flex-1">
            {filteredProfiles.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No roommates found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or check back later
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProfile(null)}>
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProfile(null)}
                className="float-right text-gray-400 hover:text-gray-600 text-2xl">
                ×
              </button>

              {/* Profile Header */}
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={selectedProfile.profilePhoto}
                  alt={selectedProfile.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">
                    {selectedProfile.fullName}, {selectedProfile.age}
                  </h2>
                  <p className="text-gray-600">
                    {selectedProfile.course} • {selectedProfile.yearOfStudy}
                  </p>
                  <p className="text-gray-600">{selectedProfile.university}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Gender:{" "}
                    {selectedProfile.gender.charAt(0).toUpperCase() +
                      selectedProfile.gender.slice(1)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Housing Preferences
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      <strong>Locations:</strong>{" "}
                      {selectedProfile.preferredLocations.join(", ")}
                    </p>
                    <p className="text-sm">
                      <strong>Budget:</strong> ₦
                      {(selectedProfile.budgetMin / 1000).toFixed(0)}k - ₦
                      {(selectedProfile.budgetMax / 1000).toFixed(0)}k per year
                    </p>
                    <p className="text-sm">
                      <strong>Move-in Date:</strong>{" "}
                      {new Date(
                        selectedProfile.moveInDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Lifestyle</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      <strong>Sleep Schedule:</strong>{" "}
                      {getLifestyleIcon("sleep", selectedProfile.sleepSchedule)}{" "}
                      {selectedProfile.sleepSchedule.replace("-", " ")}
                    </p>
                    <p className="text-sm">
                      <strong>Cleanliness Level:</strong>{" "}
                      {selectedProfile.cleanlinessLevel}/5
                    </p>
                    <p className="text-sm">
                      <strong>Noise Preference:</strong>{" "}
                      {getLifestyleIcon(
                        "noise",
                        selectedProfile.noisePreference
                      )}{" "}
                      {selectedProfile.noisePreference}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Hobbies & Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.hobbies.map(
                      (hobby: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {hobby}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">About</h3>
                  <p className="text-gray-700">{selectedProfile.bio}</p>
                </div>

                <button
                  onClick={() => handleWhatsAppConnect(selectedProfile)}
                  className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
                  💬 Connect on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseRoommates;
