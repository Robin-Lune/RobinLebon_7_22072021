import React, { useEffect, useState } from "react";
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


  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');
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
    <div>
      {/* {localStorage.token ? <Header /> <Postes /> : <div>Vous n'êtes pas connecté</div>} */}
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
         />
      <div className="home-container">
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
      </div>
    </div>
  );
};

export default Home;
