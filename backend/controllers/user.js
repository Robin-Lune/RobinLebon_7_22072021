const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const dbc = require("../db");
const db = dbc.getDB();

exports.signup = (req, res, next) => {
  console.log(req.body);
  const pwd = req.body.password;
  const email = req.body.email;
  const sql = `SELECT email FROM utilisateur WHERE email=?`;
  let query = db.query(sql, email, async (err, result) => {
    if (err) throw err;

    if (result.length === 1) {
      return res.status(400).json({ error: "Utilisateur déja existant !" });
    }
    if (pwd.length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit être de 6 caractéres minimum!",
      });
    } else {
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const newUser = {
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            password: hash,
          };
          let sql = "INSERT INTO utilisateur SET ?";
          let query = db.query(sql, newUser, (err, result) => {
            if (err) throw err;
            console.log(result);
            res.status(201).json({ message: "Utilisateur créé!" });
          });
        })
        .catch((error) => res.status(500).json({ error }));
    }
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const sql = `SELECT * FROM utilisateur WHERE email=?`;
  let query = db.query(sql, email, async (err, result) => {
    if (err) throw err;
    console.log(err);
    console.log(result);
    if (result.length === 0) {
      return res
        .status(401)
        .json({ error: "Identifiant ou mot de passe incorrect" });
    } else {
      bcrypt.compare(req.body.password, result[0].password).then((valid) => {
        if (!valid) {
          return res
            .status(401)
            .json({ error: "Identifiant ou mot de passe incorrect" });
        }
        res.status(200).json({
          userId: result[0].id,
          token: jwt.sign({ userId: result[0].id }, process.env.TOKEN, {
            expiresIn: "24h",
          }),
        });
        console.log("utilisateur connecté");
      });
    }
  });
};

