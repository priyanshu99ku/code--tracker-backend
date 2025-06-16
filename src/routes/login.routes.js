const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');

// Login routes
router.post('/register', loginController.user_register);
router.post('/login', loginController.user_login);
router.delete('/account/:email', loginController.delete_account);

module.exports = router; 