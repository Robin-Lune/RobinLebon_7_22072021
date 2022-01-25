import React, { useState } from "react";

function Login() {
    const [isActive, setActive] = useState("false");

    const handleToggle = () => {
        setActive(!isActive);
      };

  return (
    <div className="mainContainer">
      <div className={`bgContainer ${isActive ? "" : "blured"}`}>
        <img src="./ressources/icon-above-font.png" alt="" />
        <div className="loginContainer">
          <form action="">
            <label for=""> Email </label>
            <input type="text" placeholder="Email" />
            <label for=""> Mot de passe </label>
            <input type="password" placeholder="Password" />

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
          <i className="far fa-times-circle" ></i>
          </div>
      
        <div className="signupPopupContainer">
          <h2>Inscription</h2>
          <form action="">
            <div className="headerpopup">
              <label for="Nom"></label>
              <input type="text" placeholder="Nom" />
              <label for="Prenom"></label>
              <input type="text" placeholder="Prenom" />
            </div>

            <label for=""> Email </label>
            <input type="text" placeholder="Email" />
            <label for=""> Mot de passe </label>
            <input type="password" placeholder="Mot de passe" />
            <label for=""> Confirmer le mot de passe </label>
            <input type="password" placeholder=" Confirmer le mot de passe" />
            <button type="submit">S'inscrire</button>
          </form>
        </div>
      </div>
      <div className={`background ${isActive ? "" : "active"}`}></div>
    </div>
  );
}

export default Login;
