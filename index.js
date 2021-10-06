/** @format */

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("audioMessage", (msg) => {
    io.emit("audioMessage", msg);
    console.log("message sent");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
