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

const deleteImage = () => {
    setFile(undefined);
    shwImage.removeChild(document.getElementById('my-image'));
};

//  save Post in database
const handlePost = async (e) => {
    e.preventDefault();
    if (file) console.log(file);
    console.log(message)
    const data = new FormData();
    if (file) data.append('image', file);
    data.append('message', message);


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
                        <img src={infos.infos.imageprofile} alt="profil" className="profil-picture"/>
                        <label htmlFor="text-post" className="inactive">Message de la pàublication</label>
                    <input type="text" name="text-post" className="text-post" id="text-post" placeholder={`exprimez-vous ${infos.infos.prenom} `} onChange={(e) => setMessage(e.target.value)}/>
                </div>
                <div className="poster-footer">
                    <label htmlFor="file-input-poster">
                    <i className="fa-solid fa-file-arrow-up"></i>
                    <p>Importer une image</p>

                    </label>
                        <input type="file" id="file-input-poster" name="image"  accept="image/png, image/jpeg, image/gif" onChange={pictureLoad}  />
                  
                    <div id="image-container"></div>
                </div>
                { file ? <p className="delete" onClick={deleteImage}>Supprimer l'image</p> : null }
                
                <button type="submit" id="submit-post" disabled={message === "" && file === undefined }>
                Envoyer
                </button>
            </form>
        </div>

    );
};

export default Poster;