import React from 'react';


function Login() {



  return <div className='mainContainer'>
      <img src="./ressources/icon-above-font.png" alt="" />
        <div className='loginContainer'>
            <form action="">
                <label for=""> Email </label>
                <input type="text" placeholder="Email" />
                <label for="" > Mot de passe </label>
                <input type="password" placeholder="Password" />
                
                <button type="submit">Login</button>
            </form>
            <hr />
            <div className='signupContainer'>
                <p>Pas encore inscrit ?</p>
                <a className='signupLink'>S'inscrire</a>
            </div>
        </div>
       
  </div>;
}

export default Login;
