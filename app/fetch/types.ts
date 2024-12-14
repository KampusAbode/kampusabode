interface ServicesType {
  heading: string;
  text: string;
  icon: string;
}

export interface HomeType {
  hero: {
    span: string;
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
  tags: string[]; // Record<string, any> -- Adjust if you know the exact structure
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

export interface PropertyType {
  id: string;
  url: string;
  agentId: number;
  title: string;
  description: string;
  price: string;
  location: string;
  neighborhood_overview: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  saved: boolean;
  available: boolean;
}

export interface ArticleType {
  title: string;
  description: string;
  author: string;
  image: string;
  publication_date: string;
  category: string;
  saved: boolean;
}

export interface LinkType {
  to: string;
  direct: string;
}

export interface AddSavedState {
  savedProperties: PropertyType[];
  savedTrends: ArticleType[];
}

export interface BookmarkState {
  items: PropertyType[];
}

export interface StudentUserInfo {
  bio: string;
  avatar: string;
  university: string;
  department: string;
  yearOfStudy: number;
  savedProperties: string[];
  wishlist: string[];
  phoneNumber: string;
}

export interface AgentUserInfo {
  bio: string;
  avatar: string;
  agencyName: string;
  phoneNumber: string;
  propertiesListed: { id: string; available: boolean }[];
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  userType: "student" | "agent" | '';
  userInfo: StudentUserInfo | AgentUserInfo;
}
