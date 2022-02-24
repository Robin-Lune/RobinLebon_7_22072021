const dbc = require("../db");
const db = dbc.getDB();
const fs = require("fs");
// const model_post = require("../models/post");

// POST LOGIC
exports.getAllPosts = (req, res, next) => {
  const sql =
    "SELECT post.id, message , post_user.nom, post_user.prenom,post_user.imageProfile, datecreation,imageurl, post.utilisateur_id, COUNT(DISTINCT like_post.id) AS total_like, com.commentaire, com.utilisateur_id AS comm_uid, com.datecreation_comm, com.id AS comm_id, COUNT(DISTINCT comments.id) AS total_comm , comm_user.nom AS comm_nom, comm_user.prenom AS comm_prenom, comm_user.imageProfile AS comm_picture  FROM post JOIN utilisateur AS post_user ON (post.utilisateur_id = post_user.UID) LEFT JOIN like_post ON (post.id = lp_post_id) LEFT JOIN comments ON (comments.post_id = post.id) LEFT JOIN comments AS com ON com.id = (SELECT com.id FROM comments AS com WHERE com.post_id = post.id ORDER BY com.datecreation_comm DESC LIMIT 1) LEFT JOIN utilisateur AS comm_user ON( comm_user.UID = com.utilisateur_id) GROUP BY post.id ORDER BY datecreation DESC;";
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
  console.log("Je suis le USERID du BODY :" + req.body.userId);
  console.log("JE SUIS LE USERID du TOKEN :"+req.auth.userId);

  if (req.file) {
    console.log(req.file);

    const imageurl = `${req.protocol}://${req.get("host")}/images/posts/${
      req.file.filename
    }`;

    console.log(imageurl);
    const newPostWithImage = {
      message: req.body.message,
      utilisateur_id: `${req.auth.userId}`,
      imageurl: imageurl,
    };
    const sql = "INSERT INTO post SET ?";
    db.query(sql, newPostWithImage, (err, result) => {
      if (err) throw err;
      res.status(200).json({ message: "Poste créé!" });
    });
    return;
  }
  const newPost = {
    message: req.body.message,
    utilisateur_id: `${req.auth.userId}`,
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
  const userId = req.auth.userId;
  const sqlAdminInfos = "SELECT admin FROM utilisateur WHERE UID = ? ;";
  let adminCheckout = null;
  const sqlInfos = "SELECT * FROM post WHERE id = ? ;";
  let filename = "";
  db.query(sqlAdminInfos, [userId], (err, result) => {
    if (err) throw err;
    adminCheckout = result[0].admin;

    db.query(sqlInfos, [postId], (err, result) => {
      if (err) {
        throw err;
      }
      if (result[0].imageurl) {
        filename = result[0].imageurl.split("/images/posts/")[1];
        console.log(filename);
      }
      if (userId === result[0].utilisateur_id || adminCheckout === 1) {
        const sql = `DELETE p.*, c.*,l.* FROM post p LEFT JOIN comments c ON(c.post_id = p.id) LEFT JOIN like_post l ON (l.lp_post_id = p.id) WHERE p.id = ${postId};`;
        db.query(sql, (err, result) => {
          if (err) {
            res.status(404).json({ err });
            throw err;
          }
          if (filename) {
            fs.unlink(`images/posts/${filename}`, () => {
              if (err) console.log(err);
              else {
                console.log("Image supprimée");
              }
            });
          }
          res.status(200).json({ message: "Poste supprimé!" });
          console.log("Poste supprimé!");
        });
      } else {
        return res.status(403).json({ error: "Accès refusé" });
      }
    });
  });
};

exports.modifyPost = (req, res, next) => {
  const postId = req.params.id;
  const userId = req.auth.userId;
  const postImage = req.file;
  const message = req.body.message;
  const sqlAdminInfos = "SELECT admin FROM utilisateur WHERE UID = ? ;";
  let adminCheckout = null;
  const sqlInfos = "SELECT * FROM post WHERE id = ? ;";
  let filename = "";
  const deleteImage = req.body.deleteImage;



  db.query(sqlAdminInfos, [userId], (err, result) => {
    if (err) {
      throw err;
    }
    adminCheckout = result[0].admin;
    console.log("admincheckout " + adminCheckout);
    db.query(sqlInfos, [postId], (err, result) => {
      if (err) throw err;
      if (userId === `${result[0].utilisateur_id}` || adminCheckout === 1) {
        if (postImage) {
          const imageurl = `${req.protocol}://${req.get("host")}/images/posts/${
            req.file.filename
          }`;
          if (result[0].imageurl !== null) {
            filename = result[0].imageurl.split("/images/posts/")[1];
            fs.unlink(`images/posts/${filename}`, () => {
              if (err) console.log(err);
              else {
                console.log("Ancienne image supprimée");
              }
            });
          }

          const newPostImage = {
            message: message,
            imageurl: imageurl,
          };
          const sql = `UPDATE post SET ? WHERE id = ${postId} ;`;
          db.query(sql, [newPostImage], (err, result) => {
            if (err) {
              res.status(404).json({ err });
              throw err;
            }
            res.status(200).json({ message: "Poste modifié!" });
            console.log("Poste modifié!");
          });
        } else if (deleteImage === "true" && result[0].imageurl !== null) {
          filename = result[0].imageurl.split("/images/posts/")[1];
          fs.unlink(`images/posts/${filename}`, () => {
            if (err) console.log(err);
            else {
              console.log("Image supprimée");
            }
          });
          const sql = `UPDATE post SET message = ? , imageurl = NULL  WHERE id = ${postId};`;
          db.query(sql, [message], (err, result) => {
            if (err) {
              res.status(404).json({ err });
              throw err;
            }
            res.status(200).json({ message: "Poste modifié!" });
            console.log("Poste modifié!");
          });
        } else {
          const sql = `UPDATE post SET message = ? WHERE id = ${postId};`;
          db.query(sql, [message], (err, result) => {
            if (err) {
              res.status(404).json({ err });
              throw err;
            }
            res.status(200).json({ message: "Poste modifié!" });
            console.log("Poste modifié!");
          });
        }
      } else {
        return res.status(403).json({ error: "Accès refusé" });
      }
    });
  });

  console.log(deleteImage);
};

// COMMENT LOGIC

exports.getComments = (req, res, next) => {
  const sql =
    "SELECT comments.id AS comm_id, commentaire, utilisateur_id, datecreation_comm, nom, prenom, imageProfile FROM comments JOIN utilisateur ON (utilisateur.UID = comments.utilisateur_id) WHERE post_id = ? ORDER BY datecreation_comm DESC;";
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
    utilisateur_id:`${req.auth.userId}`,
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
  const userId = req.auth.userId;
  const sqlAdminInfos = "SELECT admin FROM utilisateur WHERE UID = ? ;";
  const sqlInfos = "SELECT * FROM comments WHERE id = ? ;";
  let adminCheckout = null;
  db.query(sqlAdminInfos, [userId], (err, result) => {
    if(err) throw err;
    adminCheckout = result[0].admin;
    console.log(adminCheckout);
    db.query(sqlInfos, [commentId], (err, result) => {
      if (err) throw err;
      if (userId === result[0].utilisateur_id || adminCheckout === 1) {
        const sql = `DELETE FROM comments WHERE id = ${commentId};`;
        db.query(sql, (err, result) => {
          if (err) {
            res.status(404).json({ err });
            throw err;
          }
          res.status(200).json({ message: "Commentaire supprimé!" });
          console.log("Commentaire supprimé!");
        });
      } else {
        return res.status(403).json({ error: "Accès refusé" });
      }
    });
  });
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
  const userId = req.auth.userId;

  const sql = `SELECT * FROM like_post WHERE lp_post_id = '${postId}' AND lp_utilisateur_id = '${userId}';`;
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
      const sql = `DELETE FROM like_post WHERE lp_post_id = '${postId}' AND lp_utilisateur_id = '${userId}';`;
      db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Poste déliké!" });
      });
    }
  });
};
