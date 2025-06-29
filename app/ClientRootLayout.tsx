"use client";

import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import Nav from "./components/navMenu/nav";
import QuickService from "./components/quickservice/QuickService";
import { useUserStore } from "./store/userStore";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { saveScroll, getScroll } from "./scrollManager";
import Loader from "./components/loader/Loader";
import { useAuthListener } from "./hooks/useAuthListener";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();
  const { initializing } = useAuthListener();
  const pathname = usePathname();

  // Save scroll on route change or unload
  useEffect(() => {
    const handleSaveScroll = () => {
      saveScroll(pathname);
    };

    window.addEventListener("beforeunload", handleSaveScroll);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleSaveScroll();
      }
    });

    return () => {
      handleSaveScroll();
      window.removeEventListener("beforeunload", handleSaveScroll);
    };
  }, [pathname]);

  // Restore scroll on route load
  useEffect(() => {
    requestAnimationFrame(() => {
      const savedScroll = getScroll(pathname);
      if (savedScroll !== undefined) {
        window.scrollTo(0, savedScroll);
      }
    });
  }, [pathname]);

  if (initializing) return <Loader />;

  return (
    <div className="wrapper">
      <Nav />
      <main>
        <Header />
        {children}
        <QuickService />
      </main>
      <Navigation />
    </div>
  );
}
