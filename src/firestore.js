import { db, auth } from "./firebase";
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  orderBy 
} from "firebase/firestore";

// Log Save karne ke liye
export const saveLog = async (category, data) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocRef = doc(db, "users", user.uid);
    const categoryRef = collection(userDocRef, category);

    await addDoc(categoryRef, {
      ...data,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Save error:", error);
    return false;
  }
};

// Logs Get karne ke liye
export const getLogs = async (category) => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const userDocRef = doc(db, "users", user.uid);
    const categoryRef = collection(userDocRef, category);
    
    const q = query(categoryRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Get error:", error);
    return [];
  }
};

// --- FIX FOR YOUR ERRORS ---
// Hum purane naamo ko naye functions se map kar dete hain
export const saveData = saveLog;
export const getData = getLogs;