// app/apartment/[id]/page.tsx
import { Metadata } from "next";
import PropertyDetails from "./components/propertyDetails";
import { useProperties } from "../../utils";

type Params = {
  params: { id: string };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = params;

  // Fetch property details from your data source (could be API or DB)
  const { getApartmentById } = useProperties();
  const propertyDetails = await getApartmentById(id);

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
    title: `${propertyDetails.title} - at Kampusabode`,
    description: propertyDetails.description,
    keywords: "property listings, real estate, apartments, houses",
    openGraph: {
      title: propertyDetails.title,
      description: propertyDetails.description,
      images: [
        {
          url: propertyDetails.images[0],
          width: 800,
          height: 600,
          alt: propertyDetails.title,
        },
      ],
    },
  };
}

const PropertyPage = ({ params }: Params) => {
  const { id } = params;

  return <PropertyDetails id={id} />;
};

export default PropertyPage;
