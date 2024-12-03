import type { Metadata } from "next";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact - Kampabode",
  description:
    "Feel free to contact us through whatapp or send a mail if possible",
  keywords:
    "contact, Kampabode, real estate, property listings, student real estate, real estate insights, Kampabode contact page,",
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
            <img src="/assets/await_message.jpeg" alt="await message image" />
          </div>
        </div>
        <div className="sd">
          <div className="im">
            <img src="/assets/await_message.jpeg" alt="await message image" />
          </div>
          <div className="ft"></div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
