"use client";

import { Toaster } from "react-hot-toast";
import Header from "./components/header/Header";
import WelcomeMessage from "./components/welcome/WelcomeMessage";
import Navigation from "./components/navigation/Navigation";
import { getAuthState } from "./utils";
import { ReduxProvider } from "./redux/provider";
import UseIsUser from "./hooks/useIsUser";
import Nav from "./components/navMenu/nav";
import { useState, useEffect } from "react";
import Loader from "./components/loader/Loader";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getAuthState()
      .then((state) => {
        if (isMounted) {
          setAuthState(state);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching auth state:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ReduxProvider>
      <Toaster />
      <WelcomeMessage />
      <div className={`body ${authState.isAuthenticated ? "grid" : ""}`}>
        <UseIsUser>
          <Nav />
          <main>
            <Header />
            {children}
          </main>
          <Navigation />
        </UseIsUser>
      </div>
    </ReduxProvider>
  );
}
