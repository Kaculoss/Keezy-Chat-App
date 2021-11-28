import React from "react";

export const UserInfo = ({ currentUser }) => {
  return (
    <>
      <div className="user-info-div">
        <div className="user-image-name-div">
          <img src={currentUser.photoURL} alt="" />
          <h2>{currentUser.name}</h2>
        </div>

        <div className="user-friends">
          <div className="main-info">
            <h3>
              <span className="info-span">{currentUser.friends?.length}</span>{" "}
              Friends
            </h3>
            <h3>
              <span className="info-span">{currentUser.spaces?.length}</span>{" "}
              Spaces
            </h3>
          </div>

          <div className="sub-info">
            <p>
              <span className="info-span">{currentUser.reqRec?.length}</span>{" "}
              request(s) received
            </p>
            <p>
              <span className="info-span">{currentUser.reqSent?.length}</span>{" "}
              request(s) sent
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
