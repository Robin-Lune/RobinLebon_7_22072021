import React, { useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

function Login() {
  const [isActive, setActive] = useState("false");

  const handleToggle = () => {
    setActive(!isActive);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    passwordError.innerHTML = "";
    emailError.innerHTML = "";
    await axios({
      method: "POST",
      url: "http://localhost:3500/api/auth/signup",
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
  };
  const handleLogin = (e) => {
    e.preventDefault();

    const loginError = document.getElementById("loginError");

    axios({
      method: "POST",
      url: "http://localhost:3500/api/auth/login",
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
    <div className="mainContainer">
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Page de connexion de la palteforme Groupomania" />
        {/* FACEBOOK */}
        <meta property="og:title" content="Login Groupomania" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://localhost:3000/login" />
        <meta property="og:description" content="Page de connexion de la palteforme Groupomania" />
        {/* TWITTER */}
        <meta name="twitter:title" content="Login Groupomania" />
        <meta name="twitter:description" content="Page de connexion de la palteforme Groupomania" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@Groupomania_Robin_LEBON" />
        <meta name="twitter:creator" content="@Groupomania_Robin_LEBON" />
      </Helmet>

      <div className={`bgContainer ${isActive ? "" : "blured"}`}>
        <img src="./ressources/icon-above-font.png" alt="" />
        <div className="loginContainer">
          <form action="" onSubmit={handleLogin}>
            <label> Email </label>
            <input
              type="text"
              placeholder="Email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label> Mot de passe </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
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
        </div>
      </div>

      <div className={`signupPopup ${isActive ? "" : "active"}`}>
        <div className="close-icon" onClick={handleToggle}>
          <i className="far fa-times-circle"></i>
        </div>

        <div className="signupPopupContainer">
          <h2>Inscription</h2>
          <form action="" onSubmit={handleSignup}>
            <div className="headerpopup">
              <label htmlFor="Nom"></label>
              <input
                type="text"
                placeholder="Nom"
                name="nom"
                id="nom"
                onChange={(e) => setNom(e.target.value)}
              />
              <label htmlFor="Prenom"></label>
              <input
                type="text"
                placeholder="Prenom"
                name="prenom"
                id="prenom"
                onChange={(e) => setPrenom(e.target.value)}
              />
            </div>

            <label> Email </label>
            <input
              type="text"
              placeholder="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="error" id="emailError"></div>
            <label> Mot de passe </label>
            <input
              type="password"
              placeholder="Mot de passe"
              name="password1"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error" id="passwordError"></div>
            {/* <label for=""> Confirmer le mot de passe </label>
            <input type="password" placeholder=" Confirmer le mot de passe" name="password2" /> */}
            <input type="submit" className="submitSignup" value="S'inscrire" />
          </form>
        </div>
      </div>
      <div className={`background ${isActive ? "" : "active"}`}></div>
    </div>
  );
}

export default Login;
