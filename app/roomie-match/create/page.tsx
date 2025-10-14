"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import data from "../../fetch/contents";
import {StudentUserInfo} from "../../fetch/types";
import { useUserStore } from "../../store/userStore";

// Mock data - replace with your actual data
// const user? = {
//   id: "123",
//   profilePhoto: "https://via.placeholder.com/150",
//   name: "John Doe",
//   university: "University of Ibadan",
//   yearOfStudy: "Year 2",
// };

const courseOptions = [
  "Computer Science",
  "Engineering",
  "Medicine",
  "Law",
  "Business Administration",
  "Economics",
  "Psychology",
  "Estate Management",
  "Accounting",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "English",
  "History",
  "Political Science",
  "Sociology",
  "Other",
];

const {locations} = data;

const roomTypeOptions = [
  "Self Contained",
  "Single Room",
  "Two Bedroom",
  "Three Bedroom",
];

const hobbyOptions = [
  "Reading",
  "Music",
  "Sports",
  "Gaming",
  "Cooking",
  "Movies",
  "Traveling",
  "Photography",
  "Art",
  "Dancing",
  "Writing",
  "Fitness",
];

const CreateRoomieProfile = () => {
  const router = useRouter();
  const {user} = useUserStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);


  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Basic Info (auto-filled from Zustand)
    course: "",
    gender: "" as "male" | "female" | "non-binary" | "prefer-not-to-say" | "",
    age: "",

    // Step 2: Housing Preferences
    lookingFor: "" as "specific-property" | "any-property" | "",
    specificPropertyId: "",
    preferredLocations: [] as string[],
    budgetMin: "",
    budgetMax: "",
    moveInDate: "",
    preferredRoomType: "",

    // Step 3: Lifestyle
    sleepSchedule: "" as "early-bird" | "night-owl" | "flexible" | "",
    cleanlinessLevel: 3 as 1 | 2 | 3 | 4 | 5,
    noisePreference: "" as "quiet" | "moderate" | "social" | "",
    guestPolicy: "" as
      | "no-guests"
      | "occasional"
      | "frequent"
      | "flexible"
      | "",
    smokingStatus: "" as "non-smoker" | "smoker" | "no-preference" | "",
    drinkingStatus: "" as
      | "non-drinker"
      | "social-drinker"
      | "no-preference"
      | "",
    hobbies: [] as string[],

    // Step 4: About
    bio: "",
    funFact: "",
    dealBreakers: "",
    whatsappNumber: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check for missing user profile fields on mount
  useEffect(() => {
    const missing: string[] = [];
    if (!user?.avatar) missing.push("Profile Photo");
    if (!user?.name) missing.push("Name");
    if (!user?.university) missing.push("University");
    if (user?.userType === "student" && !(user.userInfo as StudentUserInfo).currentYear) {
  missing.push("Year of Study");
}

    if (missing.length > 0) {
      setMissingFields(missing);
    }
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleArrayItem = (
    field: "preferredLocations" | "hobbies",
    item: string
  ) => {
    setFormData((prev) => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i) => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.course) newErrors.course = "Course is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (
          !formData.age ||
          parseInt(formData.age) < 16 ||
          parseInt(formData.age) > 100
        ) {
          newErrors.age = "Valid age is required (16-100)";
        }
        break;

      case 2:
        if (!formData.lookingFor)
          newErrors.lookingFor = "Please select an option";
        if (formData.preferredLocations.length === 0) {
          newErrors.preferredLocations = "Select at least one location";
        }
        if (!formData.budgetMin || parseInt(formData.budgetMin) < 0) {
          newErrors.budgetMin = "Valid minimum budget is required";
        }
        if (
          !formData.budgetMax ||
          parseInt(formData.budgetMax) < parseInt(formData.budgetMin)
        ) {
          newErrors.budgetMax = "Maximum budget must be greater than minimum";
        }
        if (!formData.moveInDate)
          newErrors.moveInDate = "Move-in date is required";
        if (!formData.preferredRoomType)
          newErrors.preferredRoomType = "Room type is required";
        break;

      case 3:
        if (!formData.sleepSchedule)
          newErrors.sleepSchedule = "Sleep schedule is required";
        if (!formData.noisePreference)
          newErrors.noisePreference = "Noise preference is required";
        if (!formData.guestPolicy)
          newErrors.guestPolicy = "Guest policy is required";
        if (!formData.smokingStatus)
          newErrors.smokingStatus = "Smoking status is required";
        if (!formData.drinkingStatus)
          newErrors.drinkingStatus = "Drinking status is required";
        if (formData.hobbies.length === 0) {
          newErrors.hobbies = "Select at least one hobby";
        }
        break;

      case 4:
        if (!formData.bio || formData.bio.length < 50) {
          newErrors.bio = "Bio must be at least 50 characters";
        }
        if (formData.bio.length > 300) {
          newErrors.bio = "Bio cannot exceed 300 characters";
        }
        if (
          !formData.whatsappNumber ||
          !formData.whatsappNumber.match(/^\+?[0-9]{10,15}$/)
        ) {
          newErrors.whatsappNumber =
            "Valid WhatsApp number is required (e.g., +2348012345678)";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      // Prepare data for Firebase
      const profileData = {
        userId: user?.id,
        profilePhoto: user?.avatar,
        fullName: user?.name,
        university: user?.university,
        yearOfStudy: user?.userType === "student" && (user.userInfo as StudentUserInfo).currentYear,
        course: formData.course,
        gender: formData.gender,
        age: parseInt(formData.age),
        lookingFor: formData.lookingFor,
        specificPropertyId: formData.specificPropertyId || undefined,
        preferredLocations: formData.preferredLocations,
        budgetMin: parseInt(formData.budgetMin),
        budgetMax: parseInt(formData.budgetMax),
        moveInDate: formData.moveInDate,
        preferredRoomType: formData.preferredRoomType,
        sleepSchedule: formData.sleepSchedule,
        cleanlinessLevel: formData.cleanlinessLevel,
        noisePreference: formData.noisePreference,
        guestPolicy: formData.guestPolicy,
        smokingStatus: formData.smokingStatus,
        drinkingStatus: formData.drinkingStatus,
        hobbies: formData.hobbies,
        bio: formData.bio,
        funFact: formData.funFact || undefined,
        dealBreakers: formData.dealBreakers || undefined,
        whatsappNumber: formData.whatsappNumber,
        isVisible: true,
        status: "active" as const,
      };

      // Call Firebase function to create profile
      // const result = await createRoomieProfile(profileData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Profile created:", profileData);

      // Redirect to success page or browse page
      router.push("/roomie-match/browse?success=true");
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress indicator
  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gray-50 mx-10">
      <div className="container mx-auto max-w-3xl">
        {/* Missing Fields Warning */}
        {missingFields.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Complete Your Profile First
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please update these fields in your profile before creating a
                    RoomieMatch profile:
                  </p>
                  <ul className="list-disc list-inside mt-1">
                    {missingFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="mt-3 text-sm font-medium text-yellow-800 underline hover:text-yellow-900">
                    Go to Profile Settings →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your RoomieMatch Profile
          </h1>
          <p className="text-gray-600">Step {currentStep} of 4</p>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <p className="text-gray-600 mb-6">
                  Tell us a bit about yourself
                </p>
              </div>

              {/* Preview auto-filled data */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Your profile:
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={user?.avatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {user?.university}
                    </p>
                    <p className="text-sm text-gray-600">
                      {user?.userType === "student" && !(user.userInfo as StudentUserInfo).currentYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course/Major <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select your course</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {errors.course && (
                  <p className="mt-1 text-sm text-red-600">{errors.course}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["male", "female", "non-binary", "prefer-not-to-say"].map(
                    (option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleInputChange("gender", option)}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                          formData.gender === option
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}>
                        {option.charAt(0).toUpperCase() +
                          option.slice(1).replace("-", " ")}
                      </button>
                    )
                  )}
                </div>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="16"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Housing Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Housing Preferences
                </h2>
                <p className="text-gray-600 mb-6">What are you looking for?</p>
              </div>

              {/* Looking For */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I'm looking for a roommate in:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("lookingFor", "any-property")
                    }
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.lookingFor === "any-property"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}>
                    Any Property
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("lookingFor", "specific-property")
                    }
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.lookingFor === "specific-property"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}>
                    Specific Property
                  </button>
                </div>
                {errors.lookingFor && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lookingFor}
                  </p>
                )}
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Locations <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Select all that apply
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {locations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() =>
                        toggleArrayItem("preferredLocations", location)
                      }
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        formData.preferredLocations.includes(location)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}>
                      {location}
                    </button>
                  ))}
                </div>
                {errors.preferredLocations && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.preferredLocations}
                  </p>
                )}
              </div>

              {/* Budget Range */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Budget (₦/year){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.budgetMin}
                    onChange={(e) =>
                      handleInputChange("budgetMin", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 80000"
                  />
                  {errors.budgetMin && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.budgetMin}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Budget (₦/year){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.budgetMax}
                    onChange={(e) =>
                      handleInputChange("budgetMax", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 150000"
                  />
                  {errors.budgetMax && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.budgetMax}
                    </p>
                  )}
                </div>
              </div>

              {/* Move-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Move-in Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.moveInDate}
                  onChange={(e) =>
                    handleInputChange("moveInDate", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.moveInDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.moveInDate}
                  </p>
                )}
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.preferredRoomType}
                  onChange={(e) =>
                    handleInputChange("preferredRoomType", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select room type</option>
                  {roomTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.preferredRoomType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.preferredRoomType}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Lifestyle */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Lifestyle & Preferences
                </h2>
                <p className="text-gray-600 mb-6">
                  Help us find your perfect match
                </p>
              </div>

              {/* Sleep Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Schedule <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "early-bird",
                      label: "🌅 Early Bird",
                      desc: "Sleep by 10pm",
                    },
                    {
                      value: "night-owl",
                      label: "🦉 Night Owl",
                      desc: "Sleep after 12am",
                    },
                    { value: "flexible", label: "⏰ Flexible", desc: "Varies" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleInputChange("sleepSchedule", option.value)
                      }
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all text-left ${
                        formData.sleepSchedule === option.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}>
                      <div className="text-sm font-semibold">
                        {option.label}
                      </div>
                      <div className="text-xs mt-1 opacity-75">
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.sleepSchedule && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.sleepSchedule}
                  </p>
                )}
              </div>

              {/* Cleanliness Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cleanliness Level: {formData.cleanlinessLevel}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.cleanlinessLevel}
                  onChange={(e) =>
                    handleInputChange(
                      "cleanlinessLevel",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Casual</span>
                  <span>Very Clean</span>
                </div>
              </div>

              {/* Noise Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Noise Preference <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "quiet", label: "🤫 Quiet" },
                    { value: "moderate", label: "😊 Moderate" },
                    { value: "social", label: "🎉 Social" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleInputChange("noisePreference", option.value)
                      }
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        formData.noisePreference === option.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}>
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.noisePreference && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.noisePreference}
                  </p>
                )}
              </div>

              {/* Guest Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Policy <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "no-guests", label: "No Guests" },
                    { value: "occasional", label: "Occasional" },
                    { value: "frequent", label: "Frequent" },
                    { value: "flexible", label: "Flexible" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        handleInputChange("guestPolicy", option.value)
                      }
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        formData.guestPolicy === option.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}>
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.guestPolicy && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.guestPolicy}
                  </p>
                )}
              </div>

              {/* Smoking & Drinking */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Smoking <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.smokingStatus}
                    onChange={(e) =>
                      handleInputChange("smokingStatus", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select</option>
                    <option value="non-smoker">Non-smoker</option>
                    <option value="smoker">Smoker</option>
                    <option value="no-preference">No Preference</option>
                  </select>
                  {errors.smokingStatus && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.smokingStatus}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drinking <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.drinkingStatus}
                    onChange={(e) =>
                      handleInputChange("drinkingStatus", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select</option>
                    <option value="non-drinker">Non-drinker</option>
                    <option value="social-drinker">Social Drinker</option>
                    <option value="no-preference">No Preference</option>
                  </select>
                  {errors.drinkingStatus && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.drinkingStatus}
                    </p>
                  )}
                </div>
              </div>

              {/* Hobbies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hobbies & Interests <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Select at least one
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {hobbyOptions.map((hobby) => (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleArrayItem("hobbies", hobby)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                        formData.hobbies.includes(hobby)
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}>
                      {hobby}
                    </button>
                  ))}
                </div>
                {errors.hobbies && (
                  <p className="mt-1 text-sm text-red-600">{errors.hobbies}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: About You */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About You
                </h2>
                <p className="text-gray-600 mb-6">
                  Tell potential roommates about yourself
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself, what you're looking for in a roommate, your daily routine, etc."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.bio.length}/300 characters (minimum 50)
                </p>
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                )}
              </div>

              {/* Fun Fact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fun Fact (Optional)
                </label>
                <input
                  type="text"
                  value={formData.funFact}
                  onChange={(e) => handleInputChange("funFact", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Something interesting about you"
                />
              </div>

              {/* Deal Breakers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deal Breakers (Optional)
                </label>
                <input
                  type="text"
                  value={formData.dealBreakers}
                  onChange={(e) =>
                    handleInputChange("dealBreakers", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Things you absolutely can't compromise on"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    handleInputChange("whatsappNumber", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+2348012345678"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This will be used for other students to contact you
                </p>
                {errors.whatsappNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.whatsappNumber}
                  </p>
                )}
              </div>

              {/* Profile Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-lg mb-4">Profile Preview</h3>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <img
                      src={user?.avatar}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">
                        {user?.name}, {formData.age || "?"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formData.course} • {user?.userType === "student" && !(user.userInfo as StudentUserInfo).currentYear}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user?.university}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          📍 {formData.preferredLocations[0] || "Location"}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          💰 ₦{formData.budgetMin || "?"}k - ₦
                          {formData.budgetMax || "?"}k
                        </span>
                      </div>
                      <p className="text-sm mt-3 text-gray-700 line-clamp-2">
                        {formData.bio || "Your bio will appear here..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? "Creating Profile..." : "Create Profile 🎉"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomieProfile;
