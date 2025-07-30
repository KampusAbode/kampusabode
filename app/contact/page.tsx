import type { Metadata } from "next";
import Image from "next/image";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact - Kampusabode",
  description:
    "Feel free to contact us through whatapp or send a mail if possible",
  keywords:
    "contact, Kampusabode, real estate, property listings, student real estate, real estate insights, Kampusabode contact page,",
};

const ContactPage = () => {
  return (
    <section className="contact-page">
      <div className="header">
        <h1>Contact Us</h1>
        <p>Get in touch with us</p>
      </div>
      <div className="container">
        <div className="fd">
          <div className="tx">
            <h3>We'd be expecting your message!</h3>
            <p>
              We're here to answer any questions you may have and assist you in
              any way possible. Feel free to reach out to us via phone, email,
              or the contact form below
            </p>
          </div>
          <div className="im">
            <Image src="/assets/await_message.jpeg" width={800} height={800} alt="await message image" />
          </div>
        </div>
        <div className="sd">
          <div className="im">
            <Image src="/assets/await_message.jpeg" width={800} height={800} alt="await message image" />
          </div>
          <div className="ft"></div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
