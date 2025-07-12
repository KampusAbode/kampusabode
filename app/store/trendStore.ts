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
      setTrends: async (trends) => {
        set({ trends });
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
