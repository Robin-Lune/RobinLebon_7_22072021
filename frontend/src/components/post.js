import React, { useEffect, useState } from "react";

import axios from "axios";

const Post = ({ id, image, message, date, author, authorPicture }) => {
  useEffect(() => {
    getComments();
    getLikes();
  }, []);

  const [likes, setLikes] = useState();
  const [comments, setComments] = useState();
  const token = JSON.parse(localStorage.token);
  const userId = token.userId;
  const [liked, setLiked] = useState(false);

  //time passed from date to now
  const timePassed = (date) => {
    const today = new Date();
    const todayDate = today.getTime();
    const postDate = new Date(date).getTime();
    const diff = todayDate - postDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor(diff / 1000);
    if (days > 0) {
      if (days === 1) {
        return `il y a ${days} jour`;
      } else {
        return `il y a ${days} jours`;
      }
    } else if (hours > 0) {
      if (hours === 1) {
        return `il y a ${hours} heure`;
      } else {
        return `il y a ${hours} heures`;
      }
    } else if (minutes > 0) {
      if (minutes === 1) {
        return `il y a ${minutes} minute`;
      } else {
        return `il y a ${minutes} minutes`;
      }
    } else {
      return `il y a ${seconds} secondes`;
    }
  };

  //on click on like button add like to the post
  const handleLike = async () => {
    const postId = id;
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
        } else {
            setLiked(true);
        }
        // window.location.href = "/"; //this is for redirecting to home page
      })
      .catch((err) => {
        console.log(err.response);
      });
  };


  // get all comments of the post
  const getComments = async () => {
    await axios
      .get(`http://localhost:3500/api/posts/${id}`)
      .then((res) => {
        console.log(res.data);
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  // get all likes of the post
  const getLikes = async () => {
    await axios
      .get(`http://localhost:3500/api/posts/${id}/like`)
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          console.log(res.data[i].lp_utilisateur_id);
          if (res.data[i].lp_utilisateur_id === userId) {
            setLiked(true);
          }
        }
        setLikes(res.data);
        console.log(liked);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className={`post data-id="${id}`}>
      <div className="post-header">
        <img src={authorPicture} alt="" className="profil-picture" />
        <div className="exif-data">
          <p className="author">{author}</p>
          <p className="date">{timePassed(date)}</p>
        </div>
      </div>

      <div className="post-body">
        <p className="post-message">{message}</p>
        <img className="post-image" src={image} alt="" />
      </div>

      <div className="post-footer">
        <div className="like-comment">
          <div className="like">
            {/* {likes.length > 0 ? (<p className="like-count">{likes.length}</p>) :( <p className="like-count-inactive"></p>)} */}
              <div className={`icon-cointainer ${liked ? "inactive" : ""}`} onClick={handleLike}
onClick={handleLike} >
                <i class="far fa-heart like-icon"></i>
              </div>
              <div className={`icon-cointainer ${liked ? "" : "inactive"}`} onClick={handleLike}
onClick={handleLike} >
                <i className="fas fa-heart like-icon" ></i>
              </div>
          </div>
          <div className="comment">
            {/* {comments.length > 0 ? <p className="comment-count">{comments.length}</p> : <p className="comment-count-inactive"></p>} */}
            <i className="far fa-comment"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
