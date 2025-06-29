'use client';

import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import Nav from "./components/navMenu/nav";
import QuickService from "./components/quickservice/QuickService";
import { useUserStore } from "./store/userStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { saveScroll, getScroll } from "./lib/scrollManager";
import Loader from "./components/loader/Loader";
import { useAuthListener } from "./hooks/useAuthListener";
import { pageview, GA_MEASUREMENT_ID } from './lib/ga';
import Script from 'next/script'; // ✅ Import this

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

  useEffect(() => {
    requestAnimationFrame(() => {
      const savedScroll = getScroll(pathname);
      if (savedScroll !== undefined) {
        window.scrollTo(0, savedScroll);
      }
    });
  }, [pathname]);

  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  if (initializing) return <Loader />;

  return (
    <div className="wrapper">
      {/* ✅ Insert Scripts once */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-LTGR69WRJB"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LTGR69WRJB');
        `}
      </Script>

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
