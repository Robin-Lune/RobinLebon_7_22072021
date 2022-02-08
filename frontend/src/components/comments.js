import React from "react";
import { timePassed } from '../Utils/utils';

const Comments = (  commentaire , nom) => {


    // console.log(commentaire);
    return (
        <div className="comment-section">
        <div className="comment-section">
            <div className="comment">
              <div className="comment-header">
                <div className="comment-header-left">
                  <img src={commentaire.picture} alt="" className="profil-picture" />

                  <div className="exif-data">
                    <p className="author">{`${commentaire.nom} ${commentaire.prenom}`}</p>
                    <p className="date">{timePassed(commentaire.date)}</p>
                  </div>
                </div>
                <div className={`comment-header-right ${
            commentaire.comm_uId === commentaire.userId || commentaire.admin === 1 ? "active" : "inactive"
          }`}>
                  <i className="fas fa-ellipsis-h"></i>
                </div>
              </div>
              <p className="comment-message">{commentaire.commentaire}</p>
            </div>
          </div>
      </div>
    ); 
};

export default Comments;




