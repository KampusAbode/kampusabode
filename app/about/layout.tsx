import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
      title:
        "About Us - Kampusabode | Leading Real Estate Platform for Students",
      description:
        "Discover Kampusabode's mission to simplify real estate for students. Explore our journey and commitment to providing comprehensive property listings on campuses.",
      keywords:
        "about Kampusabode, student real estate, campus apartments, real estate platform, property listing",
    };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return { children };
}
