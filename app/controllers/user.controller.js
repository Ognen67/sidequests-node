const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const calculateDistance= require("../helpers/distance.helper");

// User registration controller
async function register(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if user with email already exists
    const existingUser = await db.users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.users.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      totalDistance: 0,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// User login controller
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await db.users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("user", user);

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
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
      UserId: userId,
    });

    res.status(201).json({ message: 'Location added successfully', location: newLocation });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// async function addLocation(req, res) {
//   try {
//     const userId = req.userId; // Assuming userId is extracted from JWT middleware
//     const { latitude, longitude, time } = req.body;

//     // Retrieve the user's last location
//     const lastLocation = await db.locations.findOne({
//       where: { UserId: userId },
//       order: [["time", "DESC"]],
//     });

//     const user = await db.users.findOne({ where: { userId } });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     let totalDistance = 0;
//     if (lastLocation) {
//       // Calculate the distance from the last location to the new location
//       const distance = calculateDistance(
//         lastLocation.latitude,
//         lastLocation.longitude,
//         latitude,
//         longitude
//       );
//       totalDistance = user.totalDistance + distance;
//     }

//     // Create location
//     const newLocation = await db.locations.create({
//       latitude,
//       longitude,
//       time,
//       UserId: userId,
//       totalDistance, // Assuming you have a column for totalDistance in your locations table
//     });

//     // Update the user's total distance
//     await db.users.update(
//       {
//         totalDistance: totalDistance,
//       },
//       {
//         where: { id: userId },
//       }
//     );

//     res
//       .status(201)
//       .json({ message: "Location added successfully", location: newLocation });
//   } catch (error) {
//     console.error("Error adding location:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

async function getAllLocations(req, res) {
  try {
    const userId = req.userId; // Assuming userId is extracted from JWT middleware

    // Find all locations for the user
    const userLocations = await db.locations.findAll({
      where: { UserId: userId },
      order: [["time", "DESC"]], // Order by time in descending order
    });

    res.status(200).json({ locations: userLocations });
  } catch (error) {
    console.error("Error getting user locations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get last location for a user controller
async function getLastLocation(req, res) {
  try {
    const userId = req.userId; // Assuming userId is extracted from JWT middleware

    // Find the last location for the user
    const lastLocation = await db.locations.findOne({
      where: { UserId: userId },
      order: [["createdAt", "DESC"]], // Order by time in descending order
    });

    res.status(200).json({ lastLocation });
  } catch (error) {
    console.error("Error getting last user location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserData(req, res) {
  try {
    // Extract userId from the request object
    // This assumes you have a middleware that sets req.userId based on the JWT token
    const userId = req.userId;

    // Fetch user data from the database using the userId
    const userData = await db.users.findOne({
      where: { id: userId },
      // Include any associated data you want to fetch, e.g., locations
      // include: [{ model: db.locations, as: 'locations' }]
    });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user data in the response
    res.status(200).json({ user: userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// function calculateDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371e3; // Earth's radius in meters
//   const φ1 = lat1 * (Math.PI / 180); // φ, λ in radians
//   const φ2 = lat2 * (Math.PI / 180);
//   const Δφ = (lat2 - lat1) * (Math.PI / 180);
//   const Δλ = (lon2 - lon1) * (Math.PI / 180);

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   const d = R * c; // in meters
//   return d;
// }

module.exports = {
  register,
  login,
  addLocation,
  getAllLocations,
  getLastLocation,
  getUserData,
};
