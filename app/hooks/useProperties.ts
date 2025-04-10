// hooks/useProperties.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export const useProperties = () => {
  const listProperty = async (data: any) => {
    const docRef = await addDoc(collection(db, "properties"), data);
    return docRef.id;
  };

  const getAllProperties = async () => {
    const q = query(collection(db, "properties"));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const getPropertyById = async (id: string) => {
    const docRef = doc(db, "properties", id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  };

  const getPropertiesByAgent = async (agentId: string) => {
    const q = query(
      collection(db, "properties"),
      where("listedBy", "==", agentId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  return {
    listProperty,
    getAllProperties,
    getPropertyById,
    getPropertiesByAgent,
  };
};
