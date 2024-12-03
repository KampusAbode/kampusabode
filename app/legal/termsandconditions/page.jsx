import React from "react";
import "../legal.css";

const TermsAndConditions = () => {
  return (
    <section className="terms-and-conditions">
      <div className="container">
        <h2>Terms and Conditions</h2>
        <p>Last Updated: 01-22-2024</p>

        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using Kampabode, you agree to comply with and be bound
          by these Terms...
        </p>

        <h3>2. Eligibility</h3>
        <p>To use Kampabode, you must be at least 18 years of age...</p>

        {/* Add the rest of your Terms and Conditions here */}

        <h3>11. Contact Information</h3>
        <p>
          If you have any questions about these Terms, please contact us at:
          contactKampabode@gmail.com.
        </p>
      </div>
    </section>
  );
};

export default TermsAndConditions;
