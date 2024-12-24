// app/properties/[id]/page.tsx
import { Metadata } from "next";
import PropertyDetails from "./propertyDetails";
import { getProperties } from "../../utils";

type Params = {
  params: { id: string };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = params;
  const properties = await getProperties();
  const propertyDetails = properties.find((prop) => prop.id.toString() === id);

  if (!propertyDetails) {
    return {
      title: "Property Not Found",
      description: "Sorry, the property you're looking for does not exist.",
      openGraph: {
        title: "Property Not Found",
        description: "Sorry, the property you're looking for does not exist.",
        images: [
          {
            url: "/LOGO/REDTR.png",
            width: 400,
            height: 400,
            alt: "Property Not Found",
          },
        ],
      },
    };
  }

  return {
    title: `${propertyDetails.title} - Kampusabode`,
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
  return <PropertyDetails id={params.id} />;
};

export default PropertyPage;
