import { create } from "zustand";

const useNavStore = create((set) => ({
  isNavOpen: false, // initial state of the nav (closed)
  toggleNav: () => set((state) => ({ isNavOpen: !state.isNavOpen })), // toggles the nav state
}));

export default useNavStore;
