"use client";

import "./quickservice.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Headset,
  MessageCircle,
  MessageSquareText,
  Pencil,
  Plus,
} from "lucide-react";
import { useUserStore } from "../../store/userStore";
import { checkIsAdmin, checkIsWriter } from "../../utils";
import { useEffect, useState } from "react";

const QuickService = () => {
  const pathname = usePathname();
  const { user } = useUserStore((state) => state);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWriter, setIsWriter] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setIsAdmin(false);
      setIsWriter(false);
      return;
    }

    async function checkUserPermissions(userId: string) {
      try {
        const [admin, writer] = await Promise.all([
          checkIsAdmin(userId),
          checkIsWriter(userId),
        ]);
        setIsAdmin(admin);
        setIsWriter(admin || writer);
      } catch (error) {
        console.error("Failed to check user permissions:", error);
      }
    }

    checkUserPermissions(user.id);
  }, [user?.id]);

  if (!user) return null;

  interface QuickServiceConfig {
    icon: React.ElementType;
    link: string;
    label: string;
  }

  let config: QuickServiceConfig | undefined;

  if (pathname === "/apartment") {
    config = {
      icon: user.userType === "agent" ? Plus : MessageCircle,
      link:
        user.userType === "agent"
          ? `/apartment/c/${user?.id}`
          : `/chat/${user.id}/${user.name}`,
      label: user.userType === "agent" ? "Create a listing" : "Chat with support",
    };
  } else if (/^\/apartment\/[^/]+$/.test(pathname)) {
    config = {
      icon: Headset,
      link: `/chat/${user.id}/${user.name}`,
      label: "Contact an agent",
    };
  } else if (pathname === "/messages") {
    config = {
      icon: MessageSquareText,
      link: `/chat/${user.id}/${user.name}`,
      label: "Open chat",
    };
  } else if (pathname === "/trends" && (isAdmin || isWriter)) {
    config = {
      icon: Plus,
      link: "/trends/upload",
      label: "Create a trend",
    };
  } else if (pathname.match(/^\/trends\/([^/]+)$/) && isWriter) {
    const trendId = pathname.match(/^\/trends\/([^/]+)$/)[1];
    config = {
      icon: Pencil,
      link: `/trends/edit/${trendId}`,
      label: "Edit this trend",
    };
  }

  if (!config) return null;

  const { icon: Icon, link, label } = config;

  return (
    <Link prefetch href={link} className="quick-service" title={label} aria-label={label}>
      <Icon aria-hidden="true" size={21} strokeWidth={1.75} />
    </Link>
  );
};

export default QuickService;
