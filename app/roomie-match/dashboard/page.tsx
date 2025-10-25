"use client"


import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DeleteRoomiematchProfile from "./components/DeleteRoomiematchProfile";

// Mock user profile data
const mockUserProfile = {
  id: "profile-123",
  userId: "user-123",
  fullName: "John Doe",
  profilePhoto: "https://i.pravatar.cc/150?img=5",
  university: "University of Ibadan",
  yearOfStudy: "Year 2",
  course: "Computer Science",
  age: 21,
  gender: "male",
  preferredLocations: ["Bodija", "Agbowo", "Sango"],
  budgetMin: 80000,
  budgetMax: 120000,
  moveInDate: "2026-02-01",
  preferredRoomType: "Self Contained",
  sleepSchedule: "flexible",
  cleanlinessLevel: 4,
  noisePreference: "moderate",
  guestPolicy: "occasional",
  smokingStatus: "non-smoker",
  drinkingStatus: "social-drinker",
  hobbies: ["Gaming", "Coding", "Music", "Sports"],
  bio: "CS student looking for a chill roommate. I enjoy gaming and coding but also like keeping things clean and organized. Flexible and easy-going!",
  funFact: "I can solve a Rubik's cube in under 2 minutes!",
  dealBreakers: "Heavy smoking",
  whatsappNumber: "+2348012345678",
  isVisible: true,
  status: "active",
  views: 47,
  createdAt: "2025-10-01T10:00:00Z",
  updatedAt: "2025-10-13T15:30:00Z",
};

