"use client";

import { useEffect, useState, ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/stateSlice/userSlice";
import { setUserData } from "../redux/stateSlice/userdataSlice";
import { usePathname, useRouter } from "next/navigation";
import Loader from "../components/loader/Loader";
import { RootState } from "../redux/store";
import toast from "react-hot-toast";
import CryptoJS from "crypto-js";

interface UseIsUserProps {
  children: ReactNode;
}

const UseIsUser = ({ children }: UseIsUserProps) => {
  const [userLogged] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const dispatch = useDispatch();

  // Helper: Fetch and decrypt user data from localStorage
  const getStoredUserData = () => {
    const data = localStorage.getItem(process.env.NEXT_PUBLIC__STORAGE_KEY!);
    if (!data) return null;

    try {
      const decryptedData = CryptoJS.AES.decrypt(
        data,
        process.env.NEXT_PUBLIC__SECRET_KEY!
      ).toString(CryptoJS.enc.Utf8);

      console.log(JSON.parse(decryptedData));
      return JSON.parse(decryptedData);
    } catch (err) {
      console.error("Error decrypting user data:", err);
      return null;
    }
  };

  // Helper: Encrypt and store user data in localStorage
  const storeUserData = (data: any) => {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      process.env.NEXT_PUBLIC__SECRET_KEY!
    ).toString();
    localStorage.setItem(process.env.NEXT_PUBLIC__STORAGE_KEY!, encryptedData);
  };

  // Helper: Dispatch user data to Redux store
  const updateReduxState = (userId: string, userData: any) => {
    dispatch(
      setUser({
        id: userId,
        username: userData.name,
        email: userData.email,
        userType: userData.userType,
        isAuthenticated: true,
      })
    );
    dispatch(
      setUserData({
        id: userId,
        name: userData.name,
        email: userData.email,
        userType: userData.userType,
        userInfo: userData.userInfo || {},
      })
    );
  };

  // Effect: Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userLogged) {
        setLoading(false);
        return <>{children}</>;
      }

      const storedData = getStoredUserData();

      if (storedData) {
        updateReduxState(userLogged.uid, storedData);
      } else {
        try {
          const userDocRef = doc(db, "users", userLogged.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            updateReduxState(userLogged.uid, userData);
            storeUserData(userData);
          } else {
            toast.error("No user document found in Firestore");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to fetch user data. Please try again.");
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, [userLogged, dispatch]);

  // Effect: Handle redirection based on auth state
  // useEffect(() => {
  //   if (loading) return;

  //   if (pathname === "/" && isAuthenticated) {
  //     router.push("/properties");
  //   } else if (pathname === "/auth/login" && !isAuthenticated) {
  //     router.push("/auth/login");
  //   }
  // }, [isAuthenticated, pathname, loading, router]);

  // Render loading or error states
  if (loading) return <Loader />;
  if (error)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          gap: "1rem",
        }}>
        <p>{error}</p>
        <button onClick={() => router.refresh()} className="btn">
          Reload
        </button>
      </div>
    );

  // Render children after auth logic is resolved
  return <>{children}</>;
};

export default UseIsUser;
