import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "@firebase/auth";
import {
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  setDoc,
  collection,
  getFirestore,
  where,
  query,
  orderBy,
  serverTimestamp,
} from "@firebase/firestore";
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

initializeApp(firebaseConfig);

const auth = getAuth();
export const db = getFirestore();

// CUSTOM HOOKS
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
}

export function useFirestore(chatID) {
  const [messages, setMessages] = useState([]);

  const getParticipants = async () => {
    const docRef1 = doc(db, "chatrooms", chatID);
    const mySnapshot1 = await getDoc(docRef1);
    if (mySnapshot1.exists()) {
      const { participantIDs } = mySnapshot1.data();
      return participantIDs;
    } else {
      return [];
    }
  };

  useEffect(() => {
    const parts = getParticipants().then((participantIDs) => {
      const collectionRef = collection(db, `chatrooms/${chatID}/messages`);
      const orderStatement = orderBy("timestamp", "asc");
      const q = query(collectionRef, orderStatement);

      const unsub = onSnapshot(q, (snapshot) => {
        const msg = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          participantIDs,
        }));
        return setMessages(msg);
      });
      return unsub;
    });

    return parts;
  }, []);

  return messages;
}

export function googleSignIn() {
  const provider = new GoogleAuthProvider();
  console.log("logging...");
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log("credential ==>");
      console.log(credential);

      const token = credential.accessToken;
      console.log("Token ==>");
      console.log(token);

      const user = result.user;
      console.log("User ==>");
      console.log(user);

      return user;
    })
    .then((user) => {
      addNewUser(user.uid, user.displayName, user.photoURL);
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log("Error Code ==>", errorCode);

      const errorMessage = error.message;
      console.log("Error Message ==>", errorMessage);

      const email = error.email;
      console.log("email used ==>", email);

      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log("Credential ==>", credential);
    });
}

export function logout() {
  return signOut(auth);
}

export const addNewUser = async (uid, name, photoURL) => {
  getDocs(collection(db, "users"))
    .then((querySnapshot) => {
      const existing_users = [];
      querySnapshot.forEach((doc) => existing_users.push(doc.id));
      return existing_users;
    })
    .then((existing_users) => {
      if (!existing_users.includes(uid)) {
        let splitName;
        if (name.includes(" ")) {
          splitName = name.toLowerCase().split(" ");
        } else {
          splitName = name.toLowerCase().split();
        }
        const docRef = doc(db, "users", uid);
        const payload = {
          name_array: splitName,
          id: uid,
          name,
          photoURL,
          friends: [],
          spaces: [],
          reqSent: [],
          reqRec: [],
        };
        setDoc(docRef, payload);
      }
    });
};

export const searchUsers = async (searchedName, currentUserUid) => {
  const collectionRef = collection(db, "users");
  const queryStatement1 = where(
    "name_array",
    "array-contains",
    searchedName.toLowerCase()
  );
  const queryStatement2 = where("id", "!=", currentUserUid);
  const q = query(collectionRef, queryStatement1, queryStatement2);

  return getDocs(q).then((snapshot) => {
    const results = snapshot.docs.map((doc) => doc.data());
    return results;
  });
};

export const getFriends = async (array_of_friend_IDs) => {
  const collectionRef = collection(db, "users");
  const queryStatement = where("id", "in", array_of_friend_IDs);
  const q = query(collectionRef, queryStatement);

  const docs = getDocs(q).then((snapshot) => {
    return snapshot.docs.map((doc) => doc.data());
  });
  return docs;
};

export const sendFriendReq = async (sender, receiver) => {
  const newReqSent = [...sender.reqSent, receiver.id];
  const senderDocRef = doc(db, "users", sender.id);
  const senderPayload = { reqSent: newReqSent };
  await updateDoc(senderDocRef, senderPayload);

  const newReqRec = [...receiver.reqRec, sender.id];
  const receiverDocRef = doc(db, "users", receiver.id);
  const receiverPayload = { reqRec: newReqRec };
  await updateDoc(receiverDocRef, receiverPayload);
};

export const acceptFriendReq = async (sender, receiver) => {
  // writing to the chatrooms collection
  const collectionRef = collection(db, "chatrooms");
  const payload = {
    id: "",
    participantIDs: [sender.id, receiver.id],
    chatCategory: "friendly",
  };
  const docRef = await addDoc(collectionRef, payload);

  //create a new collection inside the document
  const msgCollectionRef = collection(db, `chatrooms/${docRef.id}/messages`);
  const msgPayload = {
    uid: "developer",
    text: "chatroom was created successfully",
    timestamp: serverTimestamp(),
  };
  await addDoc(msgCollectionRef, msgPayload);

  // update the sender's reqSent, and friend list
  const newReqSent = sender.reqSent.filter((id) => id !== receiver.id);
  const newSenderFriends = [
    ...sender.friends,
    { friendID: receiver.id, chatID: docRef.id },
  ];
  const senderDocRef = doc(db, "users", sender.id);
  const senderPayload = { friends: newSenderFriends, reqSent: newReqSent };
  await updateDoc(senderDocRef, senderPayload);

  // update the receiver's reqRec and friend list
  const newReqRec = receiver.reqRec.filter((id) => id !== sender.id);
  const newReceiverFriends = [
    ...receiver.friends,
    { friendID: sender.id, chatID: docRef.id },
  ];
  const receiverDocRef = doc(db, "users", receiver.id);
  const receiverPayload = { friends: newReceiverFriends, reqRec: newReqRec };
  await updateDoc(receiverDocRef, receiverPayload);

  console.log("Friend Accepted");
};

export const rejectFriendReq = async (sender, receiver) => {
  const newReqSent = sender.reqSent.filter((id) => id !== receiver.id);
  const senderDocRef = doc(db, "users", sender.id);
  const senderPayload = { reqSent: newReqSent };
  await updateDoc(senderDocRef, senderPayload);

  const newReqRec = receiver.reqRec.filter((id) => id !== sender.id);
  const receiverDocRef = doc(db, "users", receiver.id);
  const receiverPayload = { reqRec: newReqRec };
  await updateDoc(receiverDocRef, receiverPayload);
};

export const getFriendChatName = async (chatID, currentUserID) => {
  const docRef1 = doc(db, "chatrooms", chatID);
  const mySnapshot1 = await getDoc(docRef1);
  if (mySnapshot1.exists()) {
    const { participantIDs } = mySnapshot1.data();
    const friendID = participantIDs.filter((id) => id !== currentUserID)[0];

    const docRef2 = doc(db, "users", friendID);
    const mySnapshot2 = await getDoc(docRef2);
    if (mySnapshot2.exists()) {
      const { name } = mySnapshot2.data();
      return name;
    }
  }
};

export const sendMessage = async (chatID, text, uid, photoURL) => {
  if (text) {
    const collectionRef = collection(db, `chatrooms/${chatID}/messages`);
    const payload = { text, uid, photoURL, timestamp: serverTimestamp() };
    await addDoc(collectionRef, payload);
  }
};

export const mergeFriend = (arr1, arr2) => {
  const newFriendList = arr1.map((obj1) => {
    const friend = arr2.filter((obj2) => obj2.id === obj1.friendID)[0];
    return { ...friend, chatID: obj1.chatID };
  });
  return newFriendList;
};
