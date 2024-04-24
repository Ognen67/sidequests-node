const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');
const verifyToken = require('../middleware/authMiddleware.js');

// POST /api/users/register
router.post('/register', UserController.register);

// POST /api/users/login
router.post('/login', UserController.login);

// POST /api/users/addLocation
router.post('/locations', verifyToken, UserController.addLocation);

// GET /api/users/getAllLocations
router.get('/locations', verifyToken, UserController.getAllLocations);

// GET /api/users/getLastLocation
router.get('/locations-last', verifyToken, UserController.getLastLocation);

module.exports = router;
