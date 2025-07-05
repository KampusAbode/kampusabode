"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import type { Metadata } from "next";
import Image from "next/image";
import "./about.css";
import { useEffect } from "react";



export default function AboutPage() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray<HTMLElement>("h1, h5, h3, h2, p, img").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });
    gsap.utils.toArray<HTMLElement>(".mf1, .mf2").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none",
        },
      });
    });
  }, []);
  return (
    <section className="about-page">
      <div className="header">
        <h1>Our Mission</h1>
        <p>Know about us and what we do</p>
      </div>
      <div className="container">
        <div className="mf">
          <div className="mf1">
            <h5>
              No house <span>agent stress</span>
            </h5>
            <p>
              Chill and relax while we help you to remove the house agent
              wahala!
            </p>
            <div className="image">
              <Image
                priority
                src="/assets/mf1.png"
                width={2000}
                height={2000}
                alt=""
              />
            </div>
            <Image
              priority
              src="/assets/mf1c.png"
              width={500}
              height={500}
              className="dot"
              alt=""
            />
          </div>
          <div className="mf2">
            <h5>
              Rent <span>apartment</span> of your choice
            </h5>
            <p>
              We're here to simplify the process and guide you every step of the
              way.
            </p>
            <div className="image">
              <Image
                priority
                src="/assets/mf2.png"
                width={2000}
                height={2000}
                alt=""
              />
            </div>

            <Image
              priority
              src="/assets/mf2c.png"
              width={500}
              height={500}
              className="dot"
              alt=""
            />
          </div>
        </div>
        <div className="about">
          <h2 className="heading">Journey with us</h2>
          <p>
            At Kampusabode, we understand that finding the best apartment or the
            perfect investment property can be an overwhelming task. That's why
            we're here to simplify the process and guide you every step of the
            way.
          </p>
        </div>
        <div className="journey">
          <div className="path">
            <div className="content">
              <span>property listing</span>
              <h3>Comprehensive listings within the area</h3>
              <p>
                Our website offers an extensive database of properties within
                the area, ranging from cozy apartments to luxurious estates. You
                can explore each property from the comfort of your home.
              </p>
            </div>
            <div className="image">
              <Image
                priority
                src="/assets/b1.jpg"
                width={2000}
                height={2000}
                alt=""
              />
            </div>
          </div>
          <div className="path switch">
            <div className="content">
              <span>Guidance</span>
              <h3>Expert Guidance</h3>
              <p>
                Navigating the real estate market can be challenging, especially
                for those unfamiliar with its intricacies. That's where our team
                of experienced real estate professionals comes in.
              </p>
            </div>
            <div className="image">
              <Image
                priority
                src="/assets/b2.jpg"
                width={2000}
                height={2000}
                alt=""
              />
            </div>
          </div>
          <div className="path">
            <div className="content">
              <span>Top-notch</span>
              <h3>Personalized Services</h3>
              <p>
                At Kampusabode, we believe in delivering personalized service
                tailored to each client's unique needs. Whether you're buying,
                selling, or renting, we take the time to understand your goals
                and preferences.
              </p>
            </div>
            <div className="image">
              <Image
                priority
                src="/assets/b3.jpg"
                width={2000}
                height={2000}
                alt=""
              />
            </div>
          </div>
          <div className="path switch">
            <div className="content">
              <span>Resources</span>
              <h3>Resources and Tools</h3>
              <p>
                In addition to our listings and expert guidance, we offer a
                variety of resources and tools to empower our clients throughout
                their real estate journey. From neighborhood guides to tips for
                staging your home.
              </p>
            </div>
            <div className="image">
              <Image
                priority
                src="/assets/b4.jpg"
                width={2000}
                height={2000}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
