import { articles } from "../fetch/data/articles";
import "./articles.css";
import ArticleCard from "../components/cards/articleCard/ArticleCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Insights and News - Kampus Abode",
  description:
    "Explore the latest articles and insights about real estate. Stay informed with Kampus Abode's curated content to navigate the property landscape confidently.",
  keywords:
    "real estate articles, property news, student real estate, real estate insights, Kampus Abode articles,",
};

export default function ArticlesPage() {
  return (
    <section className="articles-page">
      <div className="container">
        <h2>Articles</h2>

        <div className="articles">
          {articles.map((read) => (
            <ArticleCard key={read?.title} articleData={read} />
          ))}
        </div>
      </div>
    </section>
  );
}
