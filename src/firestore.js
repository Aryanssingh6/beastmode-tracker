import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const saveData = async (userId, key, data) => {
  if (!userId) return;
  try {
    await setDoc(doc(db, 'users', userId, key, 'data'), { items: data });
  } catch (err) {
    console.error('Save error:', err);
  }
};

export const getData = async (userId, key) => {
  if (!userId) return [];
  try {
    const docSnap = await getDoc(doc(db, 'users', userId, key, 'data'));
    if (docSnap.exists()) {
      return docSnap.data().items || [];
    }
    return [];
  } catch (err) {
    console.error('Get error:', err);
    return [];
  }
};

export const saveValue = async (userId, key, value) => {
  if (!userId) return;
  try {
    await setDoc(doc(db, 'users', userId, 'settings', key), { value });
  } catch (err) {
    console.error('Save value error:', err);
  }
};

export const getValue = async (userId, key) => {
  if (!userId) return null;
  try {
    const docSnap = await getDoc(doc(db, 'users', userId, 'settings', key));
    if (docSnap.exists()) return docSnap.data().value;
    return null;
  } catch (err) {
    console.error('Get value error:', err);
    return null;
  }
};