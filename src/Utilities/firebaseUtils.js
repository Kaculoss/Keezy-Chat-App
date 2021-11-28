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
  deleteDoc,
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

export const getCurrentUser = async (currentUserID) => {
  const docRef = doc(db, "users", currentUserID);
  const mySnapshot = await getDoc(docRef);
  if (mySnapshot.exists()) {
    const user = mySnapshot.data();
    return user;
  } else {
    return "";
  }
};

export const getChatProperties = async (chatID) => {
  const docRef = doc(db, "chatrooms", chatID);
  const mySnapshot = await getDoc(docRef);
  if (mySnapshot.exists()) {
    const { chatCategory, admin, participants } = mySnapshot.data();
    return { chatCategory, admin, participants };
  } else {
    return [];
  }
};

export function useFirestore(chatID) {
  const [messages, setMessages] = useState();

  useEffect(() => {
    const collectionRef = collection(db, `chatrooms/${chatID}/messages`);
    const orderStatement = orderBy("timestamp", "asc");
    const q = query(collectionRef, orderStatement);
    const unsub = onSnapshot(q, (snapshot) => {
      const msg = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(msg);
    });
    return unsub;
  }, [chatID]);

  return messages;
}

export function useParticipants(chatID) {
  const [participants, setParticipants] = useState();

  useEffect(() => {
    const docRef = doc(db, "chatrooms", chatID);
    const unsub = onSnapshot(docRef, (doc) => {
      const myData = doc.data();
      setParticipants(myData?.participants);
    });
    return unsub;
  }, [chatID]);

  return participants;
}

export function googleSignIn() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
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
          community: { name: "Community", chatID: "community" },
        };
        setDoc(docRef, payload);
      }
    })
    .then(() => {
      const spaceColRef = collection(db, "chatrooms");
      const queryStatement = where("chatCategory", "==", "community-chat");
      const q = query(spaceColRef, queryStatement);
      getDocs(q).then((snapshot) => {
        const community = snapshot.docs.map((doc) => doc.data());
        if (community[0]?.participants.length !== 0) {
          const participantIDs = community[0]?.participants.map(
            (participant) => participant.id
          );
          if (!participantIDs.includes(uid)) {
            const newParticipants = [
              ...community[0].participants,
              { name, id: uid },
            ];
            const docRef = doc(db, "chatrooms", "community");
            const payload = { participants: newParticipants };
            updateDoc(docRef, payload);
          }
        } else {
          const docRef = doc(db, "chatrooms", "community");
          const payload = { participants: [{ name, id: uid }] };
          updateDoc(docRef, payload);
        }
      });
    });
};

export const searchUsers = async (searchedName, currentUserID) => {
  const collectionRef = collection(db, "users");
  const queryStatement1 = where(
    "name_array",
    "array-contains",
    searchedName.toLowerCase()
  );
  const queryStatement2 = where("id", "!=", currentUserID);
  const q = query(collectionRef, queryStatement1, queryStatement2);

  return getDocs(q).then((snapshot) => {
    const results = snapshot.docs.map((doc) => doc.data());
    return results;
  });
};

export const getMyFriends = async (userID) => {
  const docRef = doc(db, "users", userID);
  const mySnapshot = await getDoc(docRef);
  if (mySnapshot.exists()) {
    const { friends } = mySnapshot.data();
    return friends;
  } else {
    return "couldn't get user friends";
  }
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
  const newReqSent = [
    ...sender.reqSent,
    { id: receiver.id, name: receiver.name },
  ];
  const senderDocRef = doc(db, "users", sender.id);
  const senderPayload = { reqSent: newReqSent };
  await updateDoc(senderDocRef, senderPayload);

  const newReqRec = [...receiver.reqRec, { id: sender.id, name: sender.name }];
  const receiverDocRef = doc(db, "users", receiver.id);
  const receiverPayload = { reqRec: newReqRec };
  await updateDoc(receiverDocRef, receiverPayload);
};

