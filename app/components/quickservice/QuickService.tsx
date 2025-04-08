"use client";

import "./quickservice.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaHeadset } from "react-icons/fa";
import { BsChatRightText } from "react-icons/bs";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const QuickService = () => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.userdata);

  const quickServiceConfig = useMemo(
    () => [
      {
        match: (path: string) => path === "/properties",
        icon: FaPlus,
        getLink: () => "/properties/upload",
      },
      {
        match: (path: string) => /^\/properties\/[^/]+$/.test(path),
        icon: FaHeadset,
        getLink: () => {
          const userId = user?.id || "";
          const username = user?.name || "";
          return `/chat/${userId}/${username}`;
        },
      },
      {
        match: (path: string) => path === "/messages",
        icon: BsChatRightText,
        getLink: () => {
          const userId = user?.id || "";
          const username = user?.name || "";
          return `/chat/${userId}/${username}`;
        },
      },
    ],
    [user]
  );

  const currentConfig = useMemo(() => {
    return quickServiceConfig.find((cfg) => cfg.match(pathname));
  }, [pathname, quickServiceConfig]);

  if (!currentConfig && !user.id) return null;

  console.log(currentConfig);
  

  const Icon = currentConfig.icon;
  const link = currentConfig.getLink();

  return (
    <Link href={link} className="quick-service">
      <Icon />
    </Link>
  );
};

export default QuickService;