exports.getUser = (req, res, next) => {
  const userId = req.params.id;
  const sql = `SELECT nom, prenom,email, imageprofile,id, admin FROM utilisateur WHERE id=${userId}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
};

exports.getUserPosts = (req, res, next) => {
  const userId = req.params.id;
  const sql = `SELECT post.id, message ,datecreation,imageurl, COUNT(DISTINCT like_post.id) AS total_like, comments.commentaire, comments.utilisateur_id AS comm_uid, comments.datecreation_comm, comments.id AS comm_id, COUNT(DISTINCT comments.id) AS total_comm , comm_user.nom AS comm_nom, comm_user.prenom AS comm_prenom, comm_user.imageProfile AS comm_picture  FROM post LEFT JOIN like_post ON (post.id = lp_post_id)  LEFT JOIN comments ON (comments.post_id = post.id) LEFT JOIN utilisateur AS comm_user ON( comm_user.id = comments.utilisateur_id) WHERE post.utilisateur_id = ${userId} GROUP BY post.id  ORDER BY datecreation DESC ;`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
  console.log(userId);
};

exports.modifyUser = (req, res, next) => {
  const userPageId = req.params.id;
  const userId = req.body.userId;
  const admin = req.body.admin;
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;
  const file = req.file;
  const sqlInfos = `SELECT nom,prenom,id,email,imageProfile FROM utilisateur WHERE id=${userPageId}`;

  if (admin === "1") {
    console.log("admin");
    db.query(sqlInfos, (err, result) => {
      if (err) throw err;

      if (file) {
        const new_profil_image_url = `${req.protocol}://${req.get(
          "host"
        )}/images/profils/${req.file.filename}`;
        oldFileName = result[0].imageProfile.split("/images/profils/")[1];
        if (oldFileName !== "avatar.png") {
          fs.unlink(`images/profils/${oldFileName}`, () => {
            if (err) console.log(err);
            else {
              console.log("Ancienne image de profile supprimée");
            }
          });
        }
        const newUserInfos = {
          nom: nom,
          prenom: prenom,
          email: email,
          imageProfile: new_profil_image_url,
        };
        const sql = `UPDATE utilisateur SET ? WHERE id=${userPageId}`;
        let query = db.query(sql, newUserInfos, (err, result) => {
          if (err) {
            res.status(500).json({
              error: "Erreur lors de la modification de l'utilisateur",
            });
            throw err;
          }
          res.status(200).json({ message: "Utilisateur modifié!" });
          console.log("utilisateur modifié");
        });
      } else {
        const newUserInfos = {
          nom: nom,
          prenom: prenom,
          email: email,
        };
        const sql = `UPDATE utilisateur SET ? WHERE id=${userPageId}`;
        let query = db.query(sql, newUserInfos, (err, result) => {
          if (err) {
            res.status(500).json({
              error: "Erreur lors de la modification de l'utilisateur",
            });
            throw err;
          }
          res.status(200).json({ message: "Utilisateur modifié!" });
          console.log("utilisateur modifié");
        });
      }
    });
  } else {
    console.log("user");
    db.query(sqlInfos, (err, result) => {
      if (err) throw err;
      else if (`${result[0].id}` !== `${userId}`) {
        res.status(401).json({ error: "Vous n'avez pas le droit" });
        return;
      } else {
        if (file) {
          const new_profil_image_url = `${req.protocol}://${req.get(
            "host"
          )}/images/profils/${req.file.filename}`;
          oldFileName = result[0].imageProfile.split("/images/profils/")[1];
          if (oldFileName !== "avatar.png") {
            fs.unlink(`images/profils/${oldFileName}`, () => {
              if (err) console.log(err);
              else {
                console.log("Ancienne image de profile supprimée");
              }
            });
          }
          const newUserInfos = {
            nom: nom,
            prenom: prenom,
            email: email,
            imageProfile: new_profil_image_url,
          };
          const sql = `UPDATE utilisateur SET ? WHERE id=${userPageId}`;
          let query = db.query(sql, newUserInfos, (err, result) => {
            if (err) {
              res.status(500).json({
                error: "Erreur lors de la modification de l'utilisateur",
              });
              throw err;
            }
            res.status(200).json({ message: "Utilisateur modifié!" });
            console.log("utilisateur modifié");
          });
        } else {
          const newUserInfos = {
            nom: nom,
            prenom: prenom,
            email: email,
          };
          const sql = `UPDATE utilisateur SET ? WHERE id=${userPageId}`;
          let query = db.query(sql, newUserInfos, (err, result) => {
            if (err) {
              res.status(500).json({
                error: "Erreur lors de la modification de l'utilisateur",
              });
              throw err;
            }
            res.status(200).json({ message: "Utilisateur modifié!" });
            console.log("utilisateur modifié");
          });
        }
      }
    });
  }
};

exports.deleteUser = (req, res, next) => {
  const userPageId = req.params.id;
  const userId = req.body.userId;
  const admin = req.body.admin;
  const sqlInfos = `SELECT id ,imageProfile FROM utilisateur WHERE id=${userPageId}`;
  if (admin === 1) {
    console.log("admin");
    db.query(sqlInfos, (err, result) => {
      if (err) {
        res.status(500).json({
          error: "Erreur lors de la suppression de l'utilisateur",
        });
        throw err;
      }
      const sql = `DELETE u.*,p.*, c.*,l.* FROM utilisateur u LEFT JOIN post p ON(p.utilisateur_id = u.id) LEFT JOIN comments c ON(c.utilisateur_id = u.id) LEFT JOIN like_post l ON (l.lp_utilisateur_id = u.id) WHERE u.id = ${userPageId};`;
      let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Utilisateur supprimé!" });
        console.log("utilisateur supprimé");
      });
    });
  } else {
    console.log("user");
    db.query(sqlInfos, (err, result) => {
      if (err) {
        res.status(500).json({
          error: "Erreur lors de la suppression de l'utilisateur",
        });
        throw err;
      } else if (`${result[0].id}` !== `${userId}`) {
        res.status(401).json({ error: "Vous n'avez pas le droit" });
        return;
      } else {
        const sql = `DELETE u.*,p.*, c.*,l.* FROM utilisateur u LEFT JOIN post p ON(p.utilisateur_id = u.id) LEFT JOIN comments c ON(c.utilisateur_id = u.id) LEFT JOIN like_post l ON (l.lp_utilisateur_id = u.id) WHERE u.id = ${userPageId};`;
        let query = db.query(sql, (err, result) => {
          if (err) throw err;
          res.status(200).json({ message: "Utilisateur supprimé!" });
          console.log("utilisateur supprimé");
        });
      }
    });
  }
  console.log(`userId: ${userId} admin: ${admin} userPageId: ${userPageId}`);
};
