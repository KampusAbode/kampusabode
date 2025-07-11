// store/trendStore.ts

import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { TrendType } from "../fetch/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "../lib/firebaseConfig";

interface trendState {
  trends: TrendType[];
  setTrends: (data: TrendType[]) => void;
  updateTrend: (date: TrendType) => void;
  getTrendById: (id: string) => TrendType;
  getTrendBySlug: (slug: string) => TrendType;
}

export const useTrendStore = create<trendState>()(
  persist(
    (set, get) => ({
      trends: [],
      setTrends: async (trendData) => {
        if (!trendData || trendData.length === 0) {
          set({ trends: [] });
          return;
        } else {
          try {
            const trendsRef = query(
              collection(db, "trends"),
              orderBy("published_date", "desc")
            );
            const snapshot = await getDocs(trendsRef);

            const trends: TrendType[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as TrendType[];

            set({ trends });
          } catch (error) {
            console.error("Error fetching agents:", error);
          }
        }
      },
      updateTrend: (data) => {
        // Update the Firestore user document with the new/updated user data
        const userRef = doc(db, "trends", data.id);
        if (userRef) {
          setDoc(userRef, data, { merge: true });
        }
      },
      getTrendById: (id: string) => {
        const { trends } = get();
        return trends.find((trend) => trend.id === id);
      },
      getTrendBySlug: (slug: string) => {
        const { trends } = get();
        return trends.find((trend) => trend.slug === slug);
      },
    }),
    {
      name: "trendstore",
    }
  )
);
