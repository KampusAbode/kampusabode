import { create } from "zustand";

// 1. Define the type for the store
interface NavStore {
  isNavOpen: boolean;
  toggleNav: () => void;
}

// 2. Create the store with type
const useNavStore = create<NavStore>((set) => ({
  isNavOpen: false,
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })),
}));

export default useNavStore;
