import { HomeType, LinkType } from "./types";

const homeSection: HomeType = {
  hero: {
    p: "Making apartment renting safer, affordable, and stress-free for all university students.",
    btn: "listing property",
  },
  about: {
    heading: "who are we?",
    waw: "Kampus Abode connects students with trusted agents to find safe, affordable, and convenient hostel apartments. Our platform offers verified listings, direct communication with agents, and insights into hostel areas—all from your phone. Making apartment renting hassle-free and tailored to your needs!",
    services: [
      {
        heading: "Area Insights",
        text: "Learn about safety, electricity,  and student population.",
        icon: "/icons/search-location.svg",
      },
      {
        heading: "Visual Tour",
        text: "View detailed images and videos of apartments.",
        icon: "/icons/dial-high.svg",
      },
      {
        heading: "Agent Reviews",
        text: "Verified agent ratings and reviews for informed decisions.",
        icon: "/icons/people-network-partner.svg",
      },
    ],
    offer:
      "We provide help on locating the right house for you and family. Check out the listing porperties presently in the area.",
    delivering: [
      { text: "simplicity", icon: "" },
      { text: "trust", icon: "" },
      { text: "value", icon: "" },
    ],
  },
  quotes: [
    {
      text: "Real estate investing, even on a small scale , remains a tried and true means of building an individual's cash flow and wealth.",
      name: "Robert Kiyosaki",
    },
    {
      text: "A funny thing happens in real estate. When it comes back, it comes up like gangbusters.",
      name: "Barbara Corcoran",
    },
    {
      text: "Real estate is the safest investment in the world.",
      name: "Grant Cardone",
    },
    {
      text: "The best investment you can make is an investment in yourself. The more you learn, the more you earn.",
      name: "Warren Buffett",
    },
  ],
  testimonials: [
    {
      author: "John Smith",
      company: "ABC Real Estate",
      image: "/assets/person1.jpg",
      testimonial:
        "I was impressed by the dedication and expertise of the team at ABC Real Estate. They helped me find my dream home in no time!",
      rating: 5,
      date: "2024-05-05",
    },
    {
      author: "Emily Johnson",
      company: "student",
      image: "/assets/person2.jpg",
      testimonial:
        "Great service and excellent communication throughout the entire process. Highly recommend!",
      rating: 4,
      date: "2024-04-20",
    },
    {
      author: "Michael Brown",
      company: "Brown Properties",
      image: "/assets/person3.jpg",
      testimonial:
        "Professional team that goes above and beyond to meet client needs. Will definitely work with them again!",
      rating: 5,
      date: "2024-03-15",
    },
  ],
  tags: [],
  footer: {
    company: [
      { name: "about", to: "/about" },
      { name: "properties", to: "/properties" },
      { name: "trends", to: "/trends" },
      { name: "marketplace", to: "/marketplace" },
      // { name: "FAQs", to: "/legal/faqs" },
      // { name: "testimonials", to: "/legal/testimonials" },
    ],
    support: [
      // { name: "FAQs", to: "/legal/faq" },
      // { name: "terms and conditions", to: "/legal/termsandconditions" },
      // { name: "policies", to: "/legal/policies" },
      { name: "disclaimer", to: "/legal/disclaimer" },
      { name: "user agreement", to: "/legal/useragreement" },
      // { name: "contact", to: "/contact" },
    ],
  },
};

const ApartmentTypes = [
  "Studio Apartments",
  "Bedroom Apartments",
  "Condominiums",
  "Studio Lofts",
  "Serviced Apartments",
  "Shared Houses",
];
const locations = [
  "asherifa",
  "oduduwa estate",
  "damico area",
  "ibadan road",
  "parakin estate",
  "may fair",
  "lagere",
];
const priceRanges = [
  { label: "0 - 200,000", value: [100, 100000] },
  { label: "200,001 - 400,000", value: [100001, 300000] },
  { label: "400,001 - 600,000", value: [300001, 600000] },
  { label: "400,001 - 600,000", value: [600001, 800000] },
];
const bedroomOptions = [1, 2, 3, 4, 5];

const links: LinkType[] = [
  { to: "about", direct: "/about" },
  { to: "properties", direct: "/properties" },
  { to: "trends", direct: "/trends" },
  { to: "marketplace", direct: "/marketplace" },
  // { to: "contact", direct: "/contact" },
];

const universities = ["OAU", "UNILAG", "UI", "UNN", "FUTA"];

const data = {
  homeSection,
  ApartmentTypes,
  locations,
  priceRanges,
  bedroomOptions,
  links,
  universities,
};

export default data;
