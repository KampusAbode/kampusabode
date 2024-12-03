import { trends } from "../fetch/data/trends";
import "./trends.css";
import ArticleCard from "../components/cards/articleCard/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Insights and News - Kampabode",
  description:
    "Explore the latest trends and insights about real estate. Stay informed with Kampabode's curated content to navigate the property landscape confidently.",
  keywords:
    "real estate trends, property news, student real estate, real estate insights, Kampabode trends,",
};

export default function trendsPage() {
  return (
    <section className="trends-page">
      <div className="container">
        <h2>Trends</h2>

        <div className="trends">
          {trends.map((read) => (
            <ArticleCard key={read?.title} articleData={read} />
          ))}
        </div>
      </div>
    </section>
  );
}
