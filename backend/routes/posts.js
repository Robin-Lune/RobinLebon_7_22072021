const express = require("express");
const router = express.Router();
const postsCtrl = require("../controllers/posts");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

router.get("/", auth, postsCtrl.getAllPosts);
router.post("/", auth, multer.single("image"), postsCtrl.createPost);
router.put("/:id", auth, multer.single("image"), postsCtrl.modifyPost);
router.delete("/:id", auth, postsCtrl.deletePost);

router.get("/:id/comments", auth, postsCtrl.getComments);
router.post("/:id/comments", auth, postsCtrl.createComment);
router.delete("/comments/:id", auth, postsCtrl.deleteComment);

router.get("/:id/like", auth, postsCtrl.getLikePost);
router.post("/:id/like", auth, postsCtrl.likePost);

module.exports = router;
