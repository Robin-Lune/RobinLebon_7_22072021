import React, { useState } from "react";
import axios from "axios";



const Poster = (infos) => {

    const [message, setMessage] = useState("");
    const [file, setFile] = useState();
    // console.log(infos)

    // upload image and visuaize it
const shwImage = document.getElementById('image-container');

const pictureLoad = (e) => {
    const efile = e.target.files[0];
    setFile(efile);
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
    if (file) console.log(file);
    console.log(message)
    const data = new FormData();
    if (file) data.append('image', file);
    data.append('message', message);
    data.append('userId', token.userId);


    await axios({
      method: "POST",
      url: "http://localhost:3500/api/posts/",
      data,
      })
      .then((res) => {
          console.log(res);
            window.location.href = "/"; //this is for redirecting to home page
      })
      .catch((err) => {
          console.log(err.response);
      });

    
        
  };

    return (
            <div className="poster">
            <form action="" onSubmit={handlePost}> 
                <div className="poster-header">
                    <div className="profil-picture">
                        <img src={infos.infos.imageprofile} alt="profil"/>
                    </div>
                    <input type="text" name="text-post" className="text-post" placeholder={`exprimez-vous ${infos.infos.prenom} `} onChange={(e) => setMessage(e.target.value)}/>
                </div>
                <div className="poster-footer">
                    <input type="file" id="imageUpload" name="picture"  accept="image/png, image/jpeg, image/gif" onChange={pictureLoad}  />
                    <div id="image-container"></div>
                </div>
                <input type="submit" id="submit-post" />
            </form>
        </div>

    );
};

export default Poster;