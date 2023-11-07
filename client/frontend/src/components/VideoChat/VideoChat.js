import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'peerjs';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';
import axios from 'axios';

const VideoCallComponent = () => {
  const localVideoRef = useRef(null);
  const userVideoElements = {};
  const {lang} = useParams();
  useEffect(async () => {
    let socket;
    let localStream;

    const res = await axios.get(`http://127.0.0.1:8003/join_chat?lang=${lang}`);
    const {io_port, peer_port} = res.data;
    console.log(res.data)
    console.log(io_port, peer_port);

    const myPeer = new Peer(undefined, {
      host: '/',
      port: peer_port,
    });
    let idFormat = [];

    const waitForVariable = () => {
      return new Promise((resolve) => {
        const checkVariable = () => {
          if (typeof localStream !== 'undefined') {
            resolve(localStream);
          } else {
            setTimeout(checkVariable, 100);
          }
        };
        checkVariable();
      });
    };

    myPeer.on('call', call => {
      call.answer(localStream);
      call.on('stream', (userVideoStream) => {
        if (!userVideoElements[call.peer]) {
          const videoElement = document.createElement('video');
          videoElement.setAttribute('playsinline', '');
          videoElement.setAttribute('autoplay', '');
          videoElement.style.width = '320px';
          videoElement.style.height = '240px';
          console.log("here")
          document.getElementById("root").appendChild(videoElement);
          userVideoElements[call.peer] = videoElement;
        }
        userVideoElements[call.peer].srcObject = userVideoStream;

      });
    });

    const handleSocketEvents = () => {
      socket.on('connect', () => {
        console.log(`My Socket ID: ${socket.id}`);
        console.log("here")
        socket.emit('new_connection', lang);
      });

      socket.on('peer', (data) => {
        socket.emit('get_peer_id', data.sender_sid, myPeer.id);

        idFormat.push([data.user_id, data.sender_sid]);

        console.log('User connected: ' + data.user_id);
        console.log(localStream)
        const call = myPeer.call(data.user_id, localStream);

        call.on("stream", (userVideoStream) => {
          if (!userVideoElements[data.user_id]) {
            const videoElement = document.createElement("video");
    
            // Set video attributes
            videoElement.setAttribute("playsinline", "");
            videoElement.setAttribute("autoplay", "");
            videoElement.style.width = "320px";
            videoElement.style.height = "240px";
    
            document.getElementById("root").appendChild(videoElement);
            console.log(userVideoElements)
            userVideoElements[data.user_id] = videoElement; // Store the reference
          }
          userVideoElements[data.user_id].srcObject = userVideoStream;
    
          // Remove the user's video element and its reference when the call is close
        });
      });

      socket.on('get_peer_id', (data) => {
        if (data.peer_id) {
          idFormat.push([data.peer_id, data.sender_sid]);
        } else {
          console.error('data.peer_id is undefined or falsy');
        }
      });

      socket.on('user_connected', (user_sid) => {
        console.log('User connected: ' + user_sid);
        socket.emit('peer', user_sid, myPeer.id);
      });

      socket.on('user_disconnected', (user_sid) => {
        console.log('User disconnected: ' + user_sid);
        const userVideoElement = userVideoElements[idFormat.find((val) => val[1] === user_sid)[0]];
        if (userVideoElement) {
          document.getElementById("root").removeChild(userVideoElement);
          delete userVideoElements[idFormat.find((val) => val[1] === user_sid)[0]];
        }
        idFormat = idFormat.filter((val) => val[1] !== user_sid);
      });
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStream = stream;
      localVideoRef.current.srcObject = stream;
    });

    myPeer.on('open', async (id) => {
      const stream = await waitForVariable();
      socket = io.connect(`http://127.0.0.1:${io_port}`);
      handleSocketEvents();
    });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      console.log("here!!!!")
      myPeer.destroy();
      socket.disconnect();
    };
  }, []);

  return <video id="local-video" ref={localVideoRef} autoPlay muted playsInline style={{ width: '320px', height: '240px' }} />;
};

export default VideoCallComponent;
