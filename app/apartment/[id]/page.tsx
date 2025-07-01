// app/apartment/[id]/page.tsx
import { Metadata } from "next";
import PropertyDetails from "./components/propertyDetails";
import { getApartmentById } from "../../utils";

type Params = {
  params: { id: string };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = params;

  
  // Fetch property details from your data source (could be API or DB)
  // const { getApartmentById } = useProperties();
  const propertyDetails = await getApartmentById(id);
  const title = `${propertyDetails.title} - at Kampusabode`;
  const description = propertyDetails.description || "Find quality student apartments on Kampusabode.";
  const image = propertyDetails.images?.[0] || "https://kampusabode.com/LOGO/logored_white.jpg";
  

  if (!propertyDetails) {
    return {
      title: "Property Not Found",
      description: "Sorry, the property you're looking for does not exist.",
      openGraph: {
        title: "Property Not Found",
        description: "Sorry, the property you're looking for does not exist.",
        images: [
          {
            url: "/LOGO/logored_white.jpg",
            width: 400,
            height: 400,
            alt: "Property Not Found",
          },
        ],
      },
    };
  }

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
