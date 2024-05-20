const express = require("express");
const cors = require("cors");
const userRoutes = require("./app/routes/sidequests-routes");
// const app = express();

// socket io
// const http = require('http');
// const server = http.createServer(app);
const app = require("express")();
const http = require("http").Server(app);

// const socketIO = require("socket.io")(http, {
//   cors: {
//     origin: '*'
//   },
// });

// socketIO.on("connection", (socket) => {
//   console.log(`${socket.id} user is just connected`);
// });

// const { Server } = require("socket.io");
// const io = new Server(server);

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to sidequests!" });
});

// Use user routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});