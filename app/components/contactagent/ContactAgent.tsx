'use client'

const ContactAgent = ({ name, content, href }) => {
  const handleContactClick = () => {
    const confirmLeaving = confirm(
      `You are about to leave the web app to chat with ${name} on Whatsapp. Do you want to proceed?`
    );

    if (confirmLeaving) {
      // Redirect to WhatsApp chat
      const whatsappLink = href;
      window.location.href = whatsappLink;
    
    }
  };

  return (
    <span className="contact-seller-btn" onClick={handleContactClick}>
      {content}
    </span>
  );
};

export default ContactAgent;
