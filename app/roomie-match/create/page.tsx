"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import data from "../../fetch/contents";
import { StudentUserInfo } from "../../fetch/types";
import { useUserStore } from "../../store/userStore";
import { createRoomieProfile } from "../../utils/roomieMatchFirebase";
import {toast} from "react-toast";
import "./CreateRoomieProfile.css";

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

const { locations } = data;

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
  const { user } = useUserStore();
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
    if (
      user?.userType === "student" &&
      !(user.userInfo as StudentUserInfo).currentYear
    ) {
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
      yearOfStudy:
        user?.userType === "student"
          ? String((user.userInfo as StudentUserInfo).currentYear)
          : undefined,
      course: formData.course,
      gender: formData.gender as
        | "male"
        | "female"
        | "non-binary"
        | "prefer-not-to-say",
      age: parseInt(formData.age),
      lookingFor: formData.lookingFor as "specific-property" | "any-property",
      specificPropertyId: formData.specificPropertyId || undefined,
      preferredLocations: formData.preferredLocations,
      budgetMin: parseInt(formData.budgetMin),
      budgetMax: parseInt(formData.budgetMax),
      moveInDate: formData.moveInDate,
      preferredRoomType: formData.preferredRoomType,
      sleepSchedule: formData.sleepSchedule as
        | "early-bird"
        | "night-owl"
        | "flexible",
      cleanlinessLevel: formData.cleanlinessLevel,
      noisePreference: formData.noisePreference as
        | "quiet"
        | "moderate"
        | "social",
      guestPolicy: formData.guestPolicy as
        | "no-guests"
        | "occasional"
        | "frequent"
        | "flexible",
      smokingStatus: formData.smokingStatus as
        | "non-smoker"
        | "smoker"
        | "no-preference",
      drinkingStatus: formData.drinkingStatus as
        | "non-drinker"
        | "social-drinker"
        | "no-preference",
      hobbies: formData.hobbies,
      bio: formData.bio,
      funFact: formData.funFact || undefined,
      dealBreakers: formData.dealBreakers || undefined,
      whatsappNumber: formData.whatsappNumber,
      isVisible: true,
      status: "active" as "active" | "found" | "inactive",
    };

      // Call Firebase function to create profile
      const result = await createRoomieProfile(profileData);

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Profile created:", profileData);

      if (result.success) {
        router.push("/roomie-match/browse?success=true");
        toast.success("Profile created successfully");
      } else {
        toast.error("failed to upload profile");
      };

      // Redirect to success page or browse page
      
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
    <section className="create-roomie-profile">
      <div className="container">
        {/* Missing Fields Warning */}
        {missingFields.length > 0 && (
          <div className="warningBanner">
            <div className="warningFlex">
              <div className="warningIcon">
                <span>⚠️</span>
              </div>
              <div className="warningContent">
                <h3 className="warningTitle">Complete Your Profile First</h3>
                <div className="warningText">
                  <p>
                    Please update these fields in your profile before creating a
                    RoomieMatch profile:
                  </p>
                  <ul>
                    {missingFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="warningButton">
                    Go to Profile Settings →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="header">
          <h1 className="headerTitle">Create Your RoomieMatch Profile</h1>
          <p className="headerStep">Step {currentStep} of 4</p>

          {/* Progress Bar */}
          <div className="progressBarContainer">
            <div className="progressBar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Form Content */}
        <div className="formContainer">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="formSection">
              <div className="sectionHeader">
                <h2>Basic Information</h2>
                <p>Tell us a bit about yourself</p>
              </div>

              {/* Preview auto-filled data */}
              <div className="profilePreviewBox">
                <p className="profilePreviewLabel">Your profile:</p>
                <div className="profilePreviewFlex">
                  <img
                    src={user?.avatar || "/assets/user_avatar.jpg"}
                    alt="Profile"
                    className="profileAvatar"
                  />
                  <div className="profileInfo">
                    <p>{user?.name}</p>
                    <p>{user?.university}</p>
                    <p>
                      {user?.userType === "student" &&
                        (user.userInfo as StudentUserInfo).currentYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course */}
              <div>
                <label className="fieldLabel">
                  Course/Major <span className="required">*</span>
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                  className="selectInput">
                  <option value="">Select your course</option>
                  {courseOptions.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {errors.course && <p className="errorText">{errors.course}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="fieldLabel">
                  Gender <span className="required">*</span>
                </label>
                <div className="buttonGrid2">
                  {["male", "female", "non-binary", "prefer-not-to-say"].map(
                    (option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleInputChange("gender", option)}
                        className={`toggleButton ${formData.gender === option ? "active" : ""}`}>
                        {option.charAt(0).toUpperCase() +
                          option.slice(1).replace("-", " ")}
                      </button>
                    )
                  )}
                </div>
                {errors.gender && <p className="errorText">{errors.gender}</p>}
              </div>

              {/* Age */}
              <div>
                <label className="fieldLabel">
                  Age <span className="required">*</span>
                </label>
                <input
                  type="number"
                  min="16"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="numberInput"
                  placeholder="Enter your age"
                />
                {errors.age && <p className="errorText">{errors.age}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Housing Preferences */}
          {currentStep === 2 && (
            <div className="formSection">
              <div className="sectionHeader">
                <h2>Housing Preferences</h2>
                <p>What are you looking for?</p>
              </div>

              {/* Looking For */}
              <div>
                <label className="fieldLabel">
                  I'm looking for a roommate in:{" "}
                  <span className="required">*</span>
                </label>
                <div className="buttonGrid2">
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("lookingFor", "any-property")
                    }
                    className={`toggleButton ${formData.lookingFor === "any-property" ? "active" : ""}`}>
                    Any Property
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("lookingFor", "specific-property")
                    }
                    className={`toggleButton ${formData.lookingFor === "specific-property" ? "active" : ""}`}>
                    Specific Property
                  </button>
                </div>
                {errors.lookingFor && (
                  <p className="errorText">{errors.lookingFor}</p>
                )}
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="fieldLabel">
                  Preferred Locations <span className="required">*</span>
                </label>
                <p className="helperText">Select all that apply</p>
                <div className="buttonGrid2Md3">
                  {locations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() =>
                        toggleArrayItem("preferredLocations", location)
                      }
                      className={`chipButton ${formData.preferredLocations.includes(location) ? "active" : ""}`}>
                      {location}
                    </button>
                  ))}
                </div>
                {errors.preferredLocations && (
                  <p className="errorText">{errors.preferredLocations}</p>
                )}
              </div>

              {/* Budget Range */}
              <div className="gridMd2">
                <div>
                  <label className="fieldLabel">
                    Minimum Budget (₦/year) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.budgetMin}
                    onChange={(e) =>
                      handleInputChange("budgetMin", e.target.value)
                    }
                    className="numberInput"
                    placeholder="e.g., 80000"
                  />
                  {errors.budgetMin && (
                    <p className="errorText">{errors.budgetMin}</p>
                  )}
                </div>
                <div>
                  <label className="fieldLabel">
                    Maximum Budget (₦/year) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.budgetMax}
                    onChange={(e) =>
                      handleInputChange("budgetMax", e.target.value)
                    }
                    className="numberInput"
                    placeholder="e.g., 150000"
                  />
                  {errors.budgetMax && (
                    <p className="errorText">{errors.budgetMax}</p>
                  )}
                </div>
              </div>

              {/* Move-in Date */}
              <div>
                <label className="fieldLabel">
                  Preferred Move-in Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  value={formData.moveInDate}
                  onChange={(e) =>
                    handleInputChange("moveInDate", e.target.value)
                  }
                  className="dateInput"
                />
                {errors.moveInDate && (
                  <p className="errorText">{errors.moveInDate}</p>
                )}
              </div>

              {/* Room Type */}
              <div>
                <label className="fieldLabel">
                  Preferred Room Type <span className="required">*</span>
                </label>
                <select
                  value={formData.preferredRoomType}
                  onChange={(e) =>
                    handleInputChange("preferredRoomType", e.target.value)
                  }
                  className="selectInput">
                  <option value="">Select room type</option>
                  {roomTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.preferredRoomType && (
                  <p className="errorText">{errors.preferredRoomType}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Lifestyle */}
          {currentStep === 3 && (
            <div className="formSection">
              <div className="sectionHeader">
                <h2>Lifestyle & Preferences</h2>
                <p>Help us find your perfect match</p>
              </div>

              {/* Sleep Schedule */}
              <div>
                <label className="fieldLabel">
                  Sleep Schedule <span className="required">*</span>
                </label>
                <div className="buttonGrid3">
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
                      className={`toggleButtonWithDesc ${formData.sleepSchedule === option.value ? "active" : ""}`}>
                      <div className="label">{option.label}</div>
                      <div className="description">{option.desc}</div>
                    </button>
                  ))}
                </div>
                {errors.sleepSchedule && (
                  <p className="errorText">{errors.sleepSchedule}</p>
                )}
              </div>

              {/* Cleanliness Level */}
              <div>
                <label className="fieldLabel">
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
                  className="rangeSlider"
                />
                <div className="rangeLabels">
                  <span>Casual</span>
                  <span>Very Clean</span>
                </div>
              </div>

              {/* Noise Preference */}
              <div>
                <label className="fieldLabel">
                  Noise Preference <span className="required">*</span>
                </label>
                <div className="buttonGrid3">
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
                      className={`toggleButton ${formData.noisePreference === option.value ? "active" : ""}`}>
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.noisePreference && (
                  <p className="errorText">{errors.noisePreference}</p>
                )}
              </div>

              {/* Guest Policy */}
              <div>
                <label className="fieldLabel">
                  Guest Policy <span className="required">*</span>
                </label>
                <div className="buttonGrid2">
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
                      className={`toggleButton ${formData.guestPolicy === option.value ? "active" : ""}`}>
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.guestPolicy && (
                  <p className="errorText">{errors.guestPolicy}</p>
                )}
              </div>

              {/* Smoking & Drinking */}
              <div className="gridMd2">
                <div>
                  <label className="fieldLabel">
                    Smoking <span className="required">*</span>
                  </label>
                  <select
                    value={formData.smokingStatus}
                    onChange={(e) =>
                      handleInputChange("smokingStatus", e.target.value)
                    }
                    className="selectInput">
                    <option value="">Select</option>
                    <option value="non-smoker">Non-smoker</option>
                    <option value="smoker">Smoker</option>
                    <option value="no-preference">No Preference</option>
                  </select>
                  {errors.smokingStatus && (
                    <p className="errorText">{errors.smokingStatus}</p>
                  )}
                </div>
                <div>
                  <label className="fieldLabel">
                    Drinking <span className="required">*</span>
                  </label>
                  <select
                    value={formData.drinkingStatus}
                    onChange={(e) =>
                      handleInputChange("drinkingStatus", e.target.value)
                    }
                    className="selectInput">
                    <option value="">Select</option>
                    <option value="non-drinker">Non-drinker</option>
                    <option value="social-drinker">Social Drinker</option>
                    <option value="no-preference">No Preference</option>
                  </select>
                  {errors.drinkingStatus && (
                    <p className="errorText">{errors.drinkingStatus}</p>
                  )}
                </div>
              </div>

              {/* Hobbies */}
              <div>
                <label className="fieldLabel">
                  Hobbies & Interests <span className="required">*</span>
                </label>
                <p className="helperText">Select at least one</p>
                <div className="buttonGrid2Md3">
                  {hobbyOptions.map((hobby) => (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleArrayItem("hobbies", hobby)}
                      className={`chipButton ${formData.hobbies.includes(hobby) ? "active" : ""}`}>
                      {hobby}
                    </button>
                  ))}
                </div>
                {errors.hobbies && (
                  <p className="errorText">{errors.hobbies}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: About You */}
          {currentStep === 4 && (
            <div className="formSection">
              <div className="sectionHeader">
                <h2>About You</h2>
                <p>Tell potential roommates about yourself</p>
              </div>

              {/* Bio */}
              <div>
                <label className="fieldLabel">
                  Bio <span className="required">*</span>
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="textareaInput"
                  placeholder="Tell us about yourself, what you're looking for in a roommate, your daily routine, etc."
                />
                <p className="characterCount">
                  {formData.bio.length}/300 characters (minimum 50)
                </p>
                {errors.bio && <p className="errorText">{errors.bio}</p>}
              </div>

              {/* Fun Fact */}
              <div>
                <label className="fieldLabel">Fun Fact (Optional)</label>
                <input
                  type="text"
                  value={formData.funFact}
                  onChange={(e) => handleInputChange("funFact", e.target.value)}
                  className="textInput"
                  placeholder="Something interesting about you"
                />
              </div>

              {/* Deal Breakers */}
              <div>
                <label className="fieldLabel">Deal Breakers (Optional)</label>
                <input
                  type="text"
                  value={formData.dealBreakers}
                  onChange={(e) =>
                    handleInputChange("dealBreakers", e.target.value)
                  }
                  className="textInput"
                  placeholder="Things you absolutely can't compromise on"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="fieldLabel">
                  WhatsApp Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    handleInputChange("whatsappNumber", e.target.value)
                  }
                  className="textInput"
                  placeholder="+2348012345678"
                />
                <p className="helperText">
                  This will be used for other students to contact you
                </p>
                {errors.whatsappNumber && (
                  <p className="errorText">{errors.whatsappNumber}</p>
                )}
              </div>

              {/* Profile Preview */}
              <div className="finalPreviewContainer">
                <h3>Profile Preview</h3>
                <div className="finalPreviewCard">
                  <div className="finalPreviewFlex">
                    <img
                      src={user?.avatar}
                      alt="Profile"
                      className="finalPreviewAvatar"
                    />
                    <div className="finalPreviewContent">
                      <h4>
                        {user?.name}, {formData.age || "?"}
                      </h4>
                      <p>
                        {formData.course} •{" "}
                        {user?.userType === "student" &&
                          (user.userInfo as StudentUserInfo).currentYear}
                      </p>
                      <p>{user?.university}</p>
                      <div className="finalPreviewTags">
                        <span className="tag location">
                          📍 {formData.preferredLocations[0] || "Location"}
                        </span>
                        <span className="tag budget">
                          💰 ₦{formData.budgetMin || "?"}k - ₦
                          {formData.budgetMax || "?"}k
                        </span>
                      </div>
                      <p className="finalPreviewBio">
                        {formData.bio || "Your bio will appear here..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="navigationButtons">
            {currentStep > 1 && (
              <button type="button" onClick={handleBack} className="backButton">
                Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="continueButton">
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="submitButton">
                {isSubmitting ? "Creating Profile..." : "Create Profile 🎉"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateRoomieProfile;
