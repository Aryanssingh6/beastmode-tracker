import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYLR1dWDQhYxsw-uXN5_IW-4qMJXXfa2A",
  authDomain: "beastmode-tracker1.firebaseapp.com",
  projectId: "beastmode-tracker1",
  storageBucket: "beastmode-tracker1.firebasestorage.app",
  messagingSenderId: "920015372720",
  appId: "1:920015372720:web:618a6b11dbc67cd09ad675"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);