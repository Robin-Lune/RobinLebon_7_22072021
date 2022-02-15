import React, { useEffect, useState, useRef } from "react";
import { timePassed } from "../Utils/utils";

import axios from "axios";
import Comments from "./comments";
import { NavLink } from "react-router-dom";

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
  comm_id,
  infos,
}) => {
  useEffect(() => {
    setNumberComments(totalComm);
    getLikes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const ref = useRef();
  const ref2 = useRef();

  const [showOptionsPost, setShowOptionsPost] = useState(false);
  const [showOptionsComm, setShowOptionsComm] = useState(false);

  // useEffect that close the options when click outside of the target event
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (showOptionsPost && ref.current && !ref.current.contains(e.target)) {
        setShowOptionsPost(false);
      }
      if (showOptionsComm && ref2.current && !ref2.current.contains(e.target)) {
        setShowOptionsComm(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showOptionsPost, showOptionsComm]);

  const token = JSON.parse(localStorage.token);
  const userId = token.userId;
  const postId = id;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(totalLikes);
  const [showComment, setShowComment] = useState(false);
  const [numberComments, setNumberComments] = useState(totalComm);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState("");
  const [messagePost, setMessagePost] = useState(message);
  const [modifyComm, setModifyComm] = useState(false);
  const [imagePostPreview, setImagePostPreview] = useState(image);
  const [imagePostUpload, setImagePostUpload] = useState();
  const [deleteImageStatus, setDeleteImageStatus] = useState(false);

  const toggleOptionsPost = () => {
    setShowOptionsPost(!showOptionsPost);
    // console.log(showOptionsPost);
  };
  const toggleOptionsComm = () => {
    setShowOptionsComm(!showOptionsComm);
    // console.log(showOptionsComm);
  };
  //toggler to hide/show comments
  const toggleShowComment = (id) => {
    setShowComment(!showComment);
    getComments(lastComm);
    // console.log("Show = " + showComment);
  };
  const toggleModifyComm = () => {
    setModifyComm(!modifyComm);

    // console.log(modifyComm);
  };

  const cancelEdit = () => {
    setModifyComm(false);
    setMessagePost(message);
    setImagePostPreview(image);
    setImagePostUpload();
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
    await axios({
      method: "POST",
      url: `http://localhost:3500/api/posts/${id}/like`,
      data: {
        postId,
        userId,
      },
    })
      .then((res) => {
        // console.log(res);
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
      url: `http://localhost:3500/api/posts/${postId}/comments`,
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

  //delete post
  const deletePost = async () => {
    await axios({
      method: "DELETE",
      url: `http://localhost:3500/api/posts/${postId}`,
      data: {
        postId,
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

  const pictureChange = (e) => {
    if (e.target.files[0]) {
      setImagePostUpload(e.target.files[0]);
      setImagePostPreview(URL.createObjectURL(e.target.files[0]));
    }
    console.log(imagePostUpload);
  };

  const modifyPost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (imagePostUpload) {
      data.append("image", imagePostUpload);
    }
    data.append("message", messagePost);
    data.append("userId", userId);
    data.append("admin", admin);
    data.append("deleteImage", deleteImageStatus);

    await axios({
      method: "PUT",
      url: `http://localhost:3500/api/posts/${postId}`,
      data,
    })
      .then((res) => {
        console.log(res);
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const deleteImage = async () => {
    setImagePostPreview();
    setImagePostUpload();
    image = null;
    setDeleteImageStatus(true);
  };

  return (
    <div className={`post data-id="${id}`}>
      <div className="post-header">
        <NavLink to={`/account/${u_id}`} className="profile-link">
        <div className="post-header-left">
          <img src={authorPicture} alt="" className="profil-picture" />
          <div className="exif-data">
            <p className="author">{author}</p>
            <p className="date">{timePassed(date)}</p>
          </div>
        </div>
        </NavLink>
        <div
          className={`post-header-right ${
            u_id === userId || admin === 1 ? "active" : "inactive"
          }`}
          ref={ref}
        >
          <div className="icon-container" onClick={toggleOptionsPost}>
            <i className="fas fa-ellipsis-h"></i>
          </div>
          {/* show options */}
          {showOptionsPost ? (
            <div className="options">
              <p
                className="edit"
                onClick={function (event) {
                  toggleModifyComm();
                  toggleOptionsPost();
                }}
              >
                Modifier
              </p>
              <p className="delete" onClick={deletePost}>
                Supprimer
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="post-body">
        {modifyComm ? (
          <form action="" onSubmit={modifyPost}>
            <p className="abort-edit" onClick={cancelEdit}>
              Annuler
            </p>
            <input
              type="text"
              value={messagePost}
              onChange={(e) => setMessagePost(e.target.value)}
              className="text-modifier"
            />
            {image !== null ? (
              <div className="image-upload">
                <label htmlFor="file-input">
                  <img src={imagePostPreview} className="post-image" />
                  <i className="fa-solid fa-file-image"></i>
                </label>

                <input
                  id="file-input"
                  type="file"
                  name="picture"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={pictureChange}
                />
                <p className="delete-image" onClick={deleteImage}>
                  supprimer l'image
                </p>
              </div>
            ) : (
              <div className="image-upload">
                <label htmlFor="file-input">
                  <img src={imagePostPreview} className="post-image" />
                  <i className="fa-solid fa-file-image"></i>
                </label>

                <input
                  id="file-input"
                  type="file"
                  name="picture"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={pictureChange}
                />
                <p className="delete-image" onClick={deleteImage}>
                  supprimer l'image
                </p>
              </div>
            )}

            <button className="btn-modify" type="submit">
              Modifier mon post!
            </button>
          </form>
        ) : (
          <div className="body">
            <p className="post-message">{messagePost}</p>
            {image !== null ? (
              <img className="post-image" src={image} alt="" />
            ) : (
              ""
            )}
          </div>
        )}
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
              <i className="far fa-heart like-icon"></i>
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
          <div className="comment-section">
            <div className="comment ">
              <div className="comment-header">
                <NavLink to={`/account/${Comm_uid}`} className="profile-link">
                <div className="comment-header-left">
                  <img src={Comm_picture} alt="" className="profil-picture" />

                  <div className="exif-data">
                    <p className="author">{`${Comm_nom} ${Comm_prenom}`}</p>
                    <p className="date">{timePassed(dateComm)}</p>
                  </div>
                </div>
                </NavLink>
                <div
                  className={`comment-header-right ${
                    Comm_uid === userId || admin === 1 ? "active" : "inactive"
                  }`}
                  ref={ref2}
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
              <p className="comment-message">{lastComm}</p>
            </div>
          </div>
        ) : (
          ""
        )}

        {/* SHOW ALL COMMENTS SECTION */}
        {showComment ? (
          <form action="" className="form-comment" onSubmit={sendComment}>
            <img
              src={infos.imageprofile}
              alt="profile utilisateur"
              className="profil-picture"
            />
            <input
              type="text"
              placeholder="Ajouter un commentaire"
              className="add-comment"
              value={commentForm}
              onChange={(e) => setCommentForm(e.target.value)}
              id="input-comment"
            />
            <button
              className="add-comment-button"
              disabled={commentForm === ""}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        ) : (
          ""
        )}

        {showComment
          ? comments.map((comment) => (
              <Comments
                key={comment.datecreation_comm}
                commentaire={comment.commentaire}
                nom={comment.nom}
                prenom={comment.prenom}
                picture={comment.imageProfile}
                date={comment.datecreation_comm}
                comm_uId={comment.utilisateur_id}
                userId={userId}
                admin={admin}
                id={comment.comm_id}
              />
            ))
          : ""}
      </div>
      {/* MODIFY POST  */}
    </div>
  );
};

export default Post;
