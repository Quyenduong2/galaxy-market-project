const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../config/jwt');

router.get('/', auth, userController.getUsers); // Chỉ admin/user đăng nhập mới xem được
router.get('/', userController.getUsers);
router.delete('/:id', userController.deleteUser);
router.put('/:id', userController.updateUser);
router.put('/self/:id', userController.updateUserSelf);

module.exports = router;