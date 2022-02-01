const dbc = require("../db");
const db = dbc.getDB();

exports.getAllPosts = (req, res, next) => {
  const sql = "SELECT post.id, message , nom , prenom,imageProfile, datecreation,imageurl, utilisateur_id FROM post JOIN utilisateur ON (utilisateur_id = utilisateur.id) ORDER BY datecreation DESC;";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.getOnePostComments = (req, res, next) => {
  const postId = req.params.id;
  const sql = `SELECT commentaire, datecreation_comm, nom,prenom,imageProfile FROM comments JOIN utilisateur ON(utilisateur.id = utilisateur_id)  WHERE post_id =  ${postId};`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};
exports.getOnePost = (req, res, next) => {
  const postId = req.params.id;
  const sql = `SELECT * FROM posts WHERE post_id =  ${postId};`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};



exports.createPost = (req, res, next) => {
  console.log(req.body.message);
  console.log(req.body.userId);

  if (req.file) {
    console.log(req.file);

    const imageurl = `${req.protocol}://${req.get("host")}/images/posts/${
      req.file.filename
    }`;

    console.log(imageurl);
    const newPostImage = {
      message: req.body.message,
      utilisateur_id: req.body.userId,
      imageurl: imageurl,
    };
    const sql = "INSERT INTO post SET ?";
    db.query(sql, newPostImage, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "Poste créé!" });
    });
    return;
  }
  const newPost = {
    message: req.body.message,
    utilisateur_id: req.body.userId,
    imageurl: null,
  };

  const sql = "INSERT INTO post SET ?";
  db.query(sql, newPost, (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: "Poste créé!" });
  });
};


exports.getLikePost = (req, res, next) => {
  const postId = req.params.id;
  const sql = `SELECT lp_utilisateur_id FROM like_post WHERE lp_post_id = ${postId};`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};


exports.likePost = (req, res, next) => {

  const postId = req.params.id;
  const userId = req.body.userId;
 
  const sql = `SELECT * FROM like_post WHERE lp_post_id = ${postId} AND lp_utilisateur_id = ${userId};`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    if (result.length === 0) {
      const newLike = {
        lp_post_id: postId,
        lp_utilisateur_id: userId,
      };
      const sql = "INSERT INTO like_post SET ?";
      db.query(sql, newLike, (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Poste liké!" });
      });
    } else {
      const sql = `DELETE FROM like_post WHERE lp_post_id = ${postId} AND lp_utilisateur_id = ${userId};`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Poste déliké!" });
      });
    }
  });

};