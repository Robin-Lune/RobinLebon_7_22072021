const express = require("express");
const router = express.Router();
const postsCtrl = require ('../controllers/posts');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')

router.get("/", auth, postsCtrl.getAllPosts);
router.post("/", auth, multer,postsCtrl.createPost);
// router.get("/:id", auth, sauceCtrl.getOneSauce);
// router.put("/:id", auth, multer, sauceCtrl.modifySauce);
// router.delete("/:id", auth, sauceCtrl.deleteSauce);
// router.post('/:id/like', auth, sauceCtrl.likeSauce);



module.exports = router;