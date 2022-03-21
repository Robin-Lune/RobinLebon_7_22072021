import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import {
  emailValidation,
  lettersAndNumbersCheck,
  lettersAndSpaceCheck,
} from "../Utils/utils";

function Login() {
  const [isActive, setActive] = useState("false");

  const handleToggle = () => {
    setActive(!isActive);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // function to handle signup form
  const handleSignup = async (e) => {
    e.preventDefault();
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const nomError = document.getElementById("nomError");
    const prenomError = document.getElementById("prenomError");
    passwordError.innerHTML = "";
    emailError.innerHTML = "";
    nomError.innerHTML = "";
    prenomError.innerHTML = "";

    if (emailValidation(email) === false) {
      emailError.innerHTML = "Veuillez entrer un email valide";
    }
    if (lettersAndNumbersCheck(password) === false) {
      passwordError.innerHTML =
        'Veuillez entrer un mot de passe valide </br>(6 caractères minimum)  </br> Lettres et chiffres autorisés </br> "@" et "." autorisés';
    }
    if (lettersAndSpaceCheck(nom) === false) {
      nomError.innerHTML = "Veuillez entrer un nom valide";
    }
    if (lettersAndSpaceCheck(prenom) === false) {
      prenomError.innerHTML = "Veuillez entrer un prenom valide";
    }
    
    if (
      emailValidation(email) &&
      lettersAndNumbersCheck(password) &&
      lettersAndSpaceCheck(nom) &&
      lettersAndSpaceCheck(prenom)
    ) {
      await axios({
        method: "POST",
        url:`${process.env.REACT_APP_BACKHOST}/api/auth/signup`,
        data: {
          email: email,
          password: password,
          nom: nom,
          prenom: prenom,
        },
      })
        .then((res) => {
          console.log(res.data);
          alert("Votre compte a été créé avec succès");
          window.location.href = "/login";
        })
        .catch((err) => {
          if (err.response.data.message) {
            passwordError.innerHTML = err.response.data.message;
          }
          if (err.response.data.error) {
            emailError.innerHTML = err.response.data.error;
          }
        });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const loginError = document.getElementById("loginError");
    loginError.innerHTML = "";

    if (email === "" || password === "") {
      loginError.innerHTML = "Veuillez remplir tous les champs";
      return;
    } else {
      if (emailValidation(email) === false) {
        loginError.innerHTML = "Veuillez entrer un email valide";
        return;
      }
      if (lettersAndNumbersCheck(password) === false) {
        loginError.innerHTML = "Veuillez entrer un mot de passe valide";
        return;
      }
    }

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BACKHOST}/api/auth/login`,
      data: {
        email: email,
        password: password,
      },
    })
      .then((res) => {
        console.log(res.data);
        localStorage.token = JSON.stringify(res.data);
        window.location.href = "/";
      })
      .catch((err) => {
        if (err.response) {
          loginError.innerHTML = err.response.data.error;
        }
      });
  };

  return (
    <main className="mainContainer">
      <Helmet>
        <title>Login</title>
        <meta
          name="description"
          content="Page de connexion de la palteforme Groupomania"
        />
        {/* FACEBOOK */}
        <meta property="og:title" content="Login Groupomania" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://localhost:3000/login" />
        <meta
          property="og:description"
          content="Page de connexion de la palteforme Groupomania"
        />
        {/* TWITTER */}
        <meta name="twitter:title" content="Login Groupomania" />
        <meta
          name="twitter:description"
          content="Page de connexion de la palteforme Groupomania"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@Groupomania_Robin_LEBON" />
        <meta name="twitter:creator" content="@Groupomania_Robin_LEBON" />
      </Helmet>

      <div className={`bgContainer ${isActive ? "" : "blured"}`}>
        <img
          src="./ressources/icon-above-font.png"
          alt="Logo de l'entreprise Groupomania"
        />
        <section className="loginContainer">
          <form action="" onSubmit={handleLogin}>
            <label htmlFor="email"> Email </label>
            <input
              type="text"
              placeholder="Email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password1"> Mot de passe </label>
            <input
              type="password"
              placeholder="Password"
              name="password1"
              id="password1"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error" id="loginError"></div>

            <button type="submit">Login</button>
          </form>
          <hr />
          <div className="signupContainer">
            <p>Pas encore inscrit ?</p>
            <p className="signupLink" onClick={handleToggle}>
              S'inscrire
            </p>
          </div>
        </section>
      </div>

      <div className={`signupPopup ${isActive ? "" : "active"}`}>
        <div className="close-icon" onClick={handleToggle}>
          <i className="far fa-times-circle"></i>
        </div>

        <section className="signupPopupContainer">
          <h1>Inscription</h1>
          <form action="" onSubmit={handleSignup}>
            <div className="headerpopup">
              <div className="nom-container">
                <label htmlFor="nom">Nom</label>
                <input
                  type="text"
                  placeholder="Nom"
                  name="nom"
                  id="nom"
                  required
                  onChange={(e) => setNom(e.target.value)}
                />
                <div className="error" id="nomError"></div>
              </div>
              <div className="prenom-container">
                <label htmlFor="prenom">Prenom</label>
                <input
                  type="text"
                  placeholder="Prenom"
                  name="prenom"
                  id="prenom"
                  required
                  onChange={(e) => setPrenom(e.target.value)}
                />
                <div className="error" id="prenomError"></div>
              </div>
            </div>

            <label htmlFor="email2"> Email </label>
            <input
              type="text"
              placeholder="Email"
              name="email2"
              id="email2"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="error" id="emailError"></div>
            <label htmlFor="password2"> Mot de passe </label>
            <div className="password-container">    
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                name="password2"
                id="password2"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className={`fa-solid fa-eye ${showPassword ? "showPassword" : ""}`} onClick ={function (event) {
                  toggleShowPassword();
                }} ></i>
              </div>
            <div className="error" id="passwordError"></div>
            {/* <label for=""> Confirmer le mot de passe </label>
            <input type="password" placeholder=" Confirmer le mot de passe" name="password2" /> */}
            <input type="submit" className="submitSignup" value="S'inscrire" />
          </form>
        </section>
      </div>
      <div className={`background ${isActive ? "" : "active"}`}></div>
    </main>
  );
}

export default Login;
