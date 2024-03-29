import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import Header from "../components/header";
import Posts from "../components/post";
import { emailValidation, lettersAndSpaceCheck } from "../Utils/utils";

const Account = () => {
  const location = useLocation();
  useEffect(() => {
    getUserPage();
    getUser();
    getPosts();
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  const ref = useRef();
  const token = JSON.parse(localStorage.token);
  const { id } = useParams();
  const [userPage, setUserPage] = useState({});
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [showModifyUser, setShowModifyUser] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState("");
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
    setImageProfileUpload();
    // console.log("Modify User = " + showModifyUser);
  };

  const toggleShowDeleteUser = () => {
    setShowDeleteUser(!showDeleteUser);
    // console.log("ShowDelete User = " + showDeleteUser);
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

  //GERT CURRENT USER INFOS
  const getUser = async () => {
    await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKHOST}/api/auth/${token.userId}`,
    })
      .then((res) => {
        // console.log(res.data[0]);
        setUser(res.data[0]);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //GET USER PAGE INFOS
  const getUserPage = async () => {
    await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKHOST}/api/auth/${id}`,
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

  //get USER PAGE POST
  const getPosts = async () => {
    await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BACKHOST}/api/auth/${id}/posts`,
    })
      .then((res) => {
        // console.log(res.data);
        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
// MODIFY USER PAGE INFOS
  const ModifyInfos = async (e) => {
    e.preventDefault();
    const formlastName = document.getElementById("lastname");
    const formfirstName = document.getElementById("firstname");
    const formemail = document.getElementById("email");
    formemail.className = "input-text";
    formlastName.className = "input-text";
    formfirstName.className = "input-text";

    if (!emailValidation(email)) {
      formemail.className = "input-text form-error";
    }
    if (!lettersAndSpaceCheck(lastName)) {
      formlastName.className = "input-text form-error";
    }
    if (!lettersAndSpaceCheck(firstName)) {
      formfirstName.className = "input-text form-error";
    }

    if (
      emailValidation(email) &&
      lettersAndSpaceCheck(lastName) &&
      lettersAndSpaceCheck(firstName)
    ) {
      let data = new FormData();
      if (imageProfileUpload) {
        data.append("profil_image", imageProfileUpload);
      }
      data.append("nom", lastName);
      data.append("prenom", firstName);
      data.append("email", email);
      await axios({
        method: "PUT",
        url: `${process.env.REACT_APP_BACKHOST}/api/auth/${id}`,
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
    }
  };

  const pictureChange = (e) => {
    if (e.target.files[0]) {
      setImageProfileUpload(e.target.files[0]);
      setImageProfilePreview(URL.createObjectURL(e.target.files[0]));
    }
    // console.log(imageProfileUpload);
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    await axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_BACKHOST}/api/auth/${id}`,
    })
      .then((res) => {
        // console.log(res.data);
        if (user.admin === 1) {
          window.location.href = "/";
        } else {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <main className="Account-container">
      <Helmet>
        <title>Compte utilisateur</title>
        <meta
          name="description"
          content="Page de profil utilisateur Groupomania"
        />
        {/* FACEBOOK */}
        <meta property="og:title" content="Compte utilisateur" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://localhost:3000/login" />
        <meta
          property="og:description"
          content="Page utilisateur de la palteforme Groupomania"
        />
        {/* TWITTER */}
        <meta name="twitter:title" content="Compte utilisateur" />
        <meta
          name="twitter:description"
          content="Page utilisateur de la palteforme Groupomania"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@Groupomania_Robin_LEBON" />
        <meta name="twitter:creator" content="@Groupomania_Robin_LEBON" />
      </Helmet>

      <Header />

      <section className="Account-header">
        {showModifyUser ? (
          <div className="Account-header-infos">
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
                <label htmlFor="lastname" className="inactive">
                  Nom
                </label>
                <input
                  type="text"
                  className="input-text"
                  id="lastname"
                  value={lastName}
                  placeholder="Nom"
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
                <label htmlFor="firstname" className="inactive">
                  Prénom
                </label>
                <input
                  type="text"
                  className="input-text"
                  id="firstname"
                  value={firstName}
                  placeholder="Prénom"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <label htmlFor="email" className="inactive">
                  Email
                </label>
                <input
                  type="text"
                  className="input-text"
                  id="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />

                <button className="btn-submit" type="submit">
                  Modifier mon profil
                </button>
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
              <p>Publications: {posts.length}</p>
            </div>
          </div>
        )}

        <div
          className={`Account-header-options ${
            userPage.UID === user.UID || user.admin === 1 ? "active" : "inactive"
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
              <p
                className="delete"
                onClick={function (event) {
                  toggleShowDeleteUser();
                  toggleOptions();
                }}
              >
                Supprimer
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
      <section className="user-posts">
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
      </section>

      <div className={`background ${showDeleteUser ? "active" : ""}`}></div>
      <div className={`delete-container ${showDeleteUser ? "active" : ""}`}>
        <i
          className="far fa-times-circle"
          onClick={function (event) {
            setDeleteUser("");
            toggleShowDeleteUser();
          }}
        ></i>

        <h2 className="warning">
          Attention cette opération est irréversible !
        </h2>
        <p>Voulez-vous vraiment supprimer votre compte ?</p>
        <p>Pour supprimer votre compte entrez votre nom et prénom ci-dessous</p>
        <form action="" className="form-delete" onSubmit={deleteAccount}>
          <div className="input-delete-container">
            <label htmlFor="input-delete" className="inactive">
              Nom et prénom
            </label>
            <input
              type="text"
              className="input-delete"
              id="input-delete"
              placeholder="Nom Prénom"
              value={deleteUser}
              onChange={(e) => {
                setDeleteUser(e.target.value.toLocaleLowerCase());
              }}
            />
            <i
              className={`fa-solid fa-circle-check ${
                deleteUser ===
                lastName.toLocaleLowerCase() +
                  " " +
                  firstName.toLocaleLowerCase()
                  ? "true"
                  : "false"
              } `}
            ></i>
          </div>
          <button
            className="btn-delete"
            type="submit"
            disabled={
              deleteUser !==
              lastName.toLocaleLowerCase() + " " + firstName.toLocaleLowerCase()
            }
          >
            Supprimer mon compte
          </button>
        </form>
      </div>
    </main>
  );
};

export default Account;
