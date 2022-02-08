const express = require("express");
const router = express.Router();
const postsCtrl = require ('../controllers/posts');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')

router.get("/", auth, postsCtrl.getAllPosts);
router.post("/", auth,multer,postsCtrl.createPost);
router.get("/:id", auth, postsCtrl.getOnePost);
router.get("/:id/comments", auth, postsCtrl.getComments);
router.post("/:id/comments", auth, postsCtrl.createComment);
// router.put("/:id", auth, multer, postsCtrl.modifyPost);
// router.delete("/:id", auth, postsCtrl.deletePost);
 router.get('/:id/like', auth, postsCtrl.getLikePost);
 router.post('/:id/like', auth, postsCtrl.likePost);



module.exports = router;