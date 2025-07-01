// app/apartment/[id]/page.tsx
import { Metadata } from "next";
import PropertyDetails from "./components/propertyDetails";
import { getApartmentById } from "../../utils";

type Params = {
  params: { id: string };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = params;

  const propertyDetails = await getApartmentById(id);

  // Handle case where property is not found
  if (!propertyDetails) {
    return {
      title: "Property Not Found - Kampusabode",
      description: "Sorry, the property you're looking for does not exist.",
      openGraph: {
        title: "Property Not Found",
        description: "Sorry, the property you're looking for does not exist.",
        images: [
          {
            url: "https://kampusabode.com/LOGO/logored_white.jpg",
            width: 1200,
            height: 630,
            alt: "Kampusabode - Apartment Listing Site",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Property Not Found - Kampusabode",
        description: "Sorry, the property you're looking for does not exist.",
        images: ["https://kampusabode.com/LOGO/logored_white.jpg"],
      },
    };
  }

  const title = `${propertyDetails.title} - at Kampusabode`;
  const description = propertyDetails.description || "Find quality student apartments on Kampusabode.";
  const image = propertyDetails.images?.[0] || "https://kampusabode.com/LOGO/logored_white.jpg";

  return {
    title,
    description,
    keywords: [
      "apartment listings",
      "real estate",
      "apartments",
      "houses",
      "rentals",
      "students",
      "university",
    ],
    openGraph: {
      title,
      description,
      url: `https://kampusabode.com/apartment/${propertyDetails.id}`,
      siteName: "Kampusabode",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

const PropertyPage = ({ params }: Params) => {
  const { id } = params;

  return <PropertyDetails id={id} />;
};

export default PropertyPage;
