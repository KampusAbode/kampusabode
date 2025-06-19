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
    text: string;
    name: string;
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
  available: boolean;
  approved: boolean;
  views: number;
}

export interface TrendType {
  slug: string;
  id: string;
  title: string;
  content: string;
  author: string;
  image: string;
  likes: number;
  published_date: string;
  category: string;
}

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
  content: string;
  rating: number;
  date: string;
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
  wishlist: string[];
}

export interface AgentUserInfo {
  agencyName: string;
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
