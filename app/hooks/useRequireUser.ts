
"use client";

import { useAuthListener } from "./useAuthListener";
import { useUserStore } from "../store/userStore";

export const useRequireUser = () => {
  const { initializing } = useAuthListener();
  const user = useUserStore((state) => state.user);

  const checking = initializing;
  const authenticated = !initializing && user != null;

  return { authenticated, checking };
};
