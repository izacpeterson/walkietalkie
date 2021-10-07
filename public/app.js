/** @format */

// const internal = require("stream");

var inTone = new Audio("./audio/inTone.mp3");
var outTone = new Audio("./audio/outTone.mp3");

var socket = io();

socket.on("audioMessage", (msg, iT, oT) => {
  console.log("msg recieved");
  const audiBlob = new Blob(msg);
  const iTBlob = new Blob(iT);
  const oTBlob = new Blob(oT);
  const audioURL = URL.createObjectURL(audiBlob);
  const itURL = URL.createObjectURL(iTBlob);
  const otURL = URL.createObjectURL(oTBlob);
  const audio = new Audio(audioURL);
  const iTaudio = new Audio(itURL);
  const oTaudio = new Audio(otURL);

  // console.log(audio.duration);
  oTaudio.play();
  oTaudio.onended = () => {
    audio.play();
    audio.onended = () => {
      iTaudio.play();
    };
  };

  // await iTaudio.play();
  // await oTaudio.play();
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
    // audioChunks.push(inTone);
  });
  mediaRecorder.addEventListener("stop", () => {
    let toneBlob = [];
    toneBlob.push(new Blob([inTone], { type: "audio/mp3" }));
    console.log(toneBlob);
    socket.emit("audioMessage", audioChunks);
    audioChunks = [];
  });
});
