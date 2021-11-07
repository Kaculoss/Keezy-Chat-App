// Import the functions you need from the SDKs you need
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "@firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";

// Link on the docs of how i signed in with google
// https://firebase.google.com/docs/auth/web/google-signin

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqPd9wBVYPjKYC4QOXEVUHx72LCX7aMXE",
  authDomain: "keezy-chat-app.firebaseapp.com",
  projectId: "keezy-chat-app",
  storageBucket: "keezy-chat-app.appspot.com",
  messagingSenderId: "148096291324",
  appId: "1:148096291324:web:b1ef7a736dbd3e770ea279",
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

export function googleSignIn() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function logout() {
  return signOut(auth);
}

//my custom react hooks
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
}

export function useFirestore() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "messages");
    const orderStatement = orderBy("timestamp", "asc");
    const q = query(collectionRef, orderStatement);

    const unsub = onSnapshot(q, (snapshot) => {
      const msg = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setMessages(msg);
    });

    return unsub;
  }, []);

  return messages;
}

export async function addMessage(message, userID, userPic) {
  if (message) {
    const collectionRef = collection(db, "messages");
    const payload = {
      text: message,
      timestamp: serverTimestamp(),
      uid: userID,
      photoURL: userPic,
    };
    await addDoc(collectionRef, payload);
  }
}
