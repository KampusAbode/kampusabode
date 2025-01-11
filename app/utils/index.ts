import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from "../lib/firebaseConfig";

export * from "./auth";
export * from './messages';
export * from "./martketplace";
export * from "./properties";
export * from "./user";
export * from "./reviews";
export * from "./trends";



//ACTIONS

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString();
  }
};


interface UpdateLikesInput {
  id: string;
  action: 'like' | 'unlike';
}

export const updateLikes = async ({ id, action }: UpdateLikesInput) => {
  if (!id || !action) {
    throw new Error('Missing id or action');
  }

  const trendRef = doc(db, 'trends', id);

  try {
    if (action === 'like') {
      await updateDoc(trendRef, {
        likes: increment(1),
      });
    } else if (action === 'unlike') {
      await updateDoc(trendRef, {
        likes: increment(-1),
      });
    } else {
      throw new Error('Invalid action');
    }

    return { message: 'Success' };
  } catch (error) {
    console.error('Error updating likes: ', error);
    throw new Error('Internal server error');
  }
};