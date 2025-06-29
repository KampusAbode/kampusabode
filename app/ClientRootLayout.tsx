"use client";

import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import Nav from "./components/navMenu/nav";
import QuickService from "./components/quickservice/QuickService";
import { useUserStore } from "./store/userStore";
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { saveScroll, getScroll } from './scrollManager';
import Loader from "./components/loader/Loader";
import { useAuthListener } from "./hooks/useAuthListener";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    
  );
}


function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();
  const { initializing } = useAuthListener();

  if (initializing) {
    return <Loader />;
  }


  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let shouldRestore = false;

    const handleBeforeUnload = () => {
      saveScroll(pathname);
    };

    const handlePopState = () => {
      shouldRestore = true;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      saveScroll(pathname);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pathname]);

  useEffect(() => {
    // Defer scroll restoration
    requestAnimationFrame(() => {
      const savedScroll = getScroll(pathname);
      if (savedScroll !== undefined) {
        window.scrollTo(0, savedScroll);
      }
    });
  }, [pathname]);

  return (
    <div className={`wrapper `}>
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
