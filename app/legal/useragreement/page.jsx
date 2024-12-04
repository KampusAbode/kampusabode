import React from "react";
import "../legal.css";

const UserAgreement = () => {
  return (
    <section className="user-agreement">
      <div className="container">
        <h3>User Agreement</h3>
        <p>Last Updated: 01-22-2024</p>

        <p>
          This User Agreement sets forth the terms of your relationship with
          Kampusabode. By using the platform, you agree to the following:
        </p>

        <h4>1. Acceptable Use</h4>
        <p>You agree not to:</p>
        <ol>
          <li>Misuse the platform or engage in harmful activities.</li>
          <li>Post false or misleading information.</li>
          <li>Interfere with the security of the platform.</li>
        </ol>

        <h4>2. Content Ownership</h4>
        <p>
          You retain ownership of the content you upload to Kampusabode.
          However, by posting content, you grant us a non-exclusive,
          royalty-free license to use, distribute, and display it on the
          platform.
        </p>

        <h4>3. Account Termination</h4>
        <p>
          We reserve the right to terminate your account for violations of this
          agreement or any of our policies.
        </p>

        <h4>Changes to This Agreement</h4>
        <p>
          We may update this User Agreement periodically. The most current
          version will be available on our website.
        </p>

        <h4>5. Contact Us</h4>
        <p>
          For any questions or concerns, contact us at:
          contactKampusabode@gmail.com.
        </p>
      </div>
    </section>
  );
};

export default UserAgreement;
