'use client'
import { Button } from "../button/Button";
import { confirm } from "@/app/lib/notifications/notify";

const ContactAgent = ({ name, content, href }) => {
  const handleContactClick = async () => {
    const confirmLeaving = await confirm({
      title: "Continue to WhatsApp?",
      description: `You are about to leave the web app to chat with ${name} on WhatsApp.`,
      confirmLabel: "Continue",
    });

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
