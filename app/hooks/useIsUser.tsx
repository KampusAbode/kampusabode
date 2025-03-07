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
import { UserType } from "../fetch/types";

interface UseIsUserProps {
  children: ReactNode;
}

// 🔹 Helper: Fetch & decrypt user data
const getStoredUserData = (): UserType | null => {
  const data = localStorage.getItem(
    process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY!
  );
  if (!data) return null;

  try {
    const decryptedData = CryptoJS.AES.decrypt(
      data,
      process.env.NEXT_PUBLIC__ENCSECRET_KEY!
    ).toString(CryptoJS.enc.Utf8);

    return decryptedData ? JSON.parse(decryptedData) : null;
  } catch (err) {
    console.error("Decryption error:", err);
    return null;
  }
};

// 🔹 Helper: Encrypt & store user data
const storeUserData = (data: UserType) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC__ENCSECRET_KEY!
  ).toString();
  localStorage.setItem(
    process.env.NEXT_PUBLIC__USERDATA_STORAGE_KEY!,
    encryptedData
  );
};

// 🔹 Helper: Dispatch user data to Redux
const updateReduxState = (
  dispatch: any,
  userId: string,
  userData: UserType
) => {
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
      ...userData,
    })
  );
};

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

  // 🔹 Fetch user data & update Redux/local storage
  const fetchUserData = async () => {
    if (!userLogged) return setLoading(false);

    try {
      const userDoc = await getDoc(doc(db, "users", userLogged.uid));

      if (!userDoc.exists()) return toast.error("User not found in Firestore");

      const userData = userDoc.data() as UserType;
      updateReduxState(dispatch, userLogged.uid, userData);
      storeUserData(userData);
    } catch (err) {
      toast.error("Failed to fetch user data");
      setError(err instanceof Error ? err.message : "An error occurred.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [userLogged]);

  // 🔹 Redirect users based on authentication state
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && pathname === "/") {
        router.push("/properties");
      } 
    }
  }, [isAuthenticated, pathname, loading, router]);


  if (loading) return <Loader />;
  if (error)
    return (
      <div
        className="container"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: "1rem",
        }}>
        <p>{error}</p>
        <button onClick={() => router.refresh()} className="btn" style={{textAlign:"center", width: "fit-content"}}>
          Reload
        </button>
      </div>
    );

  return <>{children}</>;
};

export default UseIsUser;
