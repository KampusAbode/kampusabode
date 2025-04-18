"use client";

import "./quickservice.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaHeadset } from "react-icons/fa";
import { BsChatRightText } from "react-icons/bs";
import { useMemo } from "react";
import { useUserStore } from "../../store/userStore";

const QuickService = () => {
  const pathname = usePathname();
  const { user } = useUserStore((state) => state);

  if (!user) return null;

  const quickServiceConfig = useMemo(
    () => [
      {
        match: (path: string) => path === "/properties",
        icon: user.userType === "agent" ? FaPlus : FaHeadset,
        getLink: () =>
          user.userType === "agent"
            ? "/properties/upload"
            : `/chat/${user.id}/${user.name}`,
      },
      {
        match: (path: string) => /^\/properties\/[^/]+$/.test(path),
        icon: FaHeadset,
        getLink: () => `/chat/${user.id}/${user.name}`,
      },
      {
        match: (path: string) => path === "/messages",
        icon: BsChatRightText,
        getLink: () => `/chat/${user.id}/${user.name}`,
      },
    ],
    [user]
  );

  const currentConfig = useMemo(() => {
    return quickServiceConfig.find((cfg) => cfg.match(pathname));
  }, [pathname, quickServiceConfig]);

  if (!currentConfig) return null;

  const Icon = currentConfig.icon;
  const link = currentConfig.getLink();

  return (
    <Link href={link} className="quick-service">
      <Icon />
    </Link>
  );
};

export default QuickService;
