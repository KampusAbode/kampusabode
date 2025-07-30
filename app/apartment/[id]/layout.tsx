// app/apartment/[id]/layout.tsx
import { ReactNode } from "react";
import { Metadata } from "next";
import { usePropertiesStore } from "../../store/propertiesStore";
import { getApartmentById } from "../../utils";

type LayoutProps = {
  children: ReactNode;
  params: { id: string };
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;

  // const propertyDetails = fetchPropertyById(id);
  const propertyDetails = getApartmentById(id);

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
            height: 1200,
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

  const title = `${(await propertyDetails).title} - at Kampusabode`;
  const description =
    (await propertyDetails).description ||
    "Find quality student apartments on Kampusabode.";
  const image =
    (await propertyDetails).images?.[0] ||
    "https://kampusabode.com/LOGO/logored_white.jpg";

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
      url: `https://kampusabode.com/apartment/${(await propertyDetails).id}`,
      siteName: "Kampusabode",
      images: [
        {
          url: image,
          width: 1200,
          height: 1200,
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

const ApartmentLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default ApartmentLayout;
