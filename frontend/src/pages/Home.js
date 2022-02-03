import React, { useEffect, useState } from "react";
import Header from "../components/header";
import axios from "axios";
import Postes from "../components/post";
import Poster from "../components/poster";

const Home = () => {
  useEffect(() => {
    getUser();
    getPosts();
  }, []);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);

  // Set header Authorization with the token in the local storage
  if (localStorage.token) {
    let token = JSON.parse(localStorage.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.token}`;
  }

  // Call API to get posts
  const getPosts = async () => {
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
        {/* <div className="poster">
            <form action="" onSubmit={handlePost}> 
                <div className="poster-header">
                    <div className="profil-picture">
                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="profil"/>
                    </div>
                    <input type="text" name="text-post" className="text-post" placeholder={`exprimez-vous ${user.prenom}`} onChange={(e) => setMessage(e.target.value)}/>
                </div>
                <div className="poster-footer">
                    <input type="file" id="imageUpload" name="picture"  accept="image/png, image/jpeg, image/gif" onChange={pictureLoad}  />
                    <div id="image-container"></div>
                </div>
                <input type="submit" id="submit-post" />
            </form>
        </div> */}

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
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
