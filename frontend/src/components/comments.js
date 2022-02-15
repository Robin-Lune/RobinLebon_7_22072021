import React, {useEffect, useState,useRef} from "react";
import { timePassed } from "../Utils/utils";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Comments = (commentaire, nom) => {
  const ref = useRef();
  const token = JSON.parse(localStorage.token);
  const comm_id =   commentaire.id;
  const userId = token.userId;
  const admin = commentaire.admin;
  // console.log(commentaire);

  const [showOptionsComm, setShowOptionsComm] = useState(false);

  const toggleOptionsComm = () => {
    setShowOptionsComm(!showOptionsComm);
    // console.log(showOptionsComm);
  };

  // useEffect that close the options when click outside of the target event
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (showOptionsComm && ref.current && !ref.current.contains(e.target)) {
        setShowOptionsComm(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showOptionsComm]);

   //delete comment
   const deleteComm = async () => {
    await axios({
      method: "DELETE",
      url: `http://localhost:3500/api/posts/comments/${comm_id}`,
      data: {
        userId,
        admin,
      },
    })
      .then((res) => {
        // console.log(res);
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  // console.log(commentaire);

  return (
    <div className="comment-section">
      <div className="comment-section">
        <div className="comment">
          <div className="comment-header">
            <NavLink to={`/Account/${commentaire.comm_uId}`} className="profile-link">
            <div className="comment-header-left">
              <img
                src={commentaire.picture}
                alt=""
                className="profil-picture"
              />

              <div className="exif-data">
                <p className="author">{`${commentaire.nom} ${commentaire.prenom}`}</p>
                <p className="date">{timePassed(commentaire.date)}</p>
              </div>
            </div>
            </NavLink>

            <div
              className={`comment-header-right ${
                commentaire.comm_uId === userId ||
                admin === 1
                  ? "active"
                  : "inactive"
              }`}
              ref={ref}
            >
               <div className="icon-container" onClick={toggleOptionsComm}>
                    <i className="fas fa-ellipsis-h"></i>
                  </div>
                  {/* show options */}
                  {showOptionsComm ? (
                    <div className="options -comm">
                      <p className="delete" onClick={deleteComm}>
                        Supprimer
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

            </div>
          </div>
          <p className="comment-message">{commentaire.commentaire}</p>
        </div>
      </div>
    </div>
  );
};

export default Comments;
