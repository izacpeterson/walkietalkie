/** @format */

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require("fs");

app.use(express.static("public"));

let file = [];
file.push(fs.readFileSync("inTone.mp3"));
// file = fs.readFileSync("inTone.mp3");

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("audioMessage", (msg) => {
    // console.log(msg);
    // let newBuff = [];
    // console.log(file);
    // console.log(msg);
    // newBuff.push(Buffer.concat([file, msg[0]]));
    // console.log(newBuff);

    io.emit("audioMessage", msg);
    io.emit("audioMessage", file);
    console.log("message sent");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("server listening");
});