const RoomieDashboard = () => {
  const router = useRouter();
  const [profile, setProfile] = useState(mockUserProfile);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // In production: Fetch user's profile from Firebase
    // const fetchProfile = async () => {
    //   const userProfile = await getUserRoomieProfile(userId);
    //   if (userProfile) setProfile(userProfile);
    // };
    // fetchProfile();
  }, []);

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      // In production: Update visibility in Firebase
      // await toggleProfileVisibility(profile.id, !profile.isVisible);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProfile((prev) => ({ ...prev, isVisible: !prev.isVisible }));

      if (!profile.isVisible) {
        alert("✅ Your profile is now visible to other students!");
      } else {
        alert("🔒 Your profile is now hidden from other students.");
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      alert("Failed to update visibility. Please try again.");
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  const handleMarkAsFound = async () => {
    if (
      !confirm(
        "Have you found a roommate? This will mark your profile as inactive."
      )
    ) {
      return;
    }

    setIsUpdatingStatus(true);
    try {
      // In production: Update status in Firebase
      // await updateProfileStatus(profile.id, 'found');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProfile((prev) => ({ ...prev, status: "found", isVisible: false }));
      alert(
        "🎉 Congratulations on finding a roommate! Your profile has been marked as found."
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReactivate = async () => {
    setIsUpdatingStatus(true);
    try {
      // In production: Update status in Firebase
      // await updateProfileStatus(profile.id, 'active');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProfile((prev) => ({ ...prev, status: "active", isVisible: true }));
      alert("✅ Your profile has been reactivated!");
    } catch (error) {
      console.error("Error reactivating profile:", error);
      alert("Failed to reactivate profile. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      // In production: Delete profile from Firebase
      // await deleteRoomieProfile(profile.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      alert("🗑️ Your RoomieMatch profile has been deleted.");
      router.push("/roomie-match");
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile. Please try again.");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleEditProfile = () => {
    router.push(`/roomie-match/edit/${profile.id}`);
  };

  const getStatusBadge = () => {
    switch (profile.status) {
      case "active":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
            ✓ Active
          </span>
        );
      case "found":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            🎉 Found
          </span>
        );
      case "inactive":
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            ⏸ Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Profile Found
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't created a RoomieMatch profile yet.
          </p>
          <button
            onClick={() => router.push("/roomie-match/create")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            Create Profile Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My RoomieMatch Profile
          </h1>
          <p className="text-gray-600">Manage your roommate search profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Profile Views</p>
                <p className="text-3xl font-bold text-gray-900">
                  {profile.views}
                </p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="mt-1">{getStatusBadge()}</div>
              </div>
              <div className="text-4xl">
                {profile.status === "active"
                  ? "✅"
                  : profile.status === "found"
                    ? "🎉"
                    : "⏸️"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Visibility</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.isVisible ? "Visible" : "Hidden"}
                </p>
              </div>
              <div className="text-4xl">{profile.isVisible ? "👀" : "🔒"}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={handleToggleVisibility}
              disabled={isTogglingVisibility || profile.status !== "active"}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isTogglingVisibility
                ? "Updating..."
                : profile.isVisible
                  ? "🔒 Hide Profile"
                  : "👀 Show Profile"}
            </button>

            <button
              onClick={handleEditProfile}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              ✏️ Edit Profile
            </button>

            {profile.status === "active" ? (
              <button
                onClick={handleMarkAsFound}
                disabled={isUpdatingStatus}
                className="px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                {isUpdatingStatus ? "Updating..." : "🎉 Found Roommate"}
              </button>
            ) : (
              <button
                onClick={handleReactivate}
                disabled={isUpdatingStatus}
                className="px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                {isUpdatingStatus ? "Updating..." : "🔄 Reactivate"}
              </button>
            )}

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
              🗑️ Delete Profile
            </button>
          </div>
        </div>

        {/* Profile Preview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Preview</h2>
            <p className="text-sm text-gray-500">
              This is how others see your profile
            </p>
          </div>

          {/* Profile Card */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-6 mb-6">
              <img
                src={profile.profilePhoto}
                alt={profile.fullName}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {profile.fullName}, {profile.age}
                </h3>
                <p className="text-gray-600 mb-1">
                  📚 {profile.course} • {profile.yearOfStudy}
                </p>
                <p className="text-gray-600 mb-3">🏛️ {profile.university}</p>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    📍 {profile.preferredLocations[0]}
                    {profile.preferredLocations.length > 1 &&
                      ` +${profile.preferredLocations.length - 1}`}
                  </span>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    💰 ₦{(profile.budgetMin / 1000).toFixed(0)}k - ₦
                    {(profile.budgetMax / 1000).toFixed(0)}k
                  </span>
                  <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                    📅{" "}
                    {new Date(profile.moveInDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Sections */}
            <div className="space-y-6">
              {/* Lifestyle Tags */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Lifestyle</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {profile.sleepSchedule === "early-bird"
                      ? "🌅"
                      : profile.sleepSchedule === "night-owl"
                        ? "🦉"
                        : "⏰"}{" "}
                    {profile.sleepSchedule.replace("-", " ")}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    🧹 Cleanliness: {profile.cleanlinessLevel}/5
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    {profile.noisePreference === "quiet"
                      ? "🤫"
                      : profile.noisePreference === "social"
                        ? "🎉"
                        : "😊"}{" "}
                    {profile.noisePreference}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    👥 Guests: {profile.guestPolicy}
                  </span>
                </div>
              </div>

              {/* Hobbies */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Hobbies & Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map((hobby, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">About Me</h4>
                <p className="text-gray-700">{profile.bio}</p>
              </div>

              {/* Fun Fact */}
              {profile.funFact && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Fun Fact</h4>
                  <p className="text-gray-700 italic">"{profile.funFact}"</p>
                </div>
              )}

              {/* Deal Breakers */}
              {profile.dealBreakers && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Deal Breakers
                  </h4>
                  <p className="text-gray-700">{profile.dealBreakers}</p>
                </div>
              )}

              {/* Housing Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Housing Preferences
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-gray-700">
                    <strong>Preferred Locations:</strong>{" "}
                    {profile.preferredLocations.join(", ")}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Room Type:</strong> {profile.preferredRoomType}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Budget:</strong> ₦
                    {profile.budgetMin.toLocaleString()} - ₦
                    {profile.budgetMax.toLocaleString()} per year
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Move-in Date:</strong>{" "}
                    {formatDate(profile.moveInDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              <strong>Created:</strong> {formatDate(profile.createdAt)}
            </p>
            <p className="text-gray-600">
              <strong>Last Updated:</strong> {formatDate(profile.updatedAt)}
            </p>
            <p className="text-gray-600">
              <strong>Profile ID:</strong> {profile.id}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteRoomiematchProfile
          handleDeleteProfile={handleDeleteProfile}
          setShowDeleteConfirm={setShowDeleteConfirm}
        />
      )}
    </div>
  );
};

export default RoomieDashboard;
