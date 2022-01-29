import React, { useEffect, useState } from "react";
import Header from "../components/header";
import axios from "axios";
import Postes from "../components/post";

const Home = () => {
  useEffect(() => {
    getPosts();
  }, []);
  const [message, setMessage] = useState("");
  let [file, setFile] = useState();
  const [posts, setPosts] = useState([]);
// Call API to get posts
if (localStorage.token) {
    let token = JSON.parse(localStorage.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.token}`;
  }
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


// upload image and visuaize it
const shwImage = document.getElementById('image-container');

const pictureLoad = (e) => {
    const efile = e.target.files[0];
    setFile = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        const img = document.createElement('img');
        if (document.getElementById('my-image')) {
            shwImage.removeChild(document.getElementById('my-image'));
        }
        img.id = 'my-image';
        img.src = dataUrl;
        shwImage.appendChild(img);
    }
    reader.readAsDataURL(efile);

};

//  save Post in database
const handlePost = async (e) => {
    e.preventDefault();
    let token = JSON.parse(localStorage.token);
    console.log(file);
    const data = new FormData();

    if (file) data.append('file', file);
    data.append('message', message);
    data.append("userId", token.userId);
     await axios({
        method: "POST",
        url: "http://localhost:3500/api/posts/",
        data,
        
        })
        .then((res) => {
            console.log(res);
            //   window.location.href = "/"; //this is for redirecting to home page
        })
        .catch((err) => {
            console.log(err);
        });
    
        
  };

  const nom = 'Robin'; 

  return (
    <div>
      {/* {localStorage.token ? <Header /> <Postes /> : <div>Vous n'êtes pas connecté</div>} */}
      <Header />
      <div className="home-container">
        <div className="poster">
            <form action="" onSubmit={handlePost}> 
                <div className="poster-header">
                    <div className="profil-picture">
                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="profil"/>
                    </div>
                    <input type="text" name="text-post" className="text-post" placeholder={`exprimez-vous ${nom}`} onChange={(e) => setMessage(e.target.value)}/>
                </div>
                <div className="poster-footer">
                    <input type="file" id="imageUpload" name="picture"  accept="image/png, image/jpeg, image/gif" onChange={pictureLoad} />
                    <div id="image-container"></div>
                </div>
                <input type="submit" id="submit-post" />
            </form>
        </div>


        {posts.map((post) => (
          <Postes
            key={post.id}
            id={post.datecreation}
            image={post.imageurl}
            message={post.message}
            date={post.datecreation}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
