const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');


const UserController = require('../controllers/user');
router.post('/signup', UserController.user_signup);

router.post('/login', UserController.login_all);


router.delete('/:userId', checkAuth, UserController.delete_login_all);






module.exports = router;