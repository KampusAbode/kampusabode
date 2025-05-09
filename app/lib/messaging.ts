'use client'

import { app } from "./firebaseConfig";
import { getMessaging, getToken } from "firebase/messaging";

export const generateToken = async (): Promise<string|null> => {
  if (typeof window === "undefined") return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return null;
    }

    const messaging = getMessaging(app);
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      serviceWorkerRegistration: registration,
    });

    console.log("Token generated:", token);
    return token;
  } catch (err) {
    console.error("Error generating token:", err);
    return null;
  }
};


export const messaging = getMessaging(app);