import React from "react";

interface RoomieCardProps {
  profile: {
    id: string;
    profilePhoto: string;
    fullName: string;
    age: number;
    university: string;
    yearOfStudy: string;
    course: string;
    gender: string;
    preferredLocations: string[];
    budgetMin: number;
    budgetMax: number;
    moveInDate: string;
    sleepSchedule: string;
    cleanlinessLevel: number;
    noisePreference: string;
    hobbies: string[];
    bio: string;
    whatsappNumber: string;
    views: number;
  };
  onViewProfile: (profile: any) => void;
  onWhatsAppConnect: (profile: any) => void;
  variant?: "default" | "compact" | "detailed";
}

const RoomieCard: React.FC<RoomieCardProps> = ({
  profile,
  onViewProfile,
  onWhatsAppConnect,
  variant = "default",
}) => {
  const getLifestyleIcon = (type: string, value: string) => {
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

  const formatBudget = (min: number, max: number) => {
    return `₦${(min / 1000).toFixed(0)}k - ₦${(max / 1000).toFixed(0)}k`;
  };

  const formatMoveInDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (variant === "compact") {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={profile.profilePhoto}
            alt={profile.fullName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {profile.fullName}, {profile.age}
            </h3>
            <p className="text-xs text-gray-600 truncate">
              {profile.course} • {profile.yearOfStudy}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
          <span>📍 {profile.preferredLocations[0]}</span>
          <span>💰 {formatBudget(profile.budgetMin, profile.budgetMax)}</span>
        </div>

        <button
          onClick={() => onViewProfile(profile)}
          className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          View Profile
        </button>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={profile.profilePhoto}
              alt={profile.fullName}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-1">
                {profile.fullName}, {profile.age}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                📚 {profile.course} • {profile.yearOfStudy}
              </p>
              <p className="text-sm text-gray-600">🏛️ {profile.university}</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">📍</span>
              <span className="text-gray-700">
                {profile.preferredLocations.join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">💰</span>
              <span className="text-gray-700">
                {formatBudget(profile.budgetMin, profile.budgetMax)}/year
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">📅</span>
              <span className="text-gray-700">
                Moving: {formatMoveInDate(profile.moveInDate)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              {getLifestyleIcon("sleep", profile.sleepSchedule)}{" "}
              {profile.sleepSchedule.replace("-", " ")}
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
              🧹 Level {profile.cleanlinessLevel}
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              {getLifestyleIcon("noise", profile.noisePreference)}{" "}
              {profile.noisePreference}
            </span>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Hobbies
            </h4>
            <div className="flex flex-wrap gap-1">
              {profile.hobbies.map((hobby, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {hobby}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">About</h4>
            <p className="text-sm text-gray-700">{profile.bio}</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-400">👁️ {profile.views} views</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onViewProfile(profile)}
              className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              View Full Profile
            </button>
            <button
              onClick={() => onWhatsAppConnect(profile)}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
              💬 Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={profile.profilePhoto}
            alt={profile.fullName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">
              {profile.fullName}, {profile.age}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              📚 {profile.course}, {profile.yearOfStudy}
            </p>
            <p className="text-xs text-gray-500 truncate">
              🏛️ {profile.university}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">📍</span>
            <span className="text-gray-700">
              {profile.preferredLocations.slice(0, 2).join(", ")}
              {profile.preferredLocations.length > 2 && " +more"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">💰</span>
            <span className="text-gray-700">
              {formatBudget(profile.budgetMin, profile.budgetMax)}/year
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">📅</span>
            <span className="text-gray-700">
              Moving: {formatMoveInDate(profile.moveInDate)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            {getLifestyleIcon("sleep", profile.sleepSchedule)}{" "}
            {profile.sleepSchedule.replace("-", " ")}
          </span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
            🧹 Level {profile.cleanlinessLevel}
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            {getLifestyleIcon("noise", profile.noisePreference)}{" "}
            {profile.noisePreference}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {profile.hobbies.slice(0, 3).map((hobby, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {hobby}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{profile.bio}</p>

        <p className="text-xs text-gray-400 mb-4">👁️ {profile.views} views</p>

        <div className="flex gap-2">
          <button
            onClick={() => onViewProfile(profile)}
            className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm">
            View Profile
          </button>
          <button
            onClick={() => onWhatsAppConnect(profile)}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-sm">
            💬 Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomieCard;

// Usage Examples:

// 1. Default Card (Browse Page)
// <RoomieCard
//   profile={profile}
//   onViewProfile={handleViewProfile}
//   onWhatsAppConnect={handleWhatsAppConnect}
// />

// 2. Compact Card (Sidebar/Widget)
// <RoomieCard
//   profile={profile}
//   onViewProfile={handleViewProfile}
//   onWhatsAppConnect={handleWhatsAppConnect}
//   variant="compact"
// />

// 3. Detailed Card (Featured/Recommendations)
// <RoomieCard
//   profile={profile}
//   onViewProfile={handleViewProfile}
//   onWhatsAppConnect={handleWhatsAppConnect}
//   variant="detailed"
// />
