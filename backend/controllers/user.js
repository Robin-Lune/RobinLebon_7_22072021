const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      return res.status(400).json({ message: "Le mot de passe doit être de 6 caractéres minimum!" });
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
     return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
    } else {
      bcrypt.compare(req.body.password, result[0].password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
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
