const expresss = require('express');
const router = expresss.Router();
const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', userController.user_signup);
router.post('/register', userController.userCreate);

router.post('/login', userController.user_login);
router.post('/signin', userController.userLogin);

// router.delete('/:userId', checkAuth, userController.user_delete );
router.delete('/:userId', checkAuth, userController.userRemove );

module.exports = router;