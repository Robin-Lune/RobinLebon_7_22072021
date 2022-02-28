const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const crypto = require('crypto');

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
            UID: crypto.randomUUID(),
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
          userId: result[0].UID,
          token: jwt.sign({ userId: result[0].UID }, process.env.TOKEN, {
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
  const sql = `SELECT nom, prenom,email, imageprofile,UID, admin FROM utilisateur WHERE UID='${userId}'`;

    if (userId !== req.params.id) {
      return res.status(401).json({ error: " TOKEN invalide, requête non autorisé !" });
    } else {
      let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
      });
    }
};

exports.getUserPosts = (req, res, next) => {
  const userId = req.params.id;
  const sql = `SELECT post.id, message , post_user.nom, post_user.prenom,post_user.imageProfile, datecreation,imageurl, post.utilisateur_id, COUNT(DISTINCT like_post.id) AS total_like, com.commentaire, com.utilisateur_id AS comm_uid, com.datecreation_comm, com.id AS comm_id, COUNT(DISTINCT comments.id) AS total_comm , comm_user.nom AS comm_nom, comm_user.prenom AS comm_prenom, comm_user.imageProfile AS comm_picture  FROM post JOIN utilisateur AS post_user ON (post.utilisateur_id = post_user.UID) LEFT JOIN like_post ON (post.id = lp_post_id) LEFT JOIN comments ON (comments.post_id = post.id) LEFT JOIN comments AS com ON com.id = (SELECT com.id FROM comments AS com WHERE com.post_id = post.id ORDER BY com.datecreation_comm DESC LIMIT 1) LEFT JOIN utilisateur AS comm_user ON( comm_user.UID = com.utilisateur_id) WHERE post.utilisateur_id = '${userId}' GROUP BY post.id  ORDER BY datecreation DESC ;`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
  console.log(userId);
};

exports.modifyUser = (req, res, next) => {
  const userPageId = req.params.id;
  const userId = req.auth.userId;
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;
  const file = req.file;
  const sqlInfos = `SELECT nom,prenom,UID,email,imageProfile FROM utilisateur WHERE UID='${userPageId}'`;
  const sqlAdminInfos = `SELECT admin FROM utilisateur WHERE UID='${userId}'`;
  let adminCheckout = null;

  let query = db.query(sqlAdminInfos, (err, result) => {
    if (err) throw err;
    adminCheckout = result[0].admin;
    let query = db.query(sqlInfos, (err, result) => {
      if (err) throw err;
      if (userId === `${result[0].UID}` || adminCheckout === 1) {
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
          const sql = `UPDATE utilisateur SET ? WHERE UID='${userPageId}'`;
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
          const sql = `UPDATE utilisateur SET ? WHERE UID='${userPageId}'`;
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
      } else {
        return res.status(403).json({ error: "Accès refusé" });
      }
    });
  });
};

exports.deleteUser = (req, res, next) => {
  const userPageId = req.params.id;
  const userId = req.auth.userId;
  const admin = req.body.admin;
  const sqlInfos = `SELECT UID ,imageProfile FROM utilisateur WHERE UID='${userPageId}'`;
  const sqlAdminInfos = `SELECT admin FROM utilisateur WHERE UID='${userId}'`;
  let adminCheckout = null;

  let query = db.query(sqlAdminInfos, (err, result) => {
    if (err) throw err;
    adminCheckout = result[0].admin;
    let query = db.query(sqlInfos, (err, result) => {
      if (err) throw err;
      if (userId === result[0].UID || adminCheckout === 1) {
        const oldFileName = result[0].imageProfile.split("/images/profils/")[1];

        if (oldFileName !== "avatar.png") {
          fs.unlink(`images/profils/${oldFileName}`, () => {
            if (err) console.log(err);
            else {
              console.log("Image de profile supprimée");
            }
          });
        }

        const sql = `DELETE u.*,p.*, c.*,l.* FROM utilisateur u LEFT JOIN post p ON(p.utilisateur_id = u.UID) LEFT JOIN comments c ON(c.utilisateur_id = u.UID) LEFT JOIN like_post l ON (l.lp_utilisateur_id = u.UID) WHERE u.UID = '${userPageId}';`;
        let query = db.query(sql, (err, result) => {
          if (err) throw err;
          res.status(200).json({ message: "Utilisateur supprimé!" });
          console.log("utilisateur supprimé");
        });
      } else {
        return res.status(403).json({ error: "Accès refusé" });
      }
    });
  });
  console.log(`userId: ${userId} admin: ${admin} userPageId: ${userPageId}`);
};
