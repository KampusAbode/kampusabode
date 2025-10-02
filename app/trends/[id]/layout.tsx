// app/apartment/[id]/layout.tsx
import { ReactNode } from "react";
import { Metadata } from "next";
import { fetchTrendBySlug } from "../../utils";
import { TrendType } from "../../fetch/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

type LayoutProps = {
  children: ReactNode;
  params: { id: string };
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const trend: TrendType = await fetchTrendBySlug(id);

  if (!trend) {
    return {
      title: "Trend Not Found - Kampusabode",
      description: "Sorry, the trend you're looking for does not exist.",
      openGraph: {
        title: "Trend Not Found",
        description: "Sorry, the trend you're looking for does not exist.",
        images: [
          {
            url: "https://kampusabode.com/LOGO/logored_white.jpg",
            width: 1200,
            height: 1200,
            alt: "Kampusabode - Trend Listing",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Trend Not Found - Kampusabode",
        description: "Sorry, the trend you're looking for does not exist.",
        images: ["https://kampusabode.com/LOGO/logored_white.jpg"],
      },
      alternates: {
        canonical: `https://kampusabode.com/apartment/${params.id}`,
      },
    };
  }

 

  const title = `${trend.title} - at Kampusabode`;
  const description =
    (trend.content?.slice(0, 157) || "Discover the latest campus updates on Kampusabode.") +
    "...";
  const image =
    trend?.image ||
    "https://kampusabode.com/LOGO/logored_white.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://kampusabode.com/apartment/${trend.id}`,
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
    alternates: {
      canonical: `https://kampusabode.com/apartment/${trend.id}`,
    },
  };
}

const ApartmentLayout = ({ children }: LayoutProps) => {
  return <>{children}</>;
};

export default ApartmentLayout;
