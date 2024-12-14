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
  // const userData = useSelector((state: RootState) => state.userdata);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const secretKey = process.env.NEXT_PUBLIC__SECRET_KEY;
    if (!secretKey) {
      console.error("Missing encryption key");
      return;
    }

    const encryptedUserData = localStorage.getItem("AIzaSyDsz5edn22pVbHW");

    if (encryptedUserData) {
      try {
        const decryptedUserData = CryptoJS.AES.decrypt(
          encryptedUserData,
          secretKey
        ).toString(CryptoJS.enc.Utf8);

        const userData = JSON.parse(decryptedUserData);
        if (userData) {
          dispatch(setUser(userData.userAuth));
          dispatch(setUserData(userData.userFromDB));
        }
      } catch (error) {
        console.error("Failed to decrypt or parse user data", error);
      }
    } else {
      dispatch(
        setUser({
          id: "",
          username: "",
          email: "",
          userType: "",
          isAuthenticated: false,
        })
      );
      dispatch(
        setUserData({
          id: "",
          name: "",
          email: "",
          userType: "",
          userInfo: {
            bio: "",
            avatar: "",
            university: "",
            department: "",
            yearOfStudy: 0,
            savedProperties: [],
            wishlist: [],
            phoneNumber: "",
          },
        })
      );
    }
    setIsInitialized(true);
  }, []);

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

  if (!isInitialized) {
    return null;
  }

  return children;
};

export default UseIsUser;
