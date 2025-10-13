import { Timestamp } from "firebase/firestore";

interface ServicesType {
  heading: string;
  text: string;
  icon: string;
}

export interface HomeType {
  hero: {
    p: string;
    btn: string;
  };
  about: {
    heading: string;
    waw: string;
    services: ServicesType[];
    offer: string;
    delivering: {
      text: string;
      icon: string;
    }[];
  };
  quotes: {
    img: string;
    text: string;
    name: string;
    tractions: {like: number, comment: number, repost: number}
  }[];
  testimonials: {
    author: string;
    company: string;
    image: string;
    testimonial: string;
    rating: number;
    date: string;
  }[];
  tags: string[];
  footer: {
    company: {
      name: string;
      to: string;
    }[];
    support: {
      name: string;
      to: string;
    }[];
    socials: {
      name: string;
      to: string;
      icon: React.ElementType;
    }[];
  };
}


export interface ApartmentType {
  id: string;
  url: string;
  agentId: string;
  title: string;
  description: string;
  price: number;
  location: string;
  neighborhood_overview: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  video?: string; // Optional video URL
  available: boolean;
  approved: boolean;
  createdAt: Date | string;
  views: number;
}

export interface TrendType {
  slug: string;
  id: string;
  title: string;
  content: string;
  author: string;
  author_id: string;
  image: string;
  likes: number;
  published_date: string;
  category: string;
  views: number;
}
export interface CommentType{
  id: string;
  trendId: string;
  userId: string;
  userName: string;
  comment: string;
  userProfile: string;
  createdAt: string | Date;
};

export interface ItemType {
  name: string;
  description: string;
  category: string;
  condition: string;
  imageUrl: string;
  price: string;
  sellerContact: { name: string; whatsappNumber: string };
  timestamp: Date;
}

export interface ReviewType {
  id: string;
  author: { name: string; id: string; avatar: string };
  propertyId: string;
  agentId: string;
  content: string;
  rating: number;
  date: Timestamp ;
}


export interface LinkType {
  to: string;
  direct: string;
}

export interface AddSavedState {
  savedProperties: ApartmentType[];
  savedTrends: TrendType[];
}

export interface BookmarkState {
  items: ApartmentType[];
}


export interface StudentUserInfo {
  department: string;
  currentYear: number;
  savedProperties: string[];
  viewedProperties: string[];
  viewedTrends: string[];
  wishlist: string[];
}

export interface AgentUserInfo {
  agencyName: string;
  viewedTrends: string[];
  propertiesListed: string[];
}

export interface UserType {
  name: string;
  id: string;
  bio: string;
  avatar: string;
  phoneNumber: string;
  email: string;
  university: string;
  userType: "student" | "agent" | "";
  userInfo: StudentUserInfo | AgentUserInfo;
}


export type UserRoleType = "admin" | "writer";

export interface UserRole {
  username: string;
  userId: string;
  role: UserRoleType;
  assignedBy: string;
  assignedAt: Timestamp;
}

// Referral System Types
export interface ReferralCode {
  id: string;
  code: string;
  ownerId: string; // User ID who owns this referral code
  ownerName: string;
  ownerEmail: string;
  createdAt: Timestamp;
  isActive: boolean;
  usageCount: number;
  description?: string;
  createdBy: string; // Admin who created this code
}

export interface ReferralRecord {
  id: string;
  referralCodeId: string;
  referralCode: string;
  referrerId: string; // User who owns the referral code
  referrerName: string;
  referredUserId: string; // User who signed up with the code
  referredUserName: string;
  referredUserEmail: string;
  signupDate: Timestamp;
  status: 'pending' | 'completed' | 'verified';
  reward?: {
    type: 'discount' | 'credit' | 'bonus';
    amount: number;
    currency?: string;
    description: string;
  };
  notes?: string;
}

export interface ReferralStats {
  totalCodesGenerated: number;
  totalSignups: number;
  activeCodes: number;
  conversionRate: number;
  topReferrers: {
    userId: string;
    userName: string;
    referralCount: number;
  }[];
}



// types/roomieMatch.ts

export interface RoomieMatchProfile {
  id: string;
  userId: string; // Reference to user's ID from Zustand store
  
  // Auto-fetched from Zustand (with fallbacks)
  profilePhoto?: string;
  fullName: string;
  university: string;
  yearOfStudy: string;
  
  // User inputs
  course: string;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";
  age: number;
  
  // Housing Preferences
  lookingFor: "specific-property" | "any-property";
  specificPropertyId?: string; // If they selected a specific property
  preferredLocations: string[]; // Array of location strings
  budgetMin: number;
  budgetMax: number;
  moveInDate: string; // ISO date string
  preferredRoomType: string; // "self contained", "single room", etc.
  
  // Lifestyle & Preferences
  sleepSchedule: "early-bird" | "night-owl" | "flexible";
  cleanlinessLevel: 1 | 2 | 3 | 4 | 5; // 1 = casual, 5 = very clean
  noisePreference: "quiet" | "moderate" | "social";
  guestPolicy: "no-guests" | "occasional" | "frequent" | "flexible";
  smokingStatus: "non-smoker" | "smoker" | "no-preference";
  drinkingStatus: "non-drinker" | "social-drinker" | "no-preference";
  hobbies: string[]; // Array of hobby tags
  
  // About Section
  bio: string; // 150-300 characters
  funFact?: string;
  dealBreakers?: string;
  whatsappNumber: string; // Format: +234XXXXXXXXXX
  
  // Metadata
  isVisible: boolean; // Toggle for showing/hiding profile
  status: "active" | "found" | "inactive";
  views: number;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface RoomieMatchFilters {
  locations?: string[];
  gender?: string;
  budgetMin?: number;
  budgetMax?: number;
  moveInDate?: string;
  sleepSchedule?: string;
  cleanlinessLevel?: number;
  noisePreference?: string;
  university?: string;
}

// Form step data interfaces
export interface Step1Data {
  course: string;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";
  age: number;
}

export interface Step2Data {
  lookingFor: "specific-property" | "any-property";
  specificPropertyId?: string;
  preferredLocations: string[];
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  preferredRoomType: string;
}

export interface Step3Data {
  sleepSchedule: "early-bird" | "night-owl" | "flexible";
  cleanlinessLevel: 1 | 2 | 3 | 4 | 5;
  noisePreference: "quiet" | "moderate" | "social";
  guestPolicy: "no-guests" | "occasional" | "frequent" | "flexible";
  smokingStatus: "non-smoker" | "smoker" | "no-preference";
  drinkingStatus: "non-drinker" | "social-drinker" | "no-preference";
  hobbies: string[];
}

export interface Step4Data {
  bio: string;
  funFact?: string;
  dealBreakers?: string;
  whatsappNumber: string;
}

// Firebase Collection: "roomieMatchProfiles"
// Document ID: Auto-generated
// Indexes needed:
// - userId (for quick user lookup)
// - isVisible + status (for filtering active profiles)
// - preferredLocations (array-contains for location filtering)
// - university (for university-specific filtering)
// - createdAt (for sorting)