// app/apartment/[id]/layout.tsx
import { ReactNode } from "react";
import { Metadata } from "next";
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

  // Fetch apartment details (server-side safe utility)
  const property = await getApartmentById(id);

  if (!property) {
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
      alternates: {
        canonical: `https://kampusabode.com/apartment/${id}`,
      },
    };
  }

  // Truncate description for SEO safety (≤160 chars)
  const truncatedDescription =
    (property.description?.length ?? 0) > 160
      ? property.description.slice(0, 157) + "..."
      : property.description || "Find quality student apartments on Kampusabode.";

  const title = `${property.title} - at Kampusabode`;
  const image =
    property.images?.[0] ||
    "https://kampusabode.com/LOGO/logored_white.jpg";

  return {
    title,
    description: truncatedDescription,
    openGraph: {
      title,
      description: truncatedDescription,
      url: `https://kampusabode.com/apartment/${property.id}`,
      siteName: "Kampusabode",
      images: [
        {
          url: image,
          width: 1200,
          height: 1200,
          alt: property.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: truncatedDescription,
      images: [image],
    },
    alternates: {
      canonical: `https://kampusabode.com/apartment/${property.id}`,
    },
  };
}

const ApartmentLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default ApartmentLayout;
