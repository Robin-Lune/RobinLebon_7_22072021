import React, { useEffect, useState } from "react";
import { timePassed } from "../Utils/utils";

import axios from "axios";
import Comments from "./comments";

const Post = ({
  id,
  image,
  message,
  date,
  author,
  authorPicture,
  u_id,
  admin,
  totalLikes,
  totalComm,
  dateComm,
  lastComm,
  Comm_nom,
  Comm_prenom,
  Comm_picture,
  Comm_uid,
  infos,
}) => {
  useEffect(() => {
    setLikes(totalLikes);
    setNumberComments(totalComm);
    getLikes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const token = JSON.parse(localStorage.token);
  const userId = token.userId;
  const postId = id;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState();
  const [showComment, setShowComment] = useState(false);
  const [numberComments, setNumberComments] = useState(totalComm);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState("");

  //toggler 
  const toggleShowComment = (id) => {
    setShowComment(!showComment);
    getComments(lastComm);
    // console.log("Show = " + showComment);
  };

  const getLikes = async () => {
    await axios({
      method: "GET",
      url: `http://localhost:3500/api/posts/${postId}/like`,
    })
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].lp_utilisateur_id === userId) {
            setLiked(true);
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //on click on like button add like to the post
  const handleLike = async () => {
    const userId = token.userId;
    await axios({
      method: "POST",
      url: `http://localhost:3500/api/posts/${id}/like`,
      data: {
        postId,
        userId,
      },
    })
      .then((res) => {
        console.log(res);
        getLikes();
        if (liked) {
          setLiked(false);
          setLikes(likes - 1);
        } else {
          setLiked(true);
          setLikes(likes + 1);
        }
        // window.location.href = "/";
      })
      .catch((err) => {
        console.log(err.response);
      });
  };


  // get all comments of the post
  const getComments = async (lastComm) => {
    if (lastComm === null) {
      return;
    }

    await axios
      .get(`http://localhost:3500/api/posts/${postId}/comments`)
      .then((res) => {
        // console.log(res.data);
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //add comment to the post
  const sendComment = async (e) => {

    e.preventDefault();
 
    await axios({
      method: "POST",
      url: `http://localhost:3500/api/posts/${id}/comments`,
      data: {
        postId,
        userId,
        commentaire: commentForm,
      },
    })
      .then((res) => {
        // console.log(res);
        setCommentForm("");
        setNumberComments(numberComments + 1);
        getComments();

      })
      .catch((err) => {
        console.log(err.response);
      });
    // console.log (commentForm)
  };

        
      

  return (
    <div className={`post data-id="${id}`}>
      <div className="post-header">
        <div className="post-header-left">
          <img src={authorPicture} alt="" className="profil-picture" />
          <div className="exif-data">
            <p className="author">{author}</p>
            <p className="date">{timePassed(date)}</p>
          </div>
        </div>

        <div
          className={`post-header-right ${
            u_id === userId || admin === 1 ? "active" : "inactive"
          }`}
        >
          <i className="fas fa-ellipsis-h"></i>
        </div>
      </div>

      <div className="post-body">
        <p className="post-message">{message}</p>
        <img className="post-image" src={image} alt="" />
      </div>

      <div className="post-footer">
        <div className="like-comment">
          <div className="like-container">
            <p className={`like-count  ${likes > 0 ? "" : "inactive"}`}>
              {likes}
            </p>
            <div
              className={`icon-cointainer ${liked ? "inactive" : ""}`}
              onClick={handleLike}
            >
              <i class="far fa-heart like-icon"></i>
            </div>
            <div
              className={`icon-cointainer ${liked ? "" : "inactive"}`}
              onClick={handleLike}
            >
              <i className="fas fa-heart like-icon"></i>
            </div>
          </div>
          <div className="comment-container" onClick={toggleShowComment}>
            <p className={`comment-count  ${totalComm > 0 ? "" : "inactive"}`}>
              {numberComments}
            </p>
            <i className="far fa-comment"></i>
          </div>
        </div>
        <hr />
        {/* LAST COMM SECTION */}
        {lastComm != null && showComment === false ? (
          // comments list
          <div className="comment-section">
            <div className="comment">
              <div className="comment-header">
                <div className="comment-header-left">
                  <img src={Comm_picture} alt="" className="profil-picture" />

                  <div className="exif-data">
                    <p className="author">{`${Comm_nom} ${Comm_prenom}`}</p>
                    <p className="date">{timePassed(dateComm)}</p>
                  </div>
                </div>
                <div className={`comment-header-right ${
            Comm_uid === userId || admin === 1 ? "active" : "inactive"
          }`}>
                  <i className="fas fa-ellipsis-h"></i>
                </div>
              </div>
              <p className="comment-message">{lastComm}</p>
            </div>
          </div>
        ) : ( 
          ""
        )}

        {/* COMMENTS SECTION */}
        {showComment ? (
          <form action="" className="form-comment" onSubmit={sendComment}>
            <img src={infos.imageprofile} alt="image de profile utilisateur" className="profil-picture" />
            <input type="text" placeholder="Ajouter un commentaire" className="add-comment" onChange={(e) => setCommentForm(e.target.value)} id="input-comment" /> 
            <button className="add-comment-button" disabled={commentForm === ""}  >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>

        ) : ""}

        {showComment
          ?       
            comments.map((comment) => (
              
              <Comments
                key = {comment.datecreation_comm}
                commentaire={comment.commentaire}
                nom={comment.nom}
                prenom={comment.prenom}
                picture={comment.imageProfile}
                date={comment.datecreation_comm}
                comm_uId = {comment.utilisateur_id}
                userId = {userId}
                admin = {admin}
                id = {comment.comm_id}
              />
            ))
          : ""}
      </div>
    </div>
  );
};

export default Post;
