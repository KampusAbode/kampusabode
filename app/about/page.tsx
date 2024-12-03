import Image from "next/image";
import "./about.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Kampabode | Leading Real Estate Platform for Students",
  description:
    "Discover Kampabode's mission to simplify real estate for students. Explore our journey and commitment to providing comprehensive property listings on campuses.",
  keywords:
    "about Kampabode, student real estate, campus apartments, real estate platform, property listing",
};

export default function AboutPage() {
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
              <Image src="/assets/mf1.png" width={1000} height={1000} alt="" />
            </div>
            <Image
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
              <Image src="/assets/mf2.png" width={1000} height={1000} alt="" />
            </div>

            <Image
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
            At Kampabode, we understand that finding the best apartment or the
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
              <Image src="/assets/b1.jpg" width={1000} height={1000} alt="" />
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
              <Image src="/assets/b2.jpg" width={1000} height={1000} alt="" />
            </div>
          </div>
          <div className="path">
            <div className="content">
              <span>Top-notch</span>
              <h3>Personalized Services</h3>
              <p>
                At Kampabode, we believe in delivering personalized service
                tailored to each client's unique needs. Whether you're buying,
                selling, or renting, we take the time to understand your goals
                and preferences.
              </p>
            </div>
            <div className="image">
              <Image src="/assets/b3.jpg" width={1000} height={1000} alt="" />
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
              <Image src="/assets/b4.jpg" width={1000} height={1000} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
