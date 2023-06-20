const express = require('express')
const authControllerAPI = require('../controllers/ath-controller-api')
const router = express.Router();

router.post('/login', authControllerAPI.login);
router.delete('/logout', authControllerAPI.logout);

module.exports = router;