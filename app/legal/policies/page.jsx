import React from "react";
import "../legal.css";

const Policies = () => {
  return (
    <section className="policies">
      <div className="container">
        {/* Privacy Policy */}
        <div className="privacy-policy" id="privacypolicy">
          <h3>Privacy Policy</h3>
          <p>Last Updated: 01-22-2024</p>

          <h4>1. Information We Collect</h4>
          <p>
            We collect information you provide directly to us when creating an
            account, listing a property, interacting with users, or using the
            Kampus Abode platform. This includes:
          </p>
          <ul>
            <li>
              <strong>Account Information:</strong> Username, email, password,
              and user type (student or agent).
            </li>
            <li>
              <strong>Profile Information:</strong> School, program (for
              students), or agency name (for agents), plus any optional details
              you choose to share.
            </li>
            <li>
              <strong>Property Information:</strong> Listing details including
              location, rent, features, and images.
            </li>
            <li>
              <strong>Communication Data:</strong> Messages, feedback, and
              inquiries exchanged via the platform.
            </li>
            <li>
              <strong>Payment Information:</strong> If applicable, we may
              collect billing details for transactions made through the
              platform.
            </li>
            <li>
              <strong>Usage Data:</strong> Browsing behavior, pages viewed, and
              platform features used.
            </li>
          </ul>

          <h4>2. How We Use Your Information</h4>
          <ul>
            <li>
              <strong>Account Management:</strong> To create, authenticate, and
              manage user accounts.
            </li>
            <li>
              <strong>Listings:</strong> To allow agents to post accommodations
              and students to explore, save, and connect with agents.
            </li>
            <li>
              <strong>Personalization:</strong> To tailor your experience and
              recommend listings based on preferences.
            </li>
            <li>
              <strong>Communication:</strong> To send notifications, respond to
              inquiries, and facilitate user interactions.
            </li>
            <li>
              <strong>Security:</strong> To protect users from fraud and monitor
              suspicious activity.
            </li>
            <li>
              <strong>Analytics:</strong> To improve the platform’s performance,
              usability, and features.
            </li>
          </ul>

          <h4>3. How We Share Your Information</h4>
          <ul>
            <li>
              <strong>Service Providers:</strong> With trusted third parties
              such as hosting or payment vendors.
            </li>
            <li>
              <strong>Other Users:</strong> Public profile data and listings are
              visible to other users.
            </li>
            <li>
              <strong>Legal Requirements:</strong> To comply with laws, enforce
              agreements, or resolve disputes.
            </li>
            <li>
              <strong>Business Transfers:</strong> In case of acquisition,
              merger, or asset transfer, data may be shared with new
              stakeholders.
            </li>
          </ul>

          <h4>4. Data Security</h4>
          <p>
            We implement reasonable safeguards to protect your personal data.
            However, no system is completely secure. Please use strong passwords
            and keep your credentials confidential.
          </p>

          <h4>5. Your Rights & Choices</h4>
          <ul>
            <li>
              <strong>Update Information:</strong> You can update your profile
              through your account settings.
            </li>
            <li>
              <strong>Delete Account:</strong> You may request account deletion
              by contacting our support team.
            </li>
            <li>
              <strong>Email Preferences:</strong> You can unsubscribe from
              promotional emails using the link in any email.
            </li>
          </ul>

          <h4>6. Cookies and Tracking</h4>
          <p>
            We use cookies and similar tools to enhance your experience,
            remember preferences, analyze traffic, and serve relevant content.
            You can disable cookies via your browser, but this may affect
            certain features.
          </p>

          <h4>7. Children's Privacy</h4>
          <p>
            Kampus Abode is not intended for use by individuals under the age of
            16. If we learn we’ve collected data from a child, we’ll take
            immediate steps to delete it.
          </p>
        </div>

        {/* Cookie Policy */}
        <div className="cookie-policy" id="cookiepolicy">
          <h3>Cookie Policy</h3>
          <p>Last Updated: 01-22-2024</p>

          <h4>1. What Are Cookies?</h4>
          <p>
            Cookies are small files stored on your device to help websites
            remember user preferences, improve performance, and track usage.
          </p>

          <h4>2. Types of Cookies We Use</h4>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Required for core
              functionality like login and session management.
            </li>
            <li>
              <strong>Performance Cookies:</strong> Used to understand how users
              interact with the platform so we can improve it.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> May be used to serve
              tailored content or ads based on usage behavior.
            </li>
          </ul>

          <h4>3. Managing Cookies</h4>
          <p>
            You can manage or disable cookies through your browser settings.
            Please note that disabling some cookies may impact platform
            functionality.
          </p>
        </div>

        {/* Refund Policy */}
        <div className="refund-policy" id="refundpolicy">
          <h3>Refund Policy</h3>
          <p>Last Updated: 01-22-2024</p>

          <p>
            Kampus Abode aims to provide a seamless experience for students and
            agents. This policy outlines our current approach to refunds related
            to premium features.
          </p>

          <h4>1. Eligibility for Refunds</h4>
          <ul>
            <li>
              <strong>Technical Issues:</strong> If a technical problem prevents
              a premium service (like featured listings) from displaying
              properly, we will offer a refund or credit.
            </li>
            <li>
              <strong>Early Cancellation:</strong> If an unused premium feature
              is canceled within [X] days, you may be eligible for a full or
              partial refund.
            </li>
          </ul>

          <h4>2. Non-Refundable Items</h4>
          <ul>
            <li>Used premium services (e.g., active boosts or promotions).</li>
            <li>Voluntary account deletion or inactivity.</li>
          </ul>

          <h4>3. How to Request a Refund</h4>
          <p>
            To request a refund, email us at{" "}
            <a href="mailto:contactKampusabode@gmail.com">
              contactKampusabode@gmail.com
            </a>{" "}
            with your account details and a brief explanation. Refunds are
            typically processed within [X] business days upon approval.
          </p>
        </div>

        {/* Contact Section */}
        <div className="contact-policy">
          <h3>Contact Us</h3>
          <p>
            If you have any questions about these policies or how we handle your
            information, please contact us at:
          </p>
          <p>
            Email:{" "}
            <a href="mailto:contactKampusabode@gmail.com">
              contactKampusabode@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Policies;
