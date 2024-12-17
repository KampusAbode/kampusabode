"use client"

import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebaseConfig";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/stateSlice/userSlice";

const UseIsUser = () => {
  const [userLogged, loading, error] = useAuthState(auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userLogged) {
      // Update user state when logged in
      dispatch(
        setUser({
          id: userLogged.uid,
          username: userLogged.displayName || "",
          email: userLogged.email || "",
          userType: "student", // Add logic to fetch userType from Firestore if needed
          isAuthenticated: true,
        })
      );
    } else {
      // Reset user state when logged out
      dispatch(
        setUser({
          id: "",
          username: "",
          email: "",
          userType: "",
          isAuthenticated: false,
        })
      );
    }
  }, [userLogged, dispatch]);

  return { user: userLogged, loading, error };
};

export default UseIsUser;
