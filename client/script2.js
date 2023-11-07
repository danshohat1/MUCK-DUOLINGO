import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

let socket;
let localStream;
const localVideo = document.getElementById("local-video");
const myPeer = new Peer(undefined, {
  host: "/",
  port: "5000"
});
// keys: peer id , values: socket id
let idFormat = []
const userVideoElements = {}; // Store user video elements by their user_id


navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  localStream = stream;
});

const waitForVariable = () => {
  return new Promise((resolve) => {
    const checkVariable = () => {
      if (typeof localStream !== "undefined") {
        resolve(localStream);
      } else {
        // Check again after a short delay (adjust the delay as needed)
        setTimeout(checkVariable, 100);
      }
    };
    checkVariable();
  });
};

function objectFlip(obj) {
    const ret = {};
    Object.keys(obj).forEach(key => {
      ret[obj[key]] = key;
    });
    return ret;
  }
  

myPeer.on("open", async (id) => {
  const stream = await waitForVariable();
  socket = io.connect("http://127.0.0.1:3001");

  socket.on("connect", () => {
    console.log(`My Socket ID: ${socket.id}`);
  });

  localVideo.srcObject = stream;

  myPeer.on("call", (call) => {
    call.answer(stream);
    call.on("stream", (userVideoStream) => {
      if (!userVideoElements[call.peer]) {
        const videoElement = document.createElement("video");

        // Set video attributes
        videoElement.setAttribute("playsinline", "");
        videoElement.setAttribute("autoplay", "");
        videoElement.style.width = "320px";
        videoElement.style.height = "240px";

        document.body.appendChild(videoElement);
        userVideoElements[call.peer] = videoElement; // Store the reference
      }
      userVideoElements[call.peer].srcObject = userVideoStream;

      // Remove the user's video element and its reference when the call is closed
      call.on("close", () => {
        console.log("here")
        if (userVideoElements[call.peer]) {
          document.body.removeChild(userVideoElements[call.peer]);
          delete userVideoElements[call.peer];
        }
      });

    });
  });

  socket.on("peer", (data) => {
    socket.emit("get_peer_id", data.sender_sid, id);

    idFormat.push([data.user_id, data.sender_sid])

    console.log("User connected: " + data.user_id);
    const call = myPeer.call(data.user_id, stream);

    call.on("stream", (userVideoStream) => {
      if (!userVideoElements[data.user_id]) {
        const videoElement = document.createElement("video");

        // Set video attributes
        videoElement.setAttribute("playsinline", "");
        videoElement.setAttribute("autoplay", "");
        videoElement.style.width = "320px";
        videoElement.style.height = "240px";

        document.body.appendChild(videoElement);
        userVideoElements[data.user_id] = videoElement; // Store the reference
      }
      userVideoElements[data.user_id].srcObject = userVideoStream;

      // Remove the user's video element and its reference when the call is closed
      call.on("close", () => {
        console.log("here")
        if (userVideoElements[data.user_id]) {
          document.body.removeChild(userVideoElements[data.user_id]);
          delete userVideoElements[data.user_id];
        }
      });
    });
  });

  socket.on("get_peer_id", (data) => {
    if (data.peer_id) {
        idFormat.push([data.peer_id, data.sender_sid])
      } else {
        // Handle the case where data.peer_id is undefined or falsy
        console.error('data.peer_id is undefined or falsy');
      }
      
  })

  socket.on("user_connected", (user_sid) => {
    console.log("User connected: " + user_sid);
    socket.emit("peer", user_sid, id);
  });

  socket.on("user_disconnected", (user_sid) => {
    console.log("user disconnected " + user_sid)
    console.log(idFormat)
    console.log(userVideoElements)
    console.log(idFormat.filter((val => val[1] === user_sid))[0])
    userVideoElements[idFormat.filter((val => val[1] === user_sid))[0][0]].remove()
    idFormat = idFormat.filter(val => val[1]!== user_sid)
    console.log(idFormat)
  })
});
