const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 3000;

// set up the view engine
app.set("view engine", "ejs");

// serve static files
app.use(express.static(path.join(__dirname, "public")));

//Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

//Handle root route
app.get("/", (req, res) => {
  res.render("index");
});

// start the server

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
});
