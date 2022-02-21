import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import axios from "axios";
import Posts from "../components/post";
import Poster from "../components/poster";

const Home = () => {
  if (localStorage.token === undefined) {
    window.location.href = "/login";
  };
  useEffect(() => {
    getUser();
    getAllPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const token = JSON.parse(localStorage.token);

  const filterPosts = (posts, query) => {
    if (!query) {
        return posts;
    }

    return posts.filter((post) => {
        const postName = post.nom.toLowerCase();
        const postPrenom = post.prenom.toLowerCase();
        const postMessage = post.message.toLowerCase();

        return (
            postName.includes(query) ||
            postPrenom.includes(query) ||
            postMessage.includes(query)
        );

    });
};

//  console.log(window.location.origin);
  const { search } = window.location;
  const query = new URLSearchParams(search).get('search');
  const [searchQuery, setSearchQuery] = useState(query || "");
  const filteredPosts = filterPosts(posts, searchQuery);




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
        // console.log(posts);
      })
      .catch((err) => {
        window.location.href = "/login";
      });
  };

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

  return (
    <main>
      <Helmet>
        <title>Accueil</title>
        <meta name="description" content="Page d'accueil de la palteforme Groupomania" />
        {/* FACEBOOK */}
        <meta property="og:title" content="Accueil Groupomania" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://localhost:3000/login" />
        <meta property="og:description" content="Page d'accueil de la palteforme Groupomania" />
        {/* TWITTER */}
        <meta name="twitter:title" content="Accueil Groupomania" />
        <meta name="twitter:description" content="Page d'accueil de la palteforme Groupomania" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@Groupomania_Robin_LEBON" />
        <meta name="twitter:creator" content="@Groupomania_Robin_LEBON" />
      </Helmet>
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
         />
      <section className="home-container">
        <h1 className="inactive">Bienvenue sur Groupomania</h1>
        <Poster infos={user} />

        {filteredPosts.map(post => (
          <Posts
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
    </main>
  );
};

export default Home;
