import axios from "axios";

// Call API to get ALL posts
const getAllPosts = async (setPosts,posts) => {
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

