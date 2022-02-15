import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";
import Posts from "../components/post";

const Account = () => {
  useEffect(() => {
    document.title = "Account";
    getUserPage();
    getUser();
    getPosts();
  }, []);
  

  const ref = useRef();
  const token = JSON.parse(localStorage.token);
  const { id } = useParams();
  // console.log(id);
  const [userPage, setUserPage] = useState({});
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [showModifyUser, setShowModifyUser] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [imageProfileUpload, setImageProfileUpload] = useState();
  const [imageProfilePreview, setImageProfilePreview] = useState();

  const toggleOptions = () => {
    setShowOptions(!showOptions);

    // console.log(showOptions);
  };
  const toggleModifyUser = () => {
    setShowModifyUser(!showModifyUser);
    setFirstName(userPage.prenom);
    setLastName(userPage.nom);
    setImageProfilePreview(userPage.imageprofile);
    // console.log("Modify User = " + showModifyUser);
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (showOptions && ref.current && !ref.current.contains(e.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showOptions]);
  //get User infos
  const getUser = async () => {
    await axios({
      method: "GET",
      url: `http://localhost:3500/api/auth/${token.userId}`,
    })
      .then((res) => {
        // console.log(res.data[0]);
        setUser(res.data[0]);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //get User Page infos
  const getUserPage = async () => {
    await axios({
      method: "GET",
      url: `http://localhost:3500/api/auth/${id}`,
    })
      .then((res) => {
        // console.log(res.data[0]);
        setUserPage(res.data[0]);
        setLastName(res.data[0].nom);
        setFirstName(res.data[0].prenom);
        setImageProfilePreview(res.data[0].imageprofile);
        setEmail(res.data[0].email);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //get Posts
  const getPosts = async () => {
    await axios({
      method: "GET",
      url: `http://localhost:3500/api/auth/${id}/posts`,
    })
      .then((res) => {
        // console.log(res.data);
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const ModifyInfos = async (e) => {
    e.preventDefault();
    let data = new FormData();
    if (imageProfileUpload) {
      data.append("profil_image", imageProfileUpload);
    };
     data.append("userId", user.id);
    data.append("admin", user.admin);
    data.append("nom", lastName);
    data.append("prenom", firstName); 
    data.append("email", email);
    await axios({
      method: "PUT",
      url: `http://localhost:3500/api/auth/${id}`,
      data: data,
    })
      .then((res) => {
        // console.log(res.data);
        setShowModifyUser(false);
        getUserPage();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const pictureChange = (e) => {
    if (e.target.files[0]) {
      setImageProfileUpload(e.target.files[0]);
      setImageProfilePreview(URL.createObjectURL(e.target.files[0]));
    }
    // console.log(imageProfileUpload);
  };

  return (
    <div className="Account-container">
      <Header />
      <div className="Account-header">
        {showModifyUser ? (
          <div className="Account-header-right">
            <form action="" className="user-form" onSubmit={ModifyInfos}> 
              <div className="image-uploader">
                <label htmlFor="file-input">
                  <img
                    src={imageProfilePreview}
                    alt=""
                    className="profile-picture"
                  />
                  <i className="fa-solid fa-file-image"></i>
                </label>
                <input
                  id="file-input"
                  type="file"
                  name="profil_image"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={pictureChange}
                />
              </div>
              <div className="user-infos-uploader">
                <input
                  type="text"
                  className="input-text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="input-text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="input-text"
                  value={email} 
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

                <button className="btn-submit" type="submit" >Modifier mon profil</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="Account-header-infos">
            <img
              src={userPage.imageprofile}
              alt=""
              className="profile-picture"
            />
            <div className="Account-header-right">
              <h1 className="User-name">
                {lastName} {firstName}
                {userPage.admin === 1 ? "  (Admin)" : ""}
              </h1>
              <p>{email}</p>
              <p>
                nombre de publication{posts.length > 1 ? "s" : ""} ={" "}
                {posts.length}
              </p>
            </div>
          </div>
        )}

        <div
          className={`Account-header-options ${
            userPage.id === user.id || user.admin === 1 ? "active" : "inactive"
          }`}
          ref={ref}
        >
          <i className="fa-solid fa-gear" onClick={toggleOptions}></i>
          {showOptions ? (
            <div className="Account-options">
              <p
                className="edit"
                onClick={function (event) {
                  toggleModifyUser();
                  toggleOptions();
                }}
              >
                Modifier
              </p>
              <p className="delete">Supprimer</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {posts.map((post) => (
        <Posts
          key={post.datecreation}
          id={post.id}
          image={post.imageurl}
          message={post.message}
          date={post.datecreation}
          u_id={id}
          author={`${userPage.nom} ${userPage.prenom}`}
          authorPicture={userPage.imageprofile}
          admin={user.admin}
          totalLikes={post.total_like}
          totalComm={post.total_comm}
          dateComm={post.datecreation_comm}
          lastComm={post.commentaire}
          Comm_nom={post.comm_nom}
          Comm_prenom={post.comm_prenom}
          Comm_picture={post.comm_picture}
          Comm_uid={post.comm_uid}
          comm_id={post.comm_id}
          infos={user}
        />
      ))}
    </div>
  );
};

export default Account;
