import React, { useEffect, useState } from "react";
import Header from "../components/header";
import axios from "axios";
import Postes from "../components/post";
import Poster from "../components/poster";

const Home = () => {
  useEffect(() => {
    getUser();
    getAllPosts();
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);

  // Set header Authorization with the token in the local storage
  if (localStorage.token) {
    let token = JSON.parse(localStorage.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.token}`;
  }

  // Call API to get ALL posts
const getAllPosts = async () => { 
  await axios({
    method: "GET",
    url: "http://localhost:3500/api/posts/",
  })
    .then((res) => {
      setPosts(res.data);
      console.log(posts);
    })
    .catch((err) => {
      window.location.href = "/login";
    });
};

  //get User infos
  const getUser = async () => {
    const token = JSON.parse(localStorage.token);
    await axios({
      method: "GET",
      url: `http://localhost:3500/api/auth/${token.userId}`,
    })
      .then((res) => {
        console.log(res.data[0]);
        setUser(res.data[0]);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

 
  return (
    <div>
      {/* {localStorage.token ? <Header /> <Postes /> : <div>Vous n'êtes pas connecté</div>} */}
      <Header />
      <div className="home-container">
       

        <Poster infos={user}  />
      

        {posts.map((post) => (
          <Postes

            key={post.datecreation}
            id={post.id}
            image={post.imageurl}
            message={post.message}
            date={post.datecreation}
            u_id={post.utilisateur_id}
            author={`${post.nom} ${post.prenom}`}
            authorPicture={post.imageProfile}
            admin={user.admin}
            totalLikes={post.total_like}
            totalComm = {post.total_comm}
            dateComm = {post.datecreation_comm}   
            lastComm = {post.commentaire}         
            Comm_nom = {post.comm_nom} 
            Comm_prenom = {post.comm_prenom}
            Comm_picture = {post.comm_picture} 
            Comm_uid = {post.comm_uid}
            infos={user}
          /> 
        ))}
      </div>
    </div>
  );
};

export default Home;
