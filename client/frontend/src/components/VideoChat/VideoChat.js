import React, { useEffect, useRef } from 'react';
import { useParams,  useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';
import axios from 'axios';
import findHostname from '../../FindIp';

const VideoCallComponent = () => {
  const localVideoRef = useRef(null);
  const userVideoElements = {};
  const { lang } = useParams();
  const navigate = useNavigate();


  useEffect(async () => {
    let socket;
    let localStream;

  
    if (sessionStorage.getItem("loggedIn") !== "true"){
      return (
        navigate("/login")
      )
    }
    const res = await axios.get(`http://${findHostname()}:8003/join_chat?lang=${lang}`);
    console.log(res)
    const { io_port, peer_port } = res.data;
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

    myPeer.on('call', (call) => {
      call.answer(localStream);
      call.on('stream', (userVideoStream) => {
        if (!userVideoElements[call.peer]) {
          const containerDiv = document.createElement('div');
          containerDiv.style.position = 'relative';
          containerDiv.style.width = '320px';
          containerDiv.style.height = '240px';

          const videoElement = document.createElement('video');
          videoElement.setAttribute('playsinline', '');
          videoElement.setAttribute('autoplay', '');
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';

          const remoteUsername = idFormat.filter((ids) => ids[0] === call.peer)[0][2];

          const subtitle = document.createElement('div');
          subtitle.innerText = remoteUsername;
          subtitle.style.position = 'absolute';
          subtitle.style.bottom = '0';
          subtitle.style.left = '0';
          subtitle.style.right = '0';
          subtitle.style.textAlign = 'center';
          subtitle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
          subtitle.style.padding = '5px';
          subtitle.style.color = 'white';
          subtitle.style.width = '20%';

          videoElement.srcObject = userVideoStream;

          containerDiv.appendChild(videoElement);
          containerDiv.appendChild(subtitle);

          document.getElementById('video-chat').appendChild(containerDiv);
          userVideoElements[call.peer] = containerDiv;
        }
      });
    });

    const handleSocketEvents = () => {
      socket.on('connect', () => {
        console.log(`My Socket ID: ${socket.id}`);
        socket.emit('new_connection', lang);
      });

      socket.on('peer', (data) => {
        socket.emit('get_peer_id', data.sender_sid, myPeer.id, sessionStorage.getItem('username'));

        idFormat.push([data.user_id, data.sender_sid, data.username]);

        const call = myPeer.call(data.user_id, localStream);

        call.on('stream', (userVideoStream) => {
          if (!userVideoElements[data.user_id]) {
            const containerDiv = document.createElement('div');
            containerDiv.style.position = 'relative';
            containerDiv.style.width = '320px';
            containerDiv.style.height = '240px';

            const videoElement = document.createElement('video');
            videoElement.setAttribute('playsinline', '');
            videoElement.setAttribute('autoplay', '');
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';

            const remoteUsername = idFormat.filter((ids) => ids[0] === data.user_id)[0][2];

            const subtitle = document.createElement('div');
            subtitle.innerText = remoteUsername;
            subtitle.style.position = 'absolute';
            subtitle.style.bottom = '0';
            subtitle.style.left = '0';
            subtitle.style.right = '0';
            subtitle.style.textAlign = 'center';
            subtitle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            subtitle.style.padding = '5px';
            subtitle.style.color = 'white';
            subtitle.style.width = '20%';

            videoElement.srcObject = userVideoStream;

            containerDiv.appendChild(videoElement);
            containerDiv.appendChild(subtitle);

            document.getElementById('video-chat').appendChild(containerDiv);
            userVideoElements[data.user_id] = containerDiv;
          }
        });
      });

      socket.on('get_peer_id', (data) => {
        if (data.peer_id) {
          idFormat.push([data.peer_id, data.sender_sid, data.username]);
        } else {
          console.error('data.peer_id is undefined or falsy');
        }
      });

      socket.on('user_connected', (user_sid) => {
        console.log('User connected: ' + user_sid);
        socket.emit('peer', user_sid, myPeer.id, sessionStorage.getItem('username'));
      });

      socket.on('user_disconnected', (user_sid) => {
        console.log('User disconnected: ' + user_sid);
        const userVideoElement = userVideoElements[idFormat.find((val) => val[1] === user_sid)[0]];
        if (userVideoElement) {
          document.getElementById('video-chat').removeChild(userVideoElement);
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
      socket = io.connect(`http://${findHostname()}:${io_port}`);
      handleSocketEvents();
    });

    return () => {
      console.log("in return")
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      myPeer.destroy();
      socket.disconnect();
    };
  },[]);

  return (
  <div id = "video-chat">
      <video id="local-video" ref={localVideoRef} autoPlay muted playsInline style={{ width: '320px', height: '240px' }} />
  </div>
  )
};

export default VideoCallComponent;
