const express = require('express');
const router = express.Router();
const teacherLoginController = require('../controllers/teacherlogin');

router.post('/register', teacherLoginController.user_register);
router.post('/login', teacherLoginController.user_login);
router.delete('/account/:email', teacherLoginController.delete_account);
router.get('/profile/:email', teacherLoginController.get_profile);
router.put('/profile/:email', teacherLoginController.update_profile);

module.exports = router; 