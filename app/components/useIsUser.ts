"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/stateSlice/userSlice";
import { RootState } from "../redux/store";
import { useRouter, usePathname } from "next/navigation";
import { setUserData } from "../redux/stateSlice/userdataSlice";
import CryptoJS from "crypto-js";

const UseIsUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const encryptedUserData = localStorage.getItem("AIzaSyDsz5edn22pVbHW");

    if (encryptedUserData) {
      const decryptedUserData = CryptoJS.AES.decrypt(
        encryptedUserData,
        process.env.NEXT_PUBLIC__SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);

      const userData = JSON.parse(decryptedUserData);
      console.log(userData);

      if (userData) {
        dispatch(setUser(userData.userAuth));
        dispatch(setUserData(userData.userFromDB));
      }
      setIsInitialized(true);
    } else {
      dispatch(setUser(null));
      dispatch(setUserData(null));
      setIsInitialized(false);
    }

  }, [router]);

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      if (["/auth/login", "/auth/signup", "/"].includes(pathname)) {
        router.push("/properties");
      }
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  if (
    !isInitialized ||
    (isAuthenticated && ["/auth/login", "/auth/signup", "/"].includes(pathname))
  ) {
    return null;
  }

  return children;
};

export default UseIsUser;
