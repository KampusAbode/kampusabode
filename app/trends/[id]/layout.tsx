// app/apartment/[id]/layout.tsx
import { ReactNode } from "react";
import { Metadata } from "next";
import { useTrendStore } from "../../store/trendStore";


type LayoutProps = {
  children: ReactNode;
  params: { id: string };
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const slug = params.id;

    const trendDetails = useTrendStore.getState().getTrendBySlug(slug);
    
    
  if (!trendDetails) {
    return {
      title: "trend Not Found - Kampusabode",
      description: "Sorry, the trend you're looking for does not exist.",
      openGraph: {
        title: "trend Not Found",
        description: "Sorry, the trend you're looking for does not exist.",
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
        title: "trend Not Found - Kampusabode",
        description: "Sorry, the trend you're looking for does not exist.",
        images: ["https://kampusabode.com/LOGO/logored_white.jpg"],
      },
    };
  }

  const title = `${trendDetails.title} - at Kampusabode`;
  const description =
    trendDetails.content ||
    "Find quality student apartments on Kampusabode.";
  const image =
    trendDetails.image ||
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
      url: `https://kampusabode.com/apartment/${trendDetails.id}`,
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
