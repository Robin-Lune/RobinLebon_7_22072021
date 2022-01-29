
const dbc = require("../db");
const db = dbc.getDB();

exports.getAllPosts = (req, res, next) => {
    const sql = "SELECT * FROM post ORDER BY datecreation DESC;";
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
    if (req.body.file){console.log(req.body.file);}
    
  };