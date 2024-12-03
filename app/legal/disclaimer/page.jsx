import React from "react";
import "../legal.css";

const Disclaimer = () => {
  return (
    <section className="disclaimer">
      <div className="container">
        <h3>Disclaimer</h3>
        <p>Last Updated: 01-22-2024</p>

        <p>
          Kampabode provides this platform as a service to connect students and
          agents. By using the platform, you agree to the following disclaimers:
        </p>

        <h4>1. Accuracy of Listings</h4>
        <p>
          While we encourage agents to provide accurate property information,
          Kampabode does not guarantee the accuracy, completeness, or
          reliability of any property listing. We recommend that users verify
          property details in person.
        </p>

        <h4>2. No Endorsement</h4>
        <p>
          Kampabode does not endorse any agent, landlord, or property listing.
          We are not responsible for any transactions, agreements, or disputes
          between users.
        </p>

        <h4>3. Limitation of Liability</h4>
        <p>
          Kampabode is not liable for any damages arising from the use of the
          platform, including property transactions, communications with agents,
          or any other interactions.
        </p>

        <h4>Changes to This Disclaimer</h4>
        <p>
          We may update this Disclaimer periodically. The most current version
          will be available on our website.
        </p>
      </div>
    </section>
  );
};

export default Disclaimer;
