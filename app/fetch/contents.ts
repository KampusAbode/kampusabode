import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HomeType, LinkType } from "./types";

const homeSection: HomeType = {
  hero: {
    p: "Making apartment renting safer, affordable, and stress-free for all university students.",
    btn: "listing property",
  },
  about: {
    heading: "who are we?",
    waw: "Kampus Abode connects students with trusted agents to find safe, and convenient hostel apartments. Our platform offers verified listings, and insights into hostel areas—all from your phone. Making apartment renting hassle-free and tailored to your needs!",
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
      img: "/assets/robert kiyosaki.jpeg",
      text: "Real estate investing, even on a small scale , remains a tried and true means of building an individual's cash flow and wealth.",
      name: "Robert Kiyosaki",
      tractions: { like: 534, comment: 12, repost: 93 },
    },
    {
      img: "/assets/barbara corcoran.jpeg",
      text: "A funny thing happens in real estate. When it comes back, it comes up like gangbusters.",
      name: "Barbara Corcoran",
      tractions: { like: 234, comment: 34, repost: 12 },
    },
    {
      img: "/assets/grant cardone.png",
      text: "Real estate is the safest investment in the world.",
      name: "Grant Cardone",
      tractions: { like: 234, comment: 34, repost: 12 },
    },
    {
      img: "/assets/warren buffett.jpeg",
      text: "The best investment you can make is an investment in yourself. The more you learn, the more you earn.",
      name: "Warren Buffett",
      tractions: { like: 234, comment: 34, repost: 12 },
    },
  ],
  testimonials: [
    {
      author: "Matthew",
      company: "Student",
      image: "/assets/person1.jpg",
      testimonial:
        "Kampus Abode is the best there is and the best there’ll ever be. I highly recommend Kampus Abode to anyone looking to rent. Their integrity, attention to detail, and customer-first approach truly set them apart.",
      rating: 5,
      date: "2025-06-22",
    },
    {
      author: "Wale",
      company: "student",
      image: "/assets/person2.jpg",
      testimonial:
        "Wow, I'm impressed by how fast and reliable Kampus Abode is! It's incredibly easy to use, and being able to rent through my phone adds an extra layer of convenience. Thanks!",
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
      // { name: "about", to: "/about" },
      //   { name: "properties", to: "/apartment" },
      // { name: "trends", to: "/trends" },
      //  { name: "marketplace", to: "/marketplace" },
      { name: "FAQs", to: "/legal/faqs" },
      { name: "testimonials", to: "/legal/testimonials" },
      {
        name: "Community",
        to: "https://chat.whatsapp.com/IKDwZQy5BVEIGIIWkjj9zx?mode=ac_t",
      },
      // { name: "contact", to: "/contact" },
    ],
    support: [
      // { name: "FAQs", to: "/legal/faq" },
      // { name: "terms and conditions", to: "/legal/termsandconditions" },
      // { name: "policies", to: "/legal/policies" },
      { name: "disclaimer", to: "/legal/disclaimer" },
      { name: "user agreement", to: "/legal/useragreement" },
      { name: "whatsapp", to: "https://wa.me/+2347012105995" },
      // { name: "contact", to: "/contact" },
    ],
    socials: [
      /* {
        name: "facebook",
        to: "https://facebook.com/kampusabode",
        icon: FaFacebook,
      },*/
      {
        name: "instagram",
        to: "https://instagram.com/kampusabode",
        icon: FaInstagram,
      },
      {
        name: "twitter",
        to: "https://twitter.com/kampus_abode",
        icon: FaTwitter,
      },
      /* {
        name: "linkedin",
        to: "https://linkedin.com/company/kampusabode",
        icon: FaLinkedin,
      },*/
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
  "Asherifa",
  "Dduduwa estate",
  "Damico area",
  "Oni Layout",
  "Ibadan road",
  "Moremi",
  "Parakin estate",
  "Modomo",
  "Mayfair",
  "Ede road",
  "AP",
  "lagere",
  "Road 7",
  "OAU campus",
  "Ajigbona"
];

 const propTypeOptions = [
    "Mini self contained",
    "Self contained",
    "Single room",
    "Room and parlour",
    "2 bedroom",
    "3 bedroom",
    "4 bedroom",
  ];

const trendcategories = [
  "Trending",
  "School updates",
  "Events",
  "Sports",
  "Music & Entertainment",
  "Football",
  "Housing",
  "Tech & Innovations",
  "Departments",
  "Housing",
];

const priceRanges = [
  { label: "0 - 200,000", value: [100, 100000] },
  { label: "200,001 - 400,000", value: [100001, 300000] },
  { label: "400,001 - 600,000", value: [300001, 600000] },
  { label: "400,001 - 600,000", value: [600001, 800000] },
];
const bedroomOptions = [1, 2, 3, 4, 5];

const links: LinkType[] = [
  // { to: "about", direct: "/about" },
  { to: "properties", direct: "/apartment" },
  { to: "trends", direct: "/trends" },
  { to: "marketplace", direct: "/marketplace" },
  // { to: "contact", direct: "/contact" },
];

const universities = ["OAU", "UNILAG", "OUI", "UI", "UNN", "FUTA", "UNILORIN"];

const data = {
  homeSection,
  ApartmentTypes,
  locations,
  propTypeOptions,
  priceRanges,
  bedroomOptions,
  links,
  universities,
  trendcategories,
};

export default data;
