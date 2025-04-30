const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const {protect} = require('../middleware/authMiddleware');

router.get('/stats/:userId', protect, userController.getUserStats);
router.put('/update/avatar', protect, userController.changeAvatar);
module.exports = router;