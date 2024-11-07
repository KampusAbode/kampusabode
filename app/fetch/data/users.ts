import { StudentType, AgentType, UserType } from "../types";

export const users: UserType[] = [
  {
    id: 1829475,
    name: "John Doe",
    email: "johndoe@gmail.com",
    userType: "student",
    userInfo: {
      university: "University of Lagos",
      department: "Computer Science",
      yearOfStudy: 3,
      savedProperties: [8726491537, 82664625176, 4862310975],
      wishlist: [
        "Two-bedroom apartment near campus",
        "Furnished studio apartment",
      ],

      phoneNumber: "+23470 1234 5678",
    },
  },
  {
    id: 2843651,
    name: "Sarah Akin",
    email: "sarahakin@yahoo.com",
    userType: "student",
    userInfo: {
      university: "Obafemi Awolowo University",
      department: "Estate Management",
      yearOfStudy: 2,
      savedProperties: [661635725344, 1234567890],
      wishlist: ["Single room self-contained", "Shared apartment"],
      phoneNumber: "+23470 1234 5678",
    },
  },
  {
    id: 3728492,
    name: "Michael Brown",
    email: "michaelbrown@gmail.com",
    userType: "agent",
    bio: "As a property manager specializing in student housing, I am committed to providing comfortable and convenient living spaces near major campuses. My goal is to offer properties that are not only affordable but also foster a conducive environment for academic success.",
    avatar: "/assets/person1.jpg",
    userInfo: {
      agencyName: "Campus Living Realty",
      phoneNumber: "+23470 1234 5678",
      propertiesListed: [
        {
          id: 8726491537,
          available: true,
        },
        {
          id: 1234567890,
          available: false,
        },
      ],
    },
  },
  {
    id: 4893716,
    name: "Anita Williams",
    email: "anitawilliams@outlook.com",
    userType: "agent",
    bio: "I manage student properties with a focus on providing a home-like atmosphere that combines academic focus with comfort and style. My Victorian properties offer a unique living experience, blending historic elegance with modern amenities.",
    avatar: "/assets/person2.jpg",
    userInfo: {
      agencyName: "Student Homes & Co.",
      phoneNumber: "+23470 1234 5678",
      propertiesListed: [
        {
          id: 82664625176,
          available: true,
        },
        {
          id: 9928265424,
          available: true,
        },
      ],
    },
  },
  {
    id: 7892430,
    name: "David Adeoye",
    email: "davidadeoye@domain.com",
    userType: "agent",
    bio: "As a property manager with extensive experience in family and group housing, I offer homes that cater to students seeking a balance between study and social life. My properties are located in safe, friendly neighborhoods with easy access to universities.",
    avatar: "/assets/person3.jpg",
    userInfo: {
      agencyName: "Prime Rentals",
      phoneNumber: "+23470 1234 5678",
      propertiesListed: [
        {
          id: 4862310975,
          available: true,
        },
        {
          id: 5748392014,
          available: true,
        },
      ],
    },
  },
  {
    id: 1023489,
    name: "Grace Eze",
    email: "graceeze@hotmail.com",
    userType: "agent",
    bio: "With a background in student housing management, I focus on creating welcoming environments where students can thrive academically and socially. My properties are tailored to meet the needs of today’s students.",
    avatar: "/assets/service1.jpg",
    userInfo: {
      agencyName: "Smart Properties",
      phoneNumber: "+23470 1234 5678",
      propertiesListed: [
        {
          id: 661635725344,
          available: false,
        },
      ],
    },
  },
];

// Separate users into studentUsers and agentUsers
const studentUsers: StudentType[] = users.filter(
  (user): user is StudentType => user.userType === "student"
);
const agentUsers: AgentType[] = users.filter(
  (user): user is AgentType => user.userType === "agent"
);

export { studentUsers, agentUsers };
