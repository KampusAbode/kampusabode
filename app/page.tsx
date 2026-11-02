"use client";

import Image from "next/image";
import "./home.css";
import data from "./fetch/contents";
import Quotes from "./components/quotes/Quotes";
import Footer from "./components/footer/Footer";
import Link from "next/link";
import { TrendType } from "./fetch/types";
import { allTrends, fetchPropertiesRealtime } from "./utils";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  House,
  Images,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react";
import TrendCard from "./trends/component/trendCard/TrendCard";
import gsap from "gsap";
import { usePropertiesStore } from "./store/propertiesStore";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import { defaultTransition, fadeIn, fadeUp } from "./lib/motion";
import { ButtonLink } from "./components/button/Button";
gsap.registerPlugin(ScrollTrigger);

const { homeSection } = data;
const { hero, about, testimonials } = homeSection;
const serviceIcons = [MapPin, Images, BadgeCheck];
const productPillars = [
  {
    title: "Accommodation",
    description: "Browse student housing near your university.",
    href: "/apartment",
    Icon: House,
  },
  {
    title: "Information",
    description: "Find practical guidance for student living.",
    href: "/trends",
    Icon: BookOpenText,
  },
  {
    title: "Marketplace",
    description: "Discover useful items from your campus community.",
    href: "/marketplace",
    Icon: ShoppingBag,
  },
];

export default function App() {
  const [trends, setTrends] = useState<TrendType[]>([]);
  const { properties, setProperties } = usePropertiesStore();
  const prefersReducedMotion = useReducedMotion();
  const sectionReveal = prefersReducedMotion ? fadeIn : fadeUp;

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
        <div className="container">
          <div className="hero-content">
            <h1>
              Find your ideal hostel and connect with <span>trusted</span>{" "}
              agents <br /> all from your phone.
            </h1>
            <p>{hero.p}</p>
            <div className="cta-hero cta">
              <ButtonLink
                prefetch
                href="/apartment"
                rightIcon={<ArrowRight aria-hidden="true" />}
              >
                view apartments
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        className="pillars-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        transition={defaultTransition}
      >
        <div className="container">
          <div className="heading-section">
            <h2 className="heading">Everything for campus living</h2>
            <p>
              Find a place to stay, helpful student information, and essentials
              for everyday campus life.
            </p>
          </div>
          <div className="product-pillars">
            {productPillars.map(({ title, description, href, Icon }) => (
              <article className="product-pillar" key={title}>
                <div className="pillar-icon">
                  <Icon aria-hidden="true" size={24} strokeWidth={1.75} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <Link
                  prefetch
                  href={href}
                  className="pillar-link"
                  aria-label={`Explore ${title}`}
                >
                  Explore
                  <ArrowRight
                    aria-hidden="true"
                    size={20}
                    strokeWidth={1.75}
                  />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="service-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        transition={defaultTransition}
      >
        <div className="container">
          <div className="heading-section">
            <h2 className="heading">{about.heading}</h2>
            <p>{about.waw}</p>
          </div>
          <div className="services">
            {about.services.map((service, index) => {
              const ServiceIcon = serviceIcons[index] ?? BadgeCheck;

              return (
                <div key={service.text} className="service">
                  <div className="service-icon">
                    <ServiceIcon
                      aria-hidden="true"
                      size={24}
                      strokeWidth={1.75}
                    />
                  </div>
                  <h5>{service.heading}</h5>
                  <p>{service.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="recent-property-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        transition={defaultTransition}
      >
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
                    src={prop.images[0]}
                    width={1000}
                    height={1000}
                    sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 30vw"
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
                      <ButtonLink
                        prefetch
                        href={prop.url}
                        variant="outline"
                        rightIcon={<ArrowRight aria-hidden="true" />}
                      >
                        check out
                      </ButtonLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="more-listing">
            <Link prefetch href="/apartment">
              more listing{" "}
              <ArrowRight aria-hidden="true" size={20} strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </motion.section>

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
                      src={testi.image}
                      width={500}
                      height={500}
                      sizes="64px"
                      alt="testi-img"
                    />
                    <div>
                      <p className="name">{testi.author}</p>
                      <span className="company">{testi.company}</span>
                    </div>
                  </div>

                  <div className="rating">
                    <BadgeCheck
                      aria-label="Verified"
                      role="img"
                      size={20}
                      strokeWidth={1.75}
                    />
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
            <ButtonLink prefetch href="/contact">
              contact
            </ButtonLink>
            <ButtonLink prefetch href="/auth/signup" variant="secondary">
              get started
            </ButtonLink>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
