/** @format */

var inTone = new Audio("./audio/inTone.mp3");
var outTone = new Audio("./audio/outTone.mp3");

function start() {
  inTone.play();
}

function end() {
  outTone.play();
}

var socket = io();

socket.on("audioMessage", (audioData) => {
  console.log("msg recieved");
  const audiBlob = new Blob(audioData);
  const audioURL = URL.createObjectURL(audiBlob);
  const audio = new Audio(audioURL);
  audio.play();
});

navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  const mediaRecorder = new MediaRecorder(stream);
  let audioChunks = [];
  let btn = document.querySelector("button");
  btn.addEventListener("mousedown", reqStart);
  btn.addEventListener("touchstart", reqStart);
  function reqStart() {
    console.log("recording");
    mediaRecorder.start();
  }
  btn.addEventListener("mouseup", reqEnd);
  btn.addEventListener("touchend", reqEnd);
  function reqEnd() {
    if (mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      console.log("stopped");
    }
  }
  mediaRecorder.addEventListener("dataavailable", (ev) => {
    audioChunks.push(ev.data);
  });
  mediaRecorder.addEventListener("stop", () => {
    socket.emit("audioMessage", audioChunks);
    audioChunks = [];
  });
});
