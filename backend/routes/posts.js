const express = require("express");
const router = express.Router();
const postsCtrl = require ('../controllers/posts');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')

router.get("/", auth, postsCtrl.getAllPosts);
router.post("/", auth,multer,postsCtrl.createPost);
router.get("/:id", auth, postsCtrl.getOnePostComments);
router.get("/:id", auth, postsCtrl.getOnePost);
// router.put("/:id", auth, multer, sauceCtrl.modifySauce);
// router.delete("/:id", auth, sauceCtrl.deleteSauce);
 router.get('/:id/like', auth, postsCtrl.getLikePost);
 router.post('/:id/like', auth, postsCtrl.likePost);



module.exports = router;