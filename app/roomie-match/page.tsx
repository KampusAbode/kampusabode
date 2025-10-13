"use client"


import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";



const RoomieMatchLanding = () => {
  const router = useRouter();
    //   const { user } = useUserStore();
    const { user } = useUserStore();
  const [activeRoommates, setActiveRoommates] = useState(47); // Mock count

  // useEffect(() => {
  //   // In production, fetch actual count from Firebase
  //   // const fetchCount = async () => {
  //   //   const count = await getActiveRoommatesCount();
  //   //   setActiveRoommates(count);
  //   // };
  //   // fetchCount();
  // }, []);

  const handleCreateProfile = () => {
    if (!user) {
      // Redirect to login
      router.push("/login");
      return;
    }
    router.push("/roomie-match/create");
  };

  const handleBrowseRoommates = () => {
    router.push("/roomie-match/browse");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            {activeRoommates} students actively looking
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Roommate
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Connect with fellow students, share accommodation costs, and make
            university life more affordable and fun! 🏠✨
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleCreateProfile}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200">
              Create My Profile 🚀
            </button>
            <button
              onClick={handleBrowseRoommates}
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
              Browse Roommates 👀
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Student Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Safe & Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How RoomieMatch Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Create Profile</h3>
              <p className="text-gray-600">
                Fill out a quick form about your preferences and lifestyle
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Browse & Match</h3>
              <p className="text-gray-600">
                Discover compatible roommates based on your preferences
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Connect</h3>
              <p className="text-gray-600">
                Chat directly on WhatsApp and plan your move-in together
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Why Use RoomieMatch?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-semibold text-lg mb-2">Save Money</h3>
                <p className="text-gray-600">
                  Split rent and utilities with a compatible roommate
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-lg mb-2">Perfect Match</h3>
                <p className="text-gray-600">
                  Filter by lifestyle, habits, and preferences
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-semibold text-lg mb-2">Safe & Verified</h3>
                <p className="text-gray-600">
                  Connect only with verified university students
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-lg mb-2">Quick & Easy</h3>
                <p className="text-gray-600">
                  Create profile in 5 minutes, start connecting instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Roommate?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join {activeRoommates}+ students already using RoomieMatch
          </p>
          <button
            onClick={handleCreateProfile}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200">
            Get Started Now - It's Free! 🎉
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomieMatchLanding;
