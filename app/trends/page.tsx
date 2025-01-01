import { trends } from "../fetch/data/trends";
import "./trends.css";
import TrendCard from "../components/cards/trendCard/TrendCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Insights and News - Kampusabode",
  description:
    "Explore the latest trends and insights about real estate. Stay informed with Kampusabode's curated content to navigate the property landscape confidently.",
  keywords:
    "real estate trends, property news, student real estate, real estate insights, Kampusabode trends,",
};

export default function trendsPage() {
  return (
    <section className="trends-page">
      <div className="container">
        <h2>Trends</h2>

        <div className="trends">
          {trends.map((read) => (
            <TrendCard key={read?.title} trendData={read} />
          ))}
        </div>
      </div>
    </section>
  );
}
