import type {Metadata} from 'next'



export const metadata: Metadata = {
  title: "Real Estate Insights and News - Kampusabode",
  description:
    "Explore the latest trends and insights about real estate. Stay informed with Kampusabode's curated content to navigate the property landscape confidently.",
  keywords:
    "real estate trends, property news, student real estate, real estate insights, Kampusabode trends",
  openGraph: {
    title: "Real Estate Insights and News - Kampusabode",
    description:
      "Explore the latest trends and insights about real estate. Stay informed with Kampusabode's curated content to navigate the property landscape confidently.",
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
    title: "Real Estate Insights and News - Kampusabode",
    description:
      "Explore the latest trends and insights about real estate. Stay informed with Kampusabode's curated content to navigate the property landscape confidently.",
    images: ["https://kampusabode.com/LOGO/logored_white.jpg"],
  },
};

export default function TrendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
