"use client";

import "./quickservice.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PiChats } from "react-icons/pi";
import { FaPlus, FaHeadset } from "react-icons/fa";
import { BsChatRightText } from "react-icons/bs";
import { useUserStore } from "../../store/userStore";

const QuickService = () => {
  const pathname = usePathname();
  const { user } = useUserStore((state) => state);

  if (!user) return null;

  let config;

  if (pathname === "/apartment") {
    config = {
      icon: user.userType === "agent" ? FaPlus : PiChats,
      link:
        user.userType === "agent"
          ? `/apartment/c/${user?.id}`
          : `/chat/${user.id}/${user.name}`,
    };
  } else if (/^\/apartment\/[^/]+$/.test(pathname)) {
    config = {
      icon: FaHeadset,
      link: `/chat/${user.id}/${user.name}`,
    };
  } else if (pathname === "/messages") {
    config = {
      icon: BsChatRightText,
      link: `/chat/${user.id}/${user.name}`,
    };
  }

  if (!config) return null;

  const { icon: Icon, link } = config;

  return (
    <Link href={link} className="quick-service">
      <Icon />
    </Link>
  );
};

export default QuickService;
