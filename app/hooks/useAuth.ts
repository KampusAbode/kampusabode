// authService.ts
export const getAuthState = async (): Promise<{ isAuthenticated: boolean }> => {
  try {
    if (typeof window === "undefined") {
      return { isAuthenticated: false }; // Safe check for SSR environments (when window is not available).
    }

    const storageKey = process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY;
    if (!storageKey) {
      console.warn("Storage key is not defined in environment variables.");
      return { isAuthenticated: false };
    }

    const sessionDataStr = sessionStorage.getItem(storageKey);
    if (!sessionDataStr) return { isAuthenticated: false };

    const { expiry } = JSON.parse(sessionDataStr);
    if (Date.now() > expiry) {
      // If session expired, remove it from sessionStorage
      sessionStorage.removeItem(storageKey);
      return { isAuthenticated: false };
    }

    return { isAuthenticated: true }; // Session is still valid
  } catch (error) {
    console.error("Error accessing authentication state:", error);
    return { isAuthenticated: false }; // In case of error, consider the user not authenticated.
  }
};
