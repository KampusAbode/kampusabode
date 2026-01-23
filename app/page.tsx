"use client";

import Image from "next/image";
import "./home.css";
import data from "./fetch/contents";
import Quotes from "./components/quotes/Quotes";
import Footer from "./components/footer/Footer";
import Link from "next/link";
import { TrendType } from "./fetch/types";
import { allTrends, fetchPropertiesRealtime } from "./utils";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import TrendCard from "./trends/component/trendCard/TrendCard";
import gsap from "gsap";
import { usePropertiesStore } from "./store/propertiesStore";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const { homeSection } = data;
const { hero, about, testimonials } = homeSection;

export default function App() {
  const [trends, setTrends] = useState<TrendType[]>([]);
  const { properties, setProperties } = usePropertiesStore();

  useEffect(() => {
    const unsubscribe = fetchPropertiesRealtime((fetchedProperties) => {
      setProperties(fetchedProperties);
    });

    return () => unsubscribe();
  }, [setProperties]);

  //   useEffect(() => {
  //   gsap.registerPlugin(ScrollTrigger);

  //   gsap.utils
  //     .toArray<HTMLElement>(
  //       ".heading, .service, .pd, .testimonial-card, .trend, .cta-section, .hero-content"
  //     )
  //     .forEach((el) => {
  //       gsap.from(el, {
  //         opacity: 0,
  //         y: 50,
  //         duration: 0.5,
  //         ease: "power2.out",
  //         scrollTrigger: {
  //           trigger: el,
  //           start: "top 90%",
  //           toggleActions: "play none none none",
  //         },
  //       });
  //     });

  //   ScrollTrigger.refresh();
  // }, []);

  useEffect(() => {
    // Fetch trends using allTrends function and update local state
    const unsubscribe = allTrends((items) => {
      setTrends(items);
    });

    return () => unsubscribe();
  }, []);

  const extractFirstParagraph = (html: string): string => {
    if (typeof window === "undefined") return "";
    const div = document.createElement("div");
    div.innerHTML = html || "";
    const firstP = div.querySelector("p");
    return firstP ? firstP.outerHTML : `<p>${html}</p>`;
  };

  return (
    <>
      <section className="hero-section">
        <video
          src={"/assets/hero_video.mp4"}
          className="hero_video"
          autoPlay
          muted
          loop>
          Your browser does not support the video tag.
        </video>
        <div className="container">
          <div className="hero-content">
            <h1>
              Find your ideal hostel and connect with <span>trusted</span>{" "}
              agents—all from your phone.
            </h1>
            <p>{hero.p}</p>
            <div className="cta-hero cta">
              <Link prefetch href="/apartment" className="btn">
                view apartments <FaArrowRightLong />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="service-section">
        <div className="container">
          <div className="heading-section">
            <h2 className="heading">{about.heading}</h2>
            <p>{about.waw}</p>
          </div>
          <div className="services">
            {about.services.map((service) => (
              <div key={service.text} className="service">
                <Image
                  priority
                  src={service.icon}
                  width={500}
                  height={500}
                  alt="service icon"
                />

                <h5>{service.heading}</h5>
                <p>{service.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="recent-property-section">
        <div className="container">
          <div className="heading-section">
            <h2 className="heading">recent properties</h2>
            <p>
              Stay updated with newly available student apartments, handpicked
              to meet your needs in location, budget, and amenities, all within
              your campus community.
            </p>
          </div>
          <div className="properties">
            {properties.slice(0, 3).map((prop) => {
              const snippet = extractFirstParagraph(prop?.description);

              return (
                <div key={prop.id} className="pd">
                  <Image
                    priority
                    src={prop.images[0]}
                    width={1000}
                    height={1000}
                    alt="property image"
                  />
                  <div className="ct">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: snippet,
                      }}
                    />
                    <div>
                      <h6>{prop.title}</h6>
                      <Link prefetch href={prop.url} className="btn">
                        check out <FaArrowRightLong />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="more-listing">
            <Link prefetch href="/apartment">
              more listing <FaArrowRightLong />
            </Link>
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="container">
          <Quotes />
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="heading-section">
            <h2 className="heading">testimonials</h2>
            <p>
              Read real experiences from fellow students who successfully
              secured their ideal housing through Kampusabode, and see how the
              platform made their journey stress-free.
            </p>
          </div>
          <div className="testimonies">
            {testimonials.map((testi) => (
              <div key={testi.author} className="testimonial-card">
                <div className="details">
                  <div className="testi-profile">
                    <Image
                      priority
                      src={testi.image}
                      width={500}
                      height={500}
                      alt="testi-img"
                    />
                    <div>
                      <p className="name">{testi.author}</p>
                      <span className="company">{testi.company}</span>
                    </div>
                  </div>

                  <div className="rating">
                    <RiVerifiedBadgeLine title="Verified" />
                  </div>
                </div>
                <div className="testi-content">
                  <span className="testi">{testi.testimonial}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trends-section">
        <div className="container">
          <div className="heading-section">
            <h2 className="heading">trends</h2>
            <p>
              Explore trends on essential housing tips, student living hacks,
              and expert advice to help you make informed decisions while
              searching for the perfect apartment near your campus.
            </p>
          </div>
          <div className="trends">
            {trends.slice(0, 3).map((trendData) => (
              <TrendCard key={trendData.id} trendData={trendData} />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <span>SEEN ENOUGH?</span>
          <h3>Get in touch with us today</h3>
          <p>
            Are you ready to find your dream home or a perfect property? Kampus
            Abode is here to help. With our years of experience and dedication
          </p>
          <div className="cta">
            <Link prefetch href="/contact" className="btn">
              contact
            </Link>
            <Link prefetch href="/auth/signup" className="btn btn-secondary">
              get started
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
