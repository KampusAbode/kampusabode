
import type {Metadata} from 'next'


export const metadata: Metadata = {
  title: "Real Estate Insights and News - Kampusabode",
  description:
    "Explore the latest trends and insights about real estate. Stay informed with Kampusabode's curated content to navigate the property landscape confidently.",
  keywords:
    "real estate trends, property news, student real estate, real estate insights, Kampusabode trends",
};

export default function TrendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