export const acceptFriendReq = async (sender, receiver) => {
  // writing to the chatrooms collection
  const collectionRef = collection(db, "chatrooms");
  const payload = {
    participants: [
      { id: sender.id, name: sender.name },
      { id: receiver.id, name: receiver.name },
    ],
    chatCategory: "friend-chat",
  };
  const docRef = await addDoc(collectionRef, payload);

  // update the sender's reqSent, and friend list
  const newReqSent = sender.reqSent.filter(
    (request) => request.id !== receiver.id
  );
  const newSenderFriends = [
    ...sender.friends,
    { friendID: receiver.id, chatID: docRef.id, name: receiver.name },
  ];
  const senderDocRef = doc(db, "users", sender.id);
  const senderPayload = { friends: newSenderFriends, reqSent: newReqSent };
  await updateDoc(senderDocRef, senderPayload);

  // update the receiver's reqRec and friend list
  const newReqRec = receiver.reqRec.filter(
    (request) => request.id !== sender.id
  );
  const newReceiverFriends = [
    ...receiver.friends,
    { friendID: sender.id, chatID: docRef.id, name: sender.name },
  ];
  const receiverDocRef = doc(db, "users", receiver.id);
  const receiverPayload = { friends: newReceiverFriends, reqRec: newReqRec };
  await updateDoc(receiverDocRef, receiverPayload);
};

export const rejectFriendReq = async (sender, receiver) => {
  const newReqSent = sender.reqSent.filter(
    (request) => request.id !== receiver.id
  );
  const senderDocRef = doc(db, "users", sender.id);
  const senderPayload = { reqSent: newReqSent };
  await updateDoc(senderDocRef, senderPayload);

  const newReqRec = receiver.reqRec.filter(
    (request) => request.id !== sender.id
  );
  const receiverDocRef = doc(db, "users", receiver.id);
  const receiverPayload = { reqRec: newReqRec };
  await updateDoc(receiverDocRef, receiverPayload);
};

export const getFriendChatName = async (chatID, currentUserID) => {
  const docRef = doc(db, "chatrooms", chatID);
  const mySnapshot = await getDoc(docRef);
  if (mySnapshot.exists()) {
    const { participants } = mySnapshot.data();
    const { name } = participants.find((friend) => friend.id !== currentUserID);
    return name;
  } else {
    return "couldn't load name";
  }
};

export const sendMessage = async (chatID, text, uid, photoURL) => {
  if (text) {
    const collectionRef = collection(db, `chatrooms/${chatID}/messages`);
    const payload = { text, uid, photoURL, timestamp: serverTimestamp() };
    await addDoc(collectionRef, payload);
  }
};

export const createSpace = async (currentUser, spaceName) => {
  // create a new cocument in chatroom
  const collectionRef = collection(db, "chatrooms");
  const payload = {
    participants: [{ id: currentUser.id, name: currentUser.name }],
    name: spaceName,
    admin: currentUser.id,
    chatCategory: "space-chat",
  };
  const docRef = await addDoc(collectionRef, payload);

  // update the user's document
  const newSpaces = [
    ...currentUser.spaces,
    { name: spaceName, chatID: docRef.id, isAdmin: true },
  ];
  const userDocRef = doc(db, "users", currentUser.id);
  const userPayload = { spaces: newSpaces };
  await updateDoc(userDocRef, userPayload);
};

export const getSpaceName = async (chatID) => {
  const docRef = doc(db, "chatrooms", chatID);
  const mySnapshot = await getDoc(docRef);
  if (mySnapshot.exists()) {
    const { name } = mySnapshot.data();
    return name;
  } else {
    return "couldn't load name";
  }
};

export const editSpaceName = async (chatID, new_name) => {
  if (new_name) {
    // updating the chatroom with the new name
    const docRef = doc(db, "chatrooms", chatID);
    const payload = { name: new_name };
    await updateDoc(docRef, payload);

    // grabing all the participants in that chatroom to update their space info
    const spaceDocRef = doc(db, "chatrooms", chatID);
    const mySnapshot = await getDoc(spaceDocRef);
    const { participants, admin } = mySnapshot.data();
    const participantIDs = participants.map((participant) => participant.id);

    // querying the users collection to get the doc of all the participants
    const collectionRef = collection(db, "users");
    const queryStatement = where("id", "in", participantIDs);
    const q = query(collectionRef, queryStatement);

    // updating all the participants spaces with the new name
    getDocs(q)
      .then((snapshot) => {
        const results = snapshot.docs.map((doc) => doc.data());
        return results;
      })
      .then((results) => {
        results.forEach((result) => {
          const oldSpaces = result.spaces.filter(
            (space) => space.chatID !== chatID
          );
          const adminSpaces = [
            ...oldSpaces,
            { name: new_name, chatID, isAdmin: true },
          ];
          const newSpaces = [
            ...oldSpaces,
            { name: new_name, chatID, isAdmin: false },
          ];
          const newDocRef = doc(db, "users", result.id);
          let newPayload;
          if (result.id === admin) {
            newPayload = { spaces: adminSpaces };
          } else {
            newPayload = { spaces: newSpaces };
          }
          updateDoc(newDocRef, newPayload);
        });
      })
      .catch((err) => console.log(err));
  }
};

