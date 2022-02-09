const dbc = require("../db");
const db = dbc.getDB();

// POST LOGIC
exports.getAllPosts = (req, res, next) => {
  const sql =
    "SELECT post.id, message , post_user.nom, post_user.prenom,post_user.imageProfile, datecreation,imageurl, post.utilisateur_id, COUNT(DISTINCT like_post.id) AS total_like, comments.commentaire, comments.utilisateur_id AS comm_uid, comments.datecreation_comm, comments.id AS comm_id, COUNT(DISTINCT comments.id) AS total_comm , comm_user.nom AS comm_nom, comm_user.prenom AS comm_prenom, comm_user.imageProfile AS comm_picture  FROM post JOIN utilisateur AS post_user ON (post.utilisateur_id = post_user.id) LEFT JOIN like_post ON (post.id = lp_post_id)  LEFT JOIN comments ON (comments.post_id = post.id) LEFT JOIN utilisateur AS comm_user ON( comm_user.id = comments.utilisateur_id) GROUP BY post.id ORDER BY datecreation DESC;";
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

exports.deletePost = (req, res, next) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  const admin = req.body.admin;
  if (admin === 1) {
    const sql = `DELETE p.*, c.*,l.* FROM post p LEFT JOIN comments c ON(c.post_id = p.id) LEFT JOIN like_post l ON (l.lp_post_id = p.id) WHERE p.id = ${postId};`;
    db.query(sql, (err, result) => {
      if (err) {
        res.status(404).json({ err });
        throw err;
      }
      res.status(200).json({ message: "Poste supprimé!" });
      console.log("Poste supprimé!");
    });
  } else {
    const sql = "SELECT * FROM post WHERE id = ? ;";
    db.query(sql, [postId], (err, result) => {
      if (err) {
        res.status(404).json({ err });
        throw err;
      } else if (result[0].utilisateur_id !== userId) {
        res
          .status(401)
          .json({ message: "Vous n'avez pas le droit de supprimer ce post" });
      } else {
        const sql = `DELETE p.*, c.*,l.* FROM post p LEFT JOIN comments c ON(c.post_id = p.id) LEFT JOIN like_post l ON (l.lp_post_id = p.id) WHERE p.id = ${postId};`;
        db.query(sql, (err, result) => {
          if (err) {
            res.status(404).json({ err });
            throw err;
          }
          res.status(200).json({ message: "Poste supprimé!" });
          console.log("Poste supprimé!");
        });
      }
    });
  }
};

exports.modifyPost = (req, res, next) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  const admin = req.body.admin;
  if (admin === 1) {
    const sql = `UPDATE post SET message = ? WHERE id = ${postId};`;
    db.query(sql, [req.body.message], (err, result) => {
      if (err) {
        res.status(404).json({ err });
        throw err;
      }
      res.status(200).json({ message: "Poste modifié!" });
      console.log("Poste modifié!");
    });
  } else {
    const sql = "SELECT * FROM post WHERE id = ? ;";
    db.query(sql, [postId], (err, result) => {
      if (err) {
        res.status(404).json({ err });
        throw err;
      } else if (result[0].utilisateur_id !== userId) {
        res.status(401).json({ message: "Vous n'avez pas le droit de modifier ce post" });
      } else {
        const sql = `UPDATE post SET message = ? WHERE id = ${postId};`;
        db.query(sql, [req.body.message], (err, result) => {
          if (err) {
            res.status(404).json({ err });
            throw err;
          }
          res.status(200).json({ message: "Poste modifié!" });
          console.log("Poste modifié!");
        });
      }
    });
  }
};




// COMMENT LOGIC

exports.getComments = (req, res, next) => {
  const sql =
    "SELECT comments.id AS comm_id, commentaire, utilisateur_id, datecreation_comm, nom, prenom, imageProfile FROM comments JOIN utilisateur ON (utilisateur.id = comments.utilisateur_id) WHERE post_id = ? ORDER BY datecreation_comm DESC;";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.createComment = (req, res, next) => {
  const newComment = {
    commentaire: req.body.commentaire,
    utilisateur_id: req.body.userId,
    post_id: req.body.postId,
  };
  const sql = "INSERT INTO comments SET ?";
  db.query(sql, newComment, (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: "Commentaire créé!" });
  });
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.id;
  const userId = req.body.userId;
  const admin = req.body.admin;
  if (admin === 1) {
    const sql = `DELETE FROM comments WHERE id = ${commentId};`;
    db.query(sql, (err, result) => {
      if (err) {
        res.status(404).json({ err });
        throw err;
      }
      res.status(200).json({ message: "Poste supprimé!" });
      console.log("Poste supprimé!");
    });
  } else {
    const sql = "SELECT * FROM comments WHERE id = ? ;";
    db.query(sql, [commentId], (err, result) => {
      if (err) {
        res.status(404).json({ err });
        throw err;
      } else if (result[0].utilisateur_id !== userId) {
        res
          .status(401)
          .json({ message: "Vous n'avez pas le droit de supprimer ce post" });
      } else {
        const sql = `DELETE FROM comments WHERE id = ${commentId};`;
        db.query(sql, (err, result) => {
          if (err) {
            res.status(404).json({ err });
            throw err;
          }
          res.status(200).json({ message: "Poste supprimé!" });
          console.log("Poste supprimé!");
        });
      }
    });
  }
};

// LIKE LOGIC

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
