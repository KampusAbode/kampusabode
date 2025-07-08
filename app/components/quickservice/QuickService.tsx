"use client";

import "./quickservice.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PiChats } from "react-icons/pi";
import { FaPlus, FaHeadset } from "react-icons/fa";
import { BsChatRightText } from "react-icons/bs";
import { useUserStore } from "../../store/userStore";
import { checkIsAdmin, checkIsWriter } from "../../utils/user";
import { useEffect, useState } from "react";


const QuickService = () => {
  const pathname = usePathname();
  const { user } = useUserStore((state) => state);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWriter, setIsWriter] = useState(false);

  if (!user) return null;

  useEffect(() => {
    if (!user?.id) return;

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
  } else if  (pathname === "/trends" && (isAdmin || isWriter)){
    config = {
      icon: FaPlus,
      link: "/trends/upload",
    }
  }

  if (!config) return null;

  const { icon: Icon, link } = config;

  return (
    <Link href={link} className="quick-service" title="icon">
      <Icon />
    </Link>
  );
};

export default QuickService;
