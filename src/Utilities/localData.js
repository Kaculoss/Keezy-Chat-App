export const localData = {
  users: [
    {
      id: 1,
      name: "Sani Alhassan",
      friends: [
        { id: 2, chatID: "chat-1" },
        { id: 4, chatID: "chat-2" },
        { id: 5, chatID: "chat-3" },
        { id: 6, chatID: "chat-5" },
        { id: 7, chatID: "chat-4" },
      ],
      spaces: [1, 2],
      reqSent: 5,
      reqRec: 23,
      photoURL:
        "https://lh3.googleusercontent.com/a/AATXAJxiaKdc2jxrKQcRluarByEK2wRhTLCwswVADfEb=s96-c",
    },
    {
      id: 2,
      name: "Benjamin Asare",
      friends: [1, 3, 5, 6, 7],
      spaces: [2],
      reqSent: 0,
      reqRec: 0,
      photoURL:
        "https://lh3.googleusercontent.com/a/AATXAJwgVyOpKWSbglMwrlhZVUfOimtOHqSH7wI-tLq-=s96-c",
    },
    {
      id: 3,
      name: "Kipo Jimah",
      friends: [2, 4, 6],
      spaces: [3, 1],
      reqSent: 0,
      reqRec: 0,
      photoURL:
        "https://lh3.googleusercontent.com/a/AATXAJyPgiJY4SmXtQYuoqG2jgudYIu0fK7i4rv50DQg=s96-c",
    },
    { id: 4, name: "Nana Yaw", friends: [1, 3, 5, 7], reqSent: 0, reqRec: 0 },
    {
      id: 5,
      name: "Brah Kaculoss",
      friends: [1, 2, 4, 7],
      spaces: [2],
      reqSent: 0,
      reqRec: 0,
      photoURL:
        "https://lh3.googleusercontent.com/a-/AOh14Gjo_ySNxKNiOW1CU42xrByNDZRID_gQIaadIXjJsQ=s96-c",
    },
    {
      id: 6,
      name: "Keezy Keezy",
      friends: [1, 2, 3, 7],
      reqSent: 0,
      reqRec: 0,
      photoURL: "",
    },
    {
      id: 7,
      name: "Kipo Amigo",
      friends: [2, 4, 6, 1, 5],
      spaces: [3, 2],
      reqSent: 0,
      reqRec: 0,
      photoURL: "",
    },
  ],

  spaces: [
    {
      id: 1,
      name: "Space 1",
      admin: 1,
      participants: [1, 3],
      chatID: "chat-6",
    },
    {
      id: 2,
      name: "Space 2",
      admin: 5,
      participants: [1, 2, 5, 7],
      chatID: "chat-7",
    },
    {
      id: 3,
      name: "Space 3",
      admin: 3,
      participants: [3, 7],
      chatID: "chat-8",
    },
  ],

  chatrooms: [
    {
      id: "chat-1",
      participantIDs: [1, 2],
      name: "friend-chat",
      messages: [
        { id: "mess-1", uid: 1, text: "Hello! im Sani", photoURL: "" },
        { id: "mess-2", uid: 2, text: "Hi Im Benjamin", photoURL: "" },
        { id: "mess-3", uid: 2, text: "Hope you are doing good", photoURL: "" },
        { id: "mess-4", uid: 1, text: "im fine thank you", photoURL: "" },
        { id: "mess-5", uid: 1, text: "You?", photoURL: "" },
      ],
    },
    {
      id: "chat-2",
      participantIDs: [1, 4],
      name: "friend-chat",
      messages: [
        { id: "mess-6", uid: 4, text: "Hello! im Nana Yaw", photoURL: "" },
        { id: "mess-7", uid: 1, text: "Hi Im Sani", photoURL: "" },
        { id: "mess-8", uid: 4, text: "Hope you are doing good", photoURL: "" },
        { id: "mess-9", uid: 1, text: "im fine thank you", photoURL: "" },
        { id: "mess-10", uid: 1, text: "You?", photoURL: "" },
      ],
    },
    {
      id: "chat-3",
      name: "friend-chat",
      participantIDs: [1, 5],
      messages: [
        { id: "mess-11", uid: 5, text: "Hello! Im Kaculoss", photoURL: "" },
        { id: "mess-12", uid: 1, text: "Hi Im Sani", photoURL: "" },
        {
          id: "mess-13",
          uid: 5,
          text: "Hope you are doing good",
          photoURL: "",
        },
        { id: "mess-14", uid: 1, text: "im fine thank you", photoURL: "" },
        { id: "mess-15", uid: 5, text: "You?", photoURL: "" },
      ],
    },
    {
      id: "chat-4",
      name: "friend-chat",
      participantIDs: [1, 7],
      messages: [
        { id: "mess-16", uid: 7, text: "Hello! im Amigo", photoURL: "" },
        { id: "mess-17", uid: 1, text: "Hi Im Sani", photoURL: "" },
        {
          id: "mess-18",
          uid: 7,
          text: "Hope you are doing good",
          photoURL: "",
        },
        { id: "mess-19", uid: 7, text: "im fine thank you", photoURL: "" },
        { id: "mess-20", uid: 1, text: "You?", photoURL: "" },
      ],
    },
    {
      id: "chat-5",
      name: "friend-chat",
      participantIDs: [1, 6],
      messages: [
        { id: "mess-21", uid: 1, text: "Hello! im Sani", photoURL: "" },
        { id: "mess-22", uid: 6, text: "Hi Im Keezy", photoURL: "" },
        {
          id: "mess-23",
          uid: 1,
          text: "Hope you are doing good",
          photoURL: "",
        },
        { id: "mess-24", uid: 1, text: "im fine thank you", photoURL: "" },
        { id: "mess-25", uid: 6, text: "You?", photoURL: "" },
      ],
    },
    {
      id: "chat-6",
      participantIDs: [1, 3],
      name: "space-chat",
      messages: [
        { id: "mess-21", uid: 1, text: "Hello! im Sani", photoURL: "" },
        { id: "mess-22", uid: 3, text: "Hi Im Jimah", photoURL: "" },
        {
          id: "mess-23",
          uid: 1,
          text: "Hope you are doing good",
          photoURL: "",
        },
        { id: "mess-24", uid: 1, text: "im fine thank you", photoURL: "" },
        { id: "mess-25", uid: 3, text: "You?", photoURL: "" },
        { id: "mess-26", uid: 1, text: "This is a space", photoURL: "" },
        { id: "mess-27", uid: 3, text: "Really", photoURL: "" },
        { id: "mess-28", uid: 1, text: "Yh", photoURL: "" },
        { id: "mess-29", uid: 3, text: "So what is it called", photoURL: "" },
        { id: "mess-30", uid: 1, text: "Space 1", photoURL: "" },
      ],
    },
    {
      id: "chat-7",
      name: "space-chat",
      participantIDs: [1, 2, 5, 7],
      messages: [
        { id: "mess-31", uid: 1, text: "Hello! im Sani", photoURL: "" },
        { id: "mess-32", uid: 7, text: "Hi Im Amigo", photoURL: "" },
        {
          id: "mess-33",
          uid: 5,
          text: "Hope you are doing good",
          photoURL: "",
        },
        { id: "mess-34", uid: 7, text: "im fine thank you", photoURL: "" },
        { id: "mess-35", uid: 2, text: "You?", photoURL: "" },
        { id: "mess-36", uid: 1, text: "This is a space", photoURL: "" },
        { id: "mess-37", uid: 2, text: "Really", photoURL: "" },
        { id: "mess-38", uid: 7, text: "Yh", photoURL: "" },
        { id: "mess-39", uid: 7, text: "So what is it called", photoURL: "" },
        { id: "mess-40", uid: 5, text: "Space 2", photoURL: "" },
      ],
    },
    {
      id: "chat-8",
      name: "space-chat",
      participantIDs: [3, 7],
      messages: [
        { id: "mess-41", uid: 3, text: "Hello! im Jimah", photoURL: "" },
        { id: "mess-42", uid: 7, text: "Hi Im Amigo", photoURL: "" },
        {
          id: "mess-43",
          uid: 3,
          text: "Hope you are doing good",
          photoURL: "",
        },
        { id: "mess-44", uid: 3, text: "im fine thank you", photoURL: "" },
        { id: "mess-45", uid: 7, text: "You?", photoURL: "" },
        { id: "mess-46", uid: 3, text: "This is a space", photoURL: "" },
        { id: "mess-47", uid: 3, text: "Really", photoURL: "" },
        { id: "mess-48", uid: 7, text: "Yh", photoURL: "" },
        { id: "mess-49", uid: 3, text: "So what is it called", photoURL: "" },
        { id: "mess-50", uid: 7, text: "Space 3", photoURL: "" },
      ],
    },
  ],
};
