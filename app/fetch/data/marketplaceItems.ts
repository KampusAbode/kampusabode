export interface MarketplaceItem {
  id: number;
  name: string;
  description: string;
  price: string;
  condition: "New" | "Used"; // Restrict condition to only "New" or "Used"
  imageUrl: string;
  sellerContact: {
    name: string;
    whatsappNumber: string; // Seller's WhatsApp contact number
  };
  category: string;
}

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: 1,
    name: "Study Desk",
    description: "A sturdy wooden study desk in good condition.",
    price: "₦15,000",
    condition: "Used",
    imageUrl: "/assets/marketplace/studydesk.jpg", // Unsplash image
    sellerContact: {
      name: "John Doe",
      whatsappNumber: "2347012345678",
    },
    category: "Furniture",
  },
  {
    id: 2,
    name: "Mini Fridge",
    description: "Compact fridge, perfect for a dorm room or small apartment.",
    price: "₦25,000",
    condition: "Used",
    imageUrl: "/assets/marketplace/minifridge.jpg", // Unsplash image
    sellerContact: {
      name: "Grace Eze",
      whatsappNumber: "2347087654321",
    },
    category: "Electronics",
  },
  {
    id: 3,
    name: "Electric Kettle",
    description: "1.7L electric kettle, fast heating, almost new.",
    price: "₦5,000",
    condition: "New",
    imageUrl: "/assets/marketplace/electrickettle.jpg", // Unsplash image
    sellerContact: {
      name: "Samuel Lawson",
      whatsappNumber: "2347012349876",
    },
    category: "Electronics",
  },
  {
    id: 4,
    name: "Single Bed Frame",
    description: "Metal single bed frame with slats. Easy to assemble.",
    price: "₦12,000",
    condition: "Used",
    imageUrl: "/assets/marketplace/singlebedframe.jpg", // Unsplash image
    sellerContact: {
      name: "Mary Johnson",
      whatsappNumber: "2348098765432",
    },
    category: "Furniture",
  },
  {
    id: 5,
    name: "Study Lamp",
    description: "LED study lamp with adjustable neck.",
    price: "₦3,000",
    condition: "Used",
    imageUrl: "/assets/marketplace/studylamp.jpg", // Unsplash image
    sellerContact: {
      name: "James Okafor",
      whatsappNumber: "2347065432109",
    },
    category: "Electronics",
  },
];
