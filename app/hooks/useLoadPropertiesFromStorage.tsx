
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
import {
  setProperties,
  setSearchQuery,
  setActiveLocation,
  setLoading,
  filterProperties,
} from "../redux/stateSlice/propertySlice";

const secretKey = process.env.NEXT_PUBLIC__ENCSECRET_KEY!;

const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const useLoadPropertiesFromStorage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const props = localStorage.getItem("properties");
        const filtered = localStorage.getItem("filteredProperties");
        const search = localStorage.getItem("searchQuery");
        const location = localStorage.getItem("activeLocation");
        const loading = localStorage.getItem("isLoading");

        if (props) dispatch(setProperties(decryptData(props)));
        if (filtered) dispatch(setProperties(decryptData(filtered)));
        if (search) dispatch(setSearchQuery(decryptData(search)));
        if (location) dispatch(setActiveLocation(decryptData(location)));
        if (loading) dispatch(setLoading(decryptData(loading)));

        dispatch(filterProperties());
      } catch (err) {
        console.error("Failed to load from localStorage:", err);
      }
    }
  }, [dispatch]);
};
