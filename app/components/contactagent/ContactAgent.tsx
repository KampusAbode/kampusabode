'use client'
import { Button } from "../button/Button";

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
    <Button
      type="button"
      onClick={handleContactClick}
      aria-label={content}
    >
      {content}
    </Button>
  );
};

export default ContactAgent;
