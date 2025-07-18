import React from "react";
import "../legal.css";

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="container">
        <h4 className="page-heading">What Students and Agents Are Saying</h4>

        
        <div className="testimonial">
          <blockquote>
            <p>
              “Kampus Abode is the best there is and the best there’ll ever
              be. I highly recommend Kampus Abode to anyone looking to rent.
              Their integrity, attention to detail, and customer-first approach
              truly set them apart.”
            </p>
            <footer>
              – Matthew Balogun, Student at Obafemi Awolowo University
            </footer>
          </blockquote>
        </div>

        <div className="testimonial">
          <blockquote>
            <p>
              “Wow, I'm impressed by how fast and reliable Kampus Abode is! It's
              incredibly easy to use, and being able to rent through my phone
              adds an extra layer of convenience. Thanks!"”
            </p>
            <footer>– Wale, Student at Obafemi Awolowo University</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
