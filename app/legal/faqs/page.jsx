import Link from "next/link";
import React from "react";
import "../legal.css";

function FAQs() {
  return (
    <section className="faqs">
      <div className="container">
        <h3>Frequently Asked Questions (FAQ)</h3>

        <h4>1. General Questions</h4>
        <div className="qa">
          <p>Q: What is Kampusabode?</p>
          <p>
            A: Kampusabode is a property listing platform specifically designed
            to help students find affordable and convenient accommodation near
            their campus. We connect students with trusted property agents and
            landlords who offer various rental options.
          </p>
        </div>

        <div className="qa">
          <p>Q: How do I create an account?</p>
          <p>
            A: Click the "Sign Up" button on the homepage, choose whether you
            are a student or agent, fill in your basic information, and follow
            the on-screen instructions to create your account.
          </p>
        </div>

        <div className="qa">
          <p>Q: Is Kampusabode free to use?</p>
          <p>
            A: Yes, students can browse properties, save listings, and contact
            agents for free. Some premium features for agents (such as boosting
            property visibility) may have associated fees.
          </p>
        </div>

        <h4>2. For Students</h4>
        <div className="qa">
          <p>Q: How do I search for properties near my university?</p>
          <p>
            A: Use the search bar on the homepage to enter your university’s
            name or city. You can filter results by property type, price range,
            and other preferences.
          </p>
        </div>
        <div className="qa">
          <p>Q: Can I save properties that I’m interested in?</p>
          <p>
            A: Yes! Simply click the "Save" button on any property listing to
            add it to your Saved Properties list. You can view your saved
            properties later by visiting your profile.
          </p>
        </div>
        <div className="qa">
          <p>Q: How do I contact a property agent?</p>
          <p>
            A: Once you find a property you like, click on the listing to view
            the agent's contact information. You can reach out to them via
            phone, email, or the in-app messaging feature.
          </p>
        </div>
        <div className="qa">
          <p>Q: What should I do if I have a problem with a listing?</p>
          <p>
            A: If a property listing seems misleading or contains false
            information, you can report it by clicking the "Report" button on
            the listing. Our support team will review the report and take
            appropriate action.
          </p>
        </div>

        <h4>3. For Agents</h4>
        <div className="qa">
          <p>Q: How do I list a property on Kampusabode?</p>
          <p>
            A: After creating an agent account, go to the "List a Property"
            section in your dashboard. Fill in the required details, including
            property title, description, price, and photos. Once submitted, your
            listing will go live for students to view.
          </p>
        </div>
        <div className="qa">
          <p>Q: Are there any fees for listing properties?</p>
          <p>
            A: Listing properties is free, but we offer premium options, such as
            boosting your property’s visibility or featuring it on the homepage,
            for an additional fee.
          </p>
        </div>
        <div className="qa">
          <p>Q: How do I manage my property listings?</p>
          <p>
            A: You can manage your properties by navigating to the "My
            Properties" section in your agent dashboard. From there, you can
            edit details, mark a property as rented, or remove listings that are
            no longer available.
          </p>
        </div>
        <div className="qa">
          <p>Q: Can I receive reviews from students?</p>
          <p>
            A: Yes! Students can leave reviews for agents based on their
            experience with your service and properties. You can view these
            reviews in your dashboard and respond if necessary.
          </p>
        </div>

        <h4>4. Account and Profile</h4>
        <div className="qa">
          <p>Q: How do I reset my password?</p>
          <p>
            A: If you’ve forgotten your password, click the "Forgot Password"
            link on the login page. Follow the instructions to receive a
            password reset link via email.
          </p>
        </div>
        <div className="qa">
          <p>Q: How do I update my profile information?</p>
          <p>
            A: Log in to your account, navigate to your profile settings, and
            update your information (e.g., name, email, university, phone
            number). Remember to save the changes once you’re done.
          </p>
        </div>
        <div className="qa">
          <p>Q: Can I delete my account?</p>
          <p>
            A: Yes. If you wish to delete your account, go to the account
            settings and select "Delete Account." Please note that this action
            is permanent, and you will lose all your saved properties and
            listings.
          </p>
        </div>

        <h4></h4>
        <div className="qa">
          <p>Q: How do I make payments for premium features?</p>
          <p>
            A: Agents can pay for premium services like property boosts directly
            from their dashboard using supported payment methods such as
            credit/debit cards or online payment platforms.
          </p>
        </div>
        <div className="qa">
          <p>Q: What happens if my payment fails?</p>
          <p>
            A: If a payment fails, double-check your payment details and try
            again. If the issue persists, please contact our support team for
            assistance.
          </p>
        </div>
        <div className="qa">
          <p>Q: Is there a refund policy?</p>
          <p>
            A: Refunds for premium services are available if certain conditions
            are met, such as technical issues that prevent the listing from
            being displayed. Please review our{" "}
            <Link href="/legal/refundpolicy">Refund Policy</Link> for more
            details.
          </p>
        </div>

        <h4>6. Safety and Trust</h4>
        <div className="qa">
          <p>Q: Are all the property listings verified?</p>
          <p>
            A: We do our best to verify property agents and landlords who list
            on Kampusabode. However, we recommend that students always visit a
            property in person and verify its details before making any
            payments.
          </p>
        </div>
        <div className="qa">
          <p>Q: How do I report a suspicious listing or agent?</p>
          <p>
            A: If you come across a listing or agent that seems suspicious or
            fraudulent, click the "Report" button on the listing or contact our
            support team directly. We take these reports seriously and will
            investigate promptly.
          </p>
        </div>

        <h4>7. Support and Contact</h4>
        <div className="qa">
          <p>Q: How do I contact Kampusabode support?</p>
          <p>
            A: You can contact our support team via email at
            contacKampusabode@gmail.com or by using the in-app chat feature
            available in your dashboard.
          </p>
        </div>
        <div className="qa">
          <p>Q: What should I do if I encounter a technical issue?</p>
          <p>
            A: If you face any technical issues while using the app, try
            refreshing the page or clearing your browser cache. If the problem
            persists, please contact our support team for assistance.
          </p>
        </div>

        <h4>8. Legal and Policies</h4>
        <div className="qa">
          <p>Q: Where can I find your Terms and Conditions?</p>
          <p>
            A: You can view our{" "}
            <Link href="/legal/termsandconditions">Terms and Conditions </Link>{" "}
            here. We encourage all users to read them carefully before using the
            platform.
          </p>
        </div>
        <div className="qa">
          <p>Q: How is my data protected?</p>
          <p>
            A: We take data privacy seriously. Please review our Privacy Policy
            to understand how we collect, use, and protect your information.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQs;
