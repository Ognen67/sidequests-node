const db = require("../models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// User registration controller
async function register(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if user with email already exists
    const existingUser = await db.users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// User login controller
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await db.users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('user', user);

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Add location for user controller
async function addLocation(req, res) {
  try {
    const userId = req.userId; // Assuming userId is extracted from JWT middleware
    const { latitude, longitude, time } = req.body;

    // Create location
    const newLocation = await db.locations.create({
      latitude,
      longitude,
      time,
      UserId: userId, // Associate location with user
    });

    res.status(201).json({ message: 'Location added successfully', location: newLocation });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAllLocations(req, res) {
  try {
    const userId = req.userId; // Assuming userId is extracted from JWT middleware

    // Find all locations for the user
    const userLocations = await db.locations.findAll({ 
      where: { UserId: userId },
      order: [['time', 'DESC']], // Order by time in descending order
    });

    res.status(200).json({ locations: userLocations });
  } catch (error) {
    console.error('Error getting user locations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get last location for a user controller
async function getLastLocation(req, res) {
  try {
    const userId = req.userId; // Assuming userId is extracted from JWT middleware

    // Find the last location for the user
    const lastLocation = await db.locations.findOne({ 
      where: { UserId: userId },
      order: [['createdAt', 'DESC']], // Order by time in descending order
    });

    res.status(200).json({ lastLocation });
  } catch (error) {
    console.error('Error getting last user location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { register, login, addLocation, getAllLocations, getLastLocation };
