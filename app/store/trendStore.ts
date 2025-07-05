// store/trendStore.ts

import { TrendType } from "../fetch/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface trendState {
  trend: TrendType[];
  filteredTrend: TrendType[];
  isLoading: boolean;
  searchQuery: string;
  trendCategory: string;
  settrend: (trend: TrendType[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setTrendCategory: (category: string) => void;
  filtertrend: () => void;
  getTrendById: (id: string) => TrendType;
}

export const usetrendStore = create<trendState>()(
  persist(
    (set, get) => ({
      trend: [],
      filteredTrend: [],
      isLoading: false,
      searchQuery: "",
      trendCategory: "all",

      settrend: (trend) => set({ trend }),

      setLoading: (loading) => set({ isLoading: loading }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setTrendCategory: (category) => set({ trendCategory: category }),

      filtertrend: () => {
        const { trend, searchQuery, trendCategory } = get();
        const query = searchQuery.trim().toLowerCase();
        const queryWords = query.split(/\s+/);
        const filtered = trend.filter((trend) => {
          const titleWords = trend.title.toLowerCase().split(/\s+/);
          const matches =
            queryWords.filter((word) => titleWords.includes(word)).length >=
              2 ||
            trend.category.toLowerCase().includes(query) ||
            trend.title.toLowerCase().includes(query) ||
            trend.content.toLowerCase().includes(query);
          const categoryMatch =
            trendCategory === "all" || trend.category === trendCategory;
          return matches && categoryMatch;
        });
        set({ filteredTrend: filtered });
      },

      getTrendById: (id: string) => {
        const { trend } = get();
        return trend.find((trend) => trend.id === id);
      },
    }),
    {
      name: "trendstore",
    }
  )
);
