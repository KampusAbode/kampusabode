"use client";

import Image from "next/image";
import "./home.css";
import data from "./fetch/contents";
import { trends } from "./fetch/data/trends";
import Quotes from "./components/quotes/Quotes";
import Link from "next/link";
import { PropertyType } from "./fetch/types";
import { getProperties } from "./utils/api";

import { FaArrowRightLong } from "react-icons/fa6";
import { useState, useEffect } from "react";

const { homeSection } = data;
const { hero, about, testimonials } = homeSection;

export default function App() {
  const [properties, setProperties] = useState<PropertyType[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties: PropertyType[] = await getProperties();
      setProperties(fetchedProperties);
    };
    fetchProperties();
  }, []);

  return (
    <>
      <section className="hero-section">
        <video
          src="/assets/hero_video.mp4"
          className="hero_video"
          autoPlay
          muted
          loop>
          Your browser does not support the video tag.
        </video>
        <div className="container">
          <div className="hero-content">
            <span className="sub-head">{hero.span}</span>
            <h1>
              Find Your Perfect Student Apartment — Right from Your{" "}
              <span>
                Comfort{" "}
                <svg
                  viewBox="0 0 202.819 45.163"
                  className="hero__underline"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.12 9.857L156.9 5.515l43.806-1.229V0a749.549 749.549 0 00-114.1 22.4 2.146 2.146 0 00.584 4.209 109.73 109.73 0 0133.39 5.281v-4.129l-30 9.532a2.146 2.146 0 000 4.132 96.378 96.378 0 0022.862 3.736c2.827.118 2.821-4.167 0-4.285a91.282 91.282 0 01-21.694-3.583v4.132l30-9.532a2.147 2.147 0 000-4.132 113.829 113.829 0 00-34.558-5.434l.584 4.209a742.128 742.128 0 01112.935-22.25c2.726-.318 2.9-4.367 0-4.285L45.927 4.343 2.12 5.572c-2.821.079-2.833 4.365 0 4.285z"
                    fill="none"
                    stroke="currentcolor"
                    strokeWidth="2"></path>
                </svg>
              </span>{" "}
              Zone
            </h1>
            <p>{hero.p}</p>
            <div className="cta-hero cta">
              <Link href="/properties" className="btn">
                view apartments <FaArrowRightLong />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="service-section">
        <div className="container">
          <div className="heading-section">
            <h2 className="heading">who are we?</h2>
            <p>
              Simplicity is the key when it comes to finding a house. We help
              you find the right house right at the comfort of your zone. Kampus
              Abode streamlines the process of finding safe, affordable housing
              near campus, providing verified listings and easy access to real
              estate solutions tailored for students.
            </p>
          </div>
          <div className="services">
            {about.services.map((service) => (
              <div key={service.text} className="service">
                <Image
                  src={service.icon}
                  width={300}
                  height={300}
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
            {properties.slice(0, 3).map((prop) => (
              <div key={prop.id} className="pd">
                <Image
                  src={prop.images[0]}
                  width={1000}
                  height={1000}
                  alt="property image"
                />
                <div className="ct">
                  <p>{prop.description}</p>
                  <div>
                    <h5>{prop.title}</h5>
                    <Link href={prop.url} className="btn">
                      check out <FaArrowRightLong />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="more-listing">
            <Link href="/properties">
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
              secured their ideal housing through Kampabode, and see how the
              platform made their journey stress-free.
            </p>
          </div>
          <div className="testimonies">
            {testimonials.map((testi) => {
              return (
                <div key={testi.author} className="testimonial-card">
                  <div className="details">
                    <Image
                      src={testi.image}
                      width={500}
                      height={500}
                      alt="testi-img"
                    />
                    <div>
                      <div>
                        <h5 className="name">{testi.author}</h5>
                        <span className="company">{testi.company}</span>
                      </div>

                      {testi.rating && (
                        <div className="rating">
                          {Array.from({ length: testi.rating }, (_, i) => (
                            <span key={i}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Outline"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="#f09036">
                                <path d="M23.836,8.794a3.179,3.179,0,0,0-3.067-2.226H16.4L15.073,2.432a3.227,3.227,0,0,0-6.146,0L7.6,6.568H3.231a3.227,3.227,0,0,0-1.9,5.832L4.887,15,3.535,19.187A3.178,3.178,0,0,0,4.719,22.8a3.177,3.177,0,0,0,3.8-.019L12,20.219l3.482,2.559a3.227,3.227,0,0,0,4.983-3.591L19.113,15l3.56-2.6A3.177,3.177,0,0,0,23.836,8.794Zm-2.343,1.991-4.144,3.029a1,1,0,0,0-.362,1.116L18.562,19.8a1.227,1.227,0,0,1-1.895,1.365l-4.075-3a1,1,0,0,0-1.184,0l-4.075,3a1.227,1.227,0,0,1-1.9-1.365L7.013,14.93a1,1,0,0,0-.362-1.116L2.507,10.785a1.227,1.227,0,0,1,.724-2.217h5.1a1,1,0,0,0,.952-.694l1.55-4.831a1.227,1.227,0,0,1,2.336,0l1.55,4.831a1,1,0,0,0,.952.694h5.1a1.227,1.227,0,0,1,.724,2.217Z" />
                              </svg>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="testi-content">
                    <p className="testi">{testi.testimonial}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="quick-guide-section background-gradient">
        <div className="container">
          <div className="heading-section">
            <h2 className="heading">quick guide</h2>
            <p>
              Explore trends on essential housing tips, student living hacks,
              and expert advice to help you make informed decisions while
              searching for the perfect apartment near your campus.
            </p>
          </div>
          <div className="guides">
            {trends.slice(0, 4).map((guide) => {
              return (
                <div key={guide.title} className="blog">
                  <h5>{guide.title}</h5>
                  <p>{guide.description}</p>
                  <div>
                    <Link href="#">
                      Learn more{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Outline"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24">
                        <path d="M23.12,9.91,19.25,6a1,1,0,0,0-1.42,0h0a1,1,0,0,0,0,1.41L21.39,11H1a1,1,0,0,0-1,1H0a1,1,0,0,0,1,1H21.45l-3.62,3.61a1,1,0,0,0,0,1.42h0a1,1,0,0,0,1.42,0l3.87-3.88A3,3,0,0,0,23.12,9.91Z" />
                      </svg>
                    </Link>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Outline"
                    viewBox="0 0 24 24"
                    width="512"
                    height="512">
                    <path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z" />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <span>SEEN ENOUGH?</span>
          <h3>Get in touch with us today</h3>
          <p>
            Are you ready to find your dream home or investment property? Kampus
            Abode is here to help. With our years of experience and dedication
          </p>
          <div className="cta">
            <Link href="/contact" className="btn">
              contact
            </Link>
            <Link href="/auth/signup" className="btn-secondary">
              get started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
