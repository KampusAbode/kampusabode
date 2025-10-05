'use client';

import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import Nav from "./components/navMenu/nav";
import QuickService from "./components/quickservice/QuickService";
import { useUserStore } from "./store/userStore";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Loader from "./components/loader/Loader";
import { useAuthListener } from "./hooks/useAuthListener";
import { pageview } from './lib/ga';
import Script from 'next/script';
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

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
  const pageCache = useRef<Record<string, React.ReactNode>>({});

  // ✅ Scroll restoration now handled by custom hook
  useScrollRestoration();

  // ✅ Define which routes should be cached
  const isCacheableRoute = /^\/(apartment(\/.*)?|trends(\/.*)?)$/.test(pathname);

  // ✅ Cache only the allowed routes
  if (isCacheableRoute && !pageCache.current[pathname]) {
    pageCache.current[pathname] = children;
  }

  // ✅ Track GA page views
  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  if (initializing) return <Loader />;

  return (
    <>
      <Header />
      <div className={`wrapper ${user ? "grid" : ""}`}>
        {/* ✅ Google Analytics Scripts */}
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
          {/* ✅ Render cached page if available, otherwise render fresh */}
          {isCacheableRoute
            ? pageCache.current[pathname] || children
            : children}

          <QuickService />
        </main>
        <Navigation />
      </div>
    </>
  );
}
