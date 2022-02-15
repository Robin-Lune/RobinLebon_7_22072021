const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id',auth, userCtrl.getUser);
router.put('/:id', auth, multer.single('profil_image'), userCtrl.modifyUser);
router.get('/:id/posts',auth,  userCtrl.getUserPosts);

module.exports = router;