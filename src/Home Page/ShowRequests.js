import React, { useEffect, useState } from "react";
import {
  acceptFriendReq,
  getFriends,
  rejectFriendReq,
} from "../Utilities/firebaseUtils";

export const ShowRequests = ({ currentUser }) => {
  const [requestSent, setRequestSent] = useState([]);
  const [requestReceived, setRequestReceived] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const request_sentIDs = currentUser?.reqSent?.map(
        (request) => request.id
      );

      const request_receivedIDs = currentUser?.reqRec?.map(
        (request) => request.id
      );

      if (request_sentIDs?.length !== 0) {
        getFriends(request_sentIDs).then((results) => setRequestSent(results));
      } else {
        setRequestSent([]);
      }

      if (request_receivedIDs?.length !== 0) {
        getFriends(request_receivedIDs).then((results) =>
          setRequestReceived(results)
        );
      } else {
        setRequestReceived([]);
      }
    }
  }, [currentUser]);

  let recCount = 0;
  let sentCount = 0;
  return (
    <>
      <div className="chat-div rec-requests-div request-div">
        <h4>Received Requests</h4>
        {requestReceived &&
          requestReceived.map((request) => {
            const { id, name } = request;
            const shade = recCount % 2 !== 0 ? "no-shade" : "shade";
            recCount += 1;
            return (
              <div key={id} className={`friend-chat all-chats ${shade}`}>
                <p>{name}</p>
                <div className="req-received-buttons show-req-btns">
                  <button
                    id="accept-friend"
                    onClick={() => acceptFriendReq(request, currentUser)}
                  >
                    accept
                  </button>
                  <button
                    id="reject-friend"
                    onClick={() => {
                      rejectFriendReq(request, currentUser);
                    }}
                  >
                    reject
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <div className="chat-div sent-requests-div request-div">
        <h4>Sent Requests</h4>
        {requestSent &&
          requestSent.map((request) => {
            const { id, name } = request;
            const shade = sentCount % 2 !== 0 ? "no-shade" : "shade";
            sentCount += 1;
            return (
              <div key={id} className={`friend-chat all-chats ${shade}`}>
                <p>{name}</p>
                <p id="pending">pending...</p>
              </div>
            );
          })}
      </div>
    </>
  );
};
