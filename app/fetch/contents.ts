import React from "react";
import { HomeType, LinkType } from "./types";

type BrandIconProps = React.SVGProps<SVGSVGElement>;

const FacebookBrandIcon: React.FC<BrandIconProps> = (props) =>
  React.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      d: "M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V10H6.8v3h2.8v8h3.9z",
    }),
  );

const InstagramBrandIcon: React.FC<BrandIconProps> = (props) =>
  React.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.75,
      ...props,
    },
    React.createElement("rect", {
      x: 3,
      y: 3,
      width: 18,
      height: 18,
      rx: 5,
    }),
    React.createElement("circle", { cx: 12, cy: 12, r: 4 }),
    React.createElement("circle", {
      cx: 17.5,
      cy: 6.5,
      r: 0.75,
      fill: "currentColor",
      stroke: "none",
    }),
  );

const LinkedinBrandIcon: React.FC<BrandIconProps> = (props) =>
  React.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "currentColor",
      ...props,
    },
    React.createElement("text", {
      x: 2,
      y: 18,
      fontFamily: "Arial, sans-serif",
      fontSize: 18,
      fontWeight: 700,
      children: "in",
    }),
  );

const TwitterBrandIcon: React.FC<BrandIconProps> = (props) =>
  React.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "currentColor",
      ...props,
    },
    React.createElement("path", {
      d: "M22 5.9a8 8 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.3 8.3 0 0 1-2.7 1 4.1 4.1 0 0 0-7 3.8 11.6 11.6 0 0 1-8.4-4.3 4.1 4.1 0 0 0 1.3 5.5 4 4 0 0 1-1.9-.5v.1a4.1 4.1 0 0 0 3.3 4 4 4 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.8A8.3 8.3 0 0 1 2 18.5a11.7 11.7 0 0 0 6.3 1.8c7.6 0 11.8-6.3 11.8-11.8v-.5A8.4 8.4 0 0 0 22 5.9z",
    }),
  );

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
        icon: FacebookBrandIcon,
      },*/
      {
        name: "instagram",
        to: "https://instagram.com/kampusabode",
        icon: InstagramBrandIcon,
      },
      {
        name: "twitter",
        to: "https://twitter.com/kampus_abode",
        icon: TwitterBrandIcon,
      },
      /* {
        name: "linkedin",
        to: "https://linkedin.com/company/kampusabode",
        icon: LinkedinBrandIcon,
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
  "Oduduwa estate",
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
