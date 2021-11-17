import { createContext, useContext, useReducer } from "react";
import { localData } from "./localData";

export const initialState = {
  searchResults: [],
  showResults: false,
  searchRef: "",
  data: localData,
  showRequests: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case "ADD_RESULTS":
      const { data, search } = action.payload;
      return {
        ...state,
        searchResults: data,
        showResults: true,
        searchRef: search,
      };

    case "NO_VALUE":
      return { ...state, searchResults: [], showResults: false };

    case "CLEAR_RESULTS":
      return { ...state, showResults: false };

    case "SHOW_ALL_FRIENDS":
      return { ...state, showAllFriends: true, showAllRequests: false };

    case "SHOW_ALL_REQUESTS":
      return { ...state, showAllRequests: true, showAllFriends: false };

    case "SHOW_REQUESTS":
      return { ...state, showRequests: true };

    case "SHOW_FRIENDS":
      return { ...state, showRequests: false };

    default:
      return state;
  }
}

export const DataLayerContext = createContext();

export const DataLayer = ({ initialState, reducer, children }) => {
  return (
    <DataLayerContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </DataLayerContext.Provider>
  );
};

export const useDataLayerValue = () => {
  return useContext(DataLayerContext);
};

export const mergeArrayObjects = (arr1, arr2) => {
  return arr1.map((item, i) => {
    if (item.id === arr2[i].id) {
      //merging two objects
      return Object.assign({}, item, arr2[i]);
    } else {
      return {};
    }
  });
};

export const searchFriends = (item) => {
  const removeCurrentUser = localData.users.filter((user) => user.id !== 1);

  const friends = removeCurrentUser.filter((user) =>
    user.name.toLowerCase().includes(item.toLowerCase())
  );

  return friends;
};

export const getFriendNames = () => {
  const friendIDs = [];
  localData.users[0].friends.forEach((item) => friendIDs.push(item.id));

  const friends = localData.users.filter((user) => friendIDs.includes(user.id));

  const friendNames = [];
  friends.forEach((user) => friendNames.push(user.name));

  return friendNames;
};

export const getSpaceChats = () => {
  const spaces = localData.spaces.filter((space) =>
    localData.users[0].spaces.includes(space.id)
  );

  return spaces;
};

export const getFriendChats = () => {
  const friendIDs = localData.users[0].friends.map((friend) => friend.id);

  const friendships = localData.users.filter((user) =>
    friendIDs.includes(user.id)
  );

  const friendChats = localData.users[0].friends.map((friend) => friend);

  const friends = mergeArrayObjects(friendships, friendChats);

  return friends;
};

export const getChatName = (chatroom) => {
  let chatname;
  if (chatroom[0].name === "space-chat") {
    const space = localData.spaces.filter(
      (space) => space.chatID === chatroom[0].id
    );
    chatname = space[0].name;
  } else {
    const friends = getFriendChats();
    const friend = friends.filter((friend) => friend.chatID === chatroom[0].id);
    chatname = friend[0].name;
  }

  return chatname;
};

export const getChatRoom = (chatID) => {
  const chatroom = localData.chatrooms.filter(
    (chatroom) => chatroom.id === chatID
  );
  const chatname = getChatName(chatroom);
  return { ...chatroom[0], chatName: chatname };
};

const allDifferentButtonFunctions = {
  signInPageButtons: {
    sign_in_with_google:
      "allows a user to sign into the keezy app with a google acount",
    sign_out: "logs a user out of the keezy app",
    go_to_homepage: "takes a user to the homepage of the keezy app",
  },
  homepageButtons: {
    chat: "opens the friend chatRoom",
    create_new_space: "opens a new space with only the current user",
    community_space:
      "opens a space where all the users in the user list can chat",
    enter_space: "opens the space chatRoom",
    search: "query through the user collection and displays the results",
    send_request: "sends a request to different user",
    show_all_request:
      "query through the both the recSent and recRec field and displays results",
    add_new_friend:
      "add a new friend to the current user list as well as the other friends list",
    reject_friend:
      "removes the friend from the recRec list as well as the recSent list of the other friend",
    clear_results: "clears the search results",
  },
  chatRoom: {
    send: "sends text",
    back_to_homepage: "sends the user back to the home page",
    add_friends: "adds a friend to the space",
    leave_space: "removes a user from the space",
  },
};
