type Review = {
  id: number;
  agentId: number;
  author: number;
  propertyId: number;
  content: string;
  rating: number;
  date: "Sep 16 2024"
};

const reviews: Review[] = [
  {
    id: 8726491537,
    agentId: 3728492, // Michael Brown
    author: 1829475, // John Doe
    propertyId: 5748392014,
    content: "Great place, quiet and close to school.",
    rating: 4,
    date: "Sep 16 2024"
  },
  {
    id: 8266462517,
    agentId: 3728492, // Michael Brown
    author: 2843651, // Sarah Akin
    propertyId: 5748392014,
    content: "The apartment is okay, but could use some updates.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 4862310975,
    agentId: 4893716, // Anita Williams
    author: 1829475, // John Doe
    propertyId: 7382951468,
    content: "Affordable and spacious, would recommend.",
    rating: 5,
    date: "Sep 16 2024"
  },
  {
    id: 6616357253,
    agentId: 4893716, // Anita Williams
    author: 5489723, // Emeka Okoro
    propertyId: 7382951468,
    content: "Had a great experience, landlord is helpful.",
    rating: 4,
    date: "Sep 16 2024"
  },
  {
    id: 1234567890,
    agentId: 7892430, // David Adeoye
    author: 5489723, // Emeka Okoro
    propertyId: 1462379852,
    content: "Clean property but a bit far from campus.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 9928265424,
    agentId: 7892430, // David Adeoye
    author: 2843651, // Sarah Akin
    propertyId: 1462379852,
    content: "Nice and well-maintained.",
    rating: 4,
    date: "Sep 16 2024"
  },
  {
    id: 5748392014,
    agentId: 1023489, // Grace Eze
    author: 8452379, // Chioma Nduka
    propertyId: 4958127360,
    content: "Loved the space, very cozy and modern.",
    rating: 5,
    date: "Sep 16 2024"
  },
  {
    id: 7382951468,
    agentId: 1023489, // Grace Eze
    author: 5489723, // Emeka Okoro
    propertyId: 4958127360,
    content: "The kitchen is too small for my liking.",
    rating: 2,
    date: "Sep 16 2024"
  },
  {
    id: 1462379852,
    agentId: 6734891, // Jennifer Chike
    author: 2843651, // Sarah Akin
    propertyId: 82664625176,
    content: "A decent place, but overpriced for the area.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 2938475610,
    agentId: 6734891, // Jennifer Chike
    author: 9354782, // Samuel Lawson
    propertyId: 82664625176,
    content: "Good property but the noise level is high.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 4958127360,
    agentId: 3728492, // Michael Brown
    author: 1023489, // Grace Eze
    propertyId: 5748392014,
    content: "Really enjoyed my stay, great landlord.",
    rating: 5,
    date: "Sep 16 2024"
  },
  {
    id: 8726491537,
    agentId: 3728492, // Michael Brown
    author: 5489723, // Emeka Okoro
    propertyId: 5748392014,
    content: "Convenient location but parking is a problem.",
    rating: 4,
    date: "Sep 16 2024"
  },
  {
    id: 8266462517,
    agentId: 4893716, // Anita Williams
    author: 8452379, // Chioma Nduka
    propertyId: 7382951468,
    content: "The landlord is very responsive and helpful.",
    rating: 5,
    date: "Sep 16 2024"
  },
  {
    id: 4862310975,
    agentId: 4893716, // Anita Williams
    author: 5489723, // Emeka Okoro
    propertyId: 7382951468,
    content: "The rooms are spacious but the area feels unsafe.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 6616357253,
    agentId: 7892430, // David Adeoye
    author: 1829475, // John Doe
    propertyId: 1462379852,
    content: "Good value for the money.",
    rating: 4,
    date: "Sep 16 2024"
  },
  {
    id: 1234567890,
    agentId: 7892430, // David Adeoye
    author: 2843651, // Sarah Akin
    propertyId: 1462379852,
    content: "Nice apartment but the water pressure is low.",
    rating: 2,
    date: "Sep 16 2024"
  },
  {
    id: 9928265424,
    agentId: 1023489, // Grace Eze
    author: 5489723, // Emeka Okoro
    propertyId: 4958127360,
    content: "I had a wonderful time staying here.",
    rating: 5,
    date: "Sep 16 2024"
  },
  {
    id: 5748392014,
    agentId: 1023489, // Grace Eze
    author: 9354782, // Samuel Lawson
    propertyId: 4958127360,
    content: "Needs better maintenance, but overall a good place.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 7382951468,
    agentId: 3728492, // Michael Brown
    author: 5489723, // Emeka Okoro
    propertyId: 5748392014,
    content: "Perfect location, really close to campus.",
    rating: 5,
    date: "Sep 16 2024"
  },
  {
    id: 1462379852,
    agentId: 3728492, // Michael Brown
    author: 8452379, // Chioma Nduka
    propertyId: 5748392014,
    content: "The apartment is a bit small for the price.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 2938475610,
    agentId: 4893716, // Anita Williams
    author: 1023489, // Grace Eze
    propertyId: 7382951468,
    content: "Excellent space, modern amenities.",
    rating: 5,
    date: "Sep 16 2024"
  },
  {
    id: 4958127360,
    agentId: 4893716, // Anita Williams
    author: 5489723, // Emeka Okoro
    propertyId: 7382951468,
    content: "Good apartment but the neighborhood is too noisy.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 8726491537,
    agentId: 7892430, // David Adeoye
    author: 1829475, // John Doe
    propertyId: 1462379852,
    content: "I enjoyed living here, highly recommended.",
    rating: 4,
    date: "Sep 16 2024"
  },
  {
    id: 8266462517,
    agentId: 7892430, // David Adeoye
    author: 2843651, // Sarah Akin
    propertyId: 1462379852,
    content: "The place is alright but needs better management.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 4862310975,
    agentId: 1023489, // Grace Eze
    author: 5489723, // Emeka Okoro
    propertyId: 4958127360,
    content: "Great value for the rent.",
    rating: 4,
    date: "Sep 16 2024"
  },
  {
    id: 6616357253,
    agentId: 1023489, // Grace Eze
    author: 9354782, // Samuel Lawson
    propertyId: 4958127360,
    content: "Could use some updates, but a nice spot.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 1234567890,
    agentId: 3728492, // Michael Brown
    author: 5489723, // Emeka Okoro
    propertyId: 5748392014,
    content: "Good for short-term stays, not long-term.",
    rating: 3,
    date: "Sep 16 2024"
  },
  {
    id: 9928265424,
    agentId: 3728492, // Michael Brown
    author: 2843651, // Sarah Akin
    propertyId: 5748392014,
    content: "Loved the modern kitchen and spacious rooms.",
    rating: 5,
    date: "Sep 16 2024"
  },
  {
    id: 5748392014,
    agentId: 4893716, // Anita Williams
    author: 8452379, // Chioma Nduka
    propertyId: 7382951468,
    content: "Not bad, but a bit overpriced.",
    rating: 3,
    date: "Sep 16 2024"
  },
];

export default reviews;
