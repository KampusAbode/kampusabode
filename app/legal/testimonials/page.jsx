import React from "react";
import "../legal.css";

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="container">
        <h2>What Students and Agents Are Saying</h2>

        <div className="testimonial">
          <blockquote>
            <p>
              “Kampusabode helped me find the perfect apartment near campus
              within a week! The process was so easy, and I loved being able to
              chat directly with the agent.”
            </p>
            <footer>– Sarah L., Student at XYZ University</footer>
          </blockquote>
        </div>

        <div className="testimonial">
          <blockquote>
            <p>
              “As a property agent, I’ve been able to list and rent out my
              properties faster than ever thanks to Kampusabode’s easy-to-use
              platform and targeted student audience.”
            </p>
            <footer>– John D., Real Estate Agent</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
