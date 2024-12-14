import {UserType } from "../types";

export const users: UserType[] = [
  {
    id: "0f0b-48cc-8f8c-e1437d5e1cda",
    name: "John Doe",
    email: "johndoe@gmail.com",
    userType: "student",
    userInfo: {
      bio: "Just a student searching for an apartment.",
      avatar: "/assets/person1.jpg",
      university: "University of Lagos",
      department: "Computer Science",
      yearOfStudy: 3,
      savedProperties: [
        "06c3d949-6811-47ac-8ee6-aa56e76bf090",
        "18d21246-02af-4636-ab6c-3155b13f8883",
        "2305e352-5378-45ab-9357-7161bc92c0a3",
      ],
      wishlist: [
        "Two-bedroom apartment near campus",
        "Furnished studio apartment",
      ],

      phoneNumber: "+23470 1234 5678",
    },
  },
  {
    id: "5b2c6693-0f0b-8f8c-e1437d5e1cda",
    name: "Sarah Akin",
    email: "sarahakin@yahoo.com",
    userType: "student",
    userInfo: {
      bio: "I am a stduent of the prestiguous obafemi awolowo university.",
      avatar: "/assets/person1.jpg",
      university: "Obafemi Awolowo University",
      department: "Estate Management",
      yearOfStudy: 2,
      savedProperties: [
        "33891025-29e5-4e6e-bc0f-d30ca70cd5d6",
        "5b2c6693-0f0b-48cc-8f8c-e1437d5e1cda",
      ],
      wishlist: ["Single room self-contained", "Shared apartment"],
      phoneNumber: "+23470 1234 5678",
    },
  },
  {
    id: "5b2c6693-0f0b-48cc-8f8c",
    name: "Michael Brown",
    email: "michaelbrown@gmail.com",
    userType: "agent",
    userInfo: {
      bio: "As a property manager specializing in student housing, I am committed to providing comfortable and convenient living spaces near major campuses. My goal is to offer properties that are not only affordable but also foster a conducive environment for academic success.",
      avatar: "/assets/person1.jpg",
      agencyName: "Campus Living Realty",
      phoneNumber: "+23470 1234 5678",
      propertiesListed: [
        {
          id: "06c3d949-6811-47ac-8ee6-aa56e76bf090",
          available: true,
        },
        {
          id: "18d21246-02af-4636-ab6c-3155b13f8883",
          available: false,
        },
      ],
    },
  },
  {
    id: "2c6693-0f0b-48cc-8f8c-e1435e1cda",
    name: "Anita Williams",
    email: "anitawilliams@outlook.com",
    userType: "agent",
    userInfo: {
      bio: "I manage student properties with a focus on providing a home-like atmosphere that combines academic focus with comfort and style. My Victorian properties offer a unique living experience, blending historic elegance with modern amenities.",
      avatar: "/assets/person2.jpg",
      agencyName: "Student Homes & Co.",
      phoneNumber: "+23470 1234 5678",
      propertiesListed: [
        {
          id: "2305e352-5378-45ab-9357-7161bc92c0a3",
          available: true,
        },
        {
          id: "33891025-29e5-4e6e-bc0f-d30ca70cd5d6",
          available: true,
        },
      ],
    },
  },
  {
    id: "5c6693-0f0b-48c-e1437d5e1cda",
    name: "David Adeoye",
    email: "davidadeoye@domain.com",
    userType: "agent",
    userInfo: {
      bio: "As a property manager with extensive experience in family and group housing, I offer homes that cater to students seeking a balance between study and social life. My properties are located in safe, friendly neighborhoods with easy access to universities.",
      avatar: "/assets/person3.jpg",
      agencyName: "Prime Rentals",
      phoneNumber: "+23470 1234 5678",
      propertiesListed: [
        {
          id: "5b2c6693-0f0b-48cc-8f8c-e1437d5e1cda",
          available: true,
        },
        {
          id: "89d796b0-6c3b-4378-b00d-02fef7424efa",
          available: true,
        },
      ],
    },
  },
  {
    id: "548cc-c6693-0f0b-8f8c-e1437d5e1cda",
    name: "Grace Eze",
    email: "graceeze@hotmail.com",
    userType: "agent",
    userInfo: {
      bio: "With a background in student housing management, I focus on creating welcoming environments where students can thrive academically and socially. My properties are tailored to meet the needs of today’s students.",
      avatar: "/assets/service1.jpg",
      agencyName: "Smart Properties",
      phoneNumber: "+23470 1234 5678",
      propertiesListed: [
        {
          id: "b144908f-e220-49c7-9e2e-eb45d77addaf",
          available: false,
        },
      ],
    },
  },
];

// Separate users into studentUsers and agentUsers
const studentUsers: UserType[] = users.filter(
  (user): user is UserType => user.userType === "student"
);
const agentUsers: UserType[] = users.filter(
  (user): user is UserType => user.userType === "agent"
);

export { studentUsers, agentUsers };