export const addToSpace = async (chatID, participantsArr) => {
  // Update the space participant list
  const spaceDocRef = doc(db, "chatrooms", chatID);
  const mySnapshot = await getDoc(spaceDocRef);
  const { participants, name } = mySnapshot.data();
  const newParticipants = [...participants, ...participantsArr];
  const docRef = doc(db, "chatrooms", chatID);
  const payload = { participants: newParticipants };
  await updateDoc(docRef, payload);

  // Update the participants space info
  const participantIDs = participantsArr.map((participant) => participant.id);

  const collectionRef = collection(db, "users");
  const queryStatement = where("id", "in", participantIDs);
  const q = query(collectionRef, queryStatement);

  // updating all the participants spaces with the new name
  getDocs(q)
    .then((snapshot) => {
      const results = snapshot.docs.map((doc) => doc.data());
      return results;
    })
    .then((results) => {
      results.forEach((result) => {
        const newSpaces = [...result.spaces, { name, chatID, isAdmin: false }];
        const newDocRef = doc(db, "users", result.id);
        const newPayload = { spaces: newSpaces };
        updateDoc(newDocRef, newPayload);
      });
    })
    .catch((err) => console.log(err));
};

export const removeFromSpace = async (chatID, participantIDs) => {
  //Update the space participant list
  const spaceDocRef = doc(db, "chatrooms", chatID);
  const mySnapshot = await getDoc(spaceDocRef);
  const { participants } = mySnapshot.data();
  const newParticipants = participants.filter(
    (participant) => !participantIDs.includes(participant.id)
  );
  const docRef = doc(db, "chatrooms", chatID);
  const payload = { participants: newParticipants };
  await updateDoc(docRef, payload);

  // Update the participants space info
  const collectionRef = collection(db, "users");
  const queryStatement = where("id", "in", participantIDs);
  const q = query(collectionRef, queryStatement);

  // updating all the participants spaces with the new name
  getDocs(q)
    .then((snapshot) => {
      const results = snapshot.docs.map((doc) => doc.data());
      return results;
    })
    .then((results) => {
      results.forEach((result) => {
        const newSpaces = result.spaces.filter(
          (space) => space.chatID !== chatID
        );
        const newDocRef = doc(db, "users", result.id);
        const newPayload = { spaces: newSpaces };
        updateDoc(newDocRef, newPayload);
      });
    })
    .catch((err) => console.log(err));
};

export const deleteSpace = async (chatID) => {
  // grabing all the participants in that chatroom to update their space info
  const spaceDocRef = doc(db, "chatrooms", chatID);
  const mySnapshot = await getDoc(spaceDocRef);
  const { participants } = mySnapshot.data();
  const participantIDs = participants.map((participant) => participant.id);

  // querying the users collection to get the doc of all the participants
  const collectionRef = collection(db, "users");
  const queryStatement = where("id", "in", participantIDs);
  const q = query(collectionRef, queryStatement);

  // updating all the participants spaces with the new name
  getDocs(q)
    .then((snapshot) => {
      const results = snapshot.docs.map((doc) => doc.data());
      return results;
    })
    .then((results) => {
      results.forEach((result) => {
        const newSpaces = result.spaces.filter(
          (space) => space.chatID !== chatID
        );
        const newDocRef = doc(db, "users", result.id);
        const newPayload = { spaces: newSpaces };
        updateDoc(newDocRef, newPayload);
      });
    })
    .then(() => {
      const collectionRef = collection(db, `chatrooms/${chatID}/messages`);
      getDocs(collectionRef).then((result) => {
        if (result.docs) {
          result.docs.forEach((data) => {
            const msgDocRef = doc(db, `chatrooms/${chatID}/messages`, data.id);
            deleteDoc(msgDocRef);
          });
        }
      });
    })
    .then(() => {
      const docRef = doc(db, "chatrooms", chatID);
      deleteDoc(docRef);
    })
    .catch((err) => console.log(err));
};

export const mergeFriend = (arr1, arr2) => {
  const newFriendList = arr1.map((obj1) => {
    const friend = arr2.filter((obj2) => obj2.id === obj1.friendID)[0];
    return { ...friend, chatID: obj1.chatID };
  });
  return newFriendList;
};
