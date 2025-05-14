const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);           // obtener todos los usuarios
router.get('/:id', userController.getUserById);       // obtener un usuario por ID
router.post('/', userController.createUser);          // crear un nuevo usuario
router.put('/:id', userController.updateUser);        // actualizar un usuario
router.delete('/:id', userController.deleteUser);     // eliminar un usuario

router.post('/login', userController.loginUser); // ruta login

module.exports = router;
