import React, { useEffect, useRef, useState } from 'react';
import { useParams,  useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';
import axios from 'axios';
import findHostname from '../../FindIp';
import { Paper, Button } from '@mui/material';
import "./VideoChat.css"
import { ClimbingBoxLoader } from 'react-spinners';
import {css} from '@emotion/react';



const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;


const VideoCallComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const localVideoRef = useRef(null);
  const userVideoElements = {};
  const { lang } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState(1); // Start with one participant (local user)
  const [_socket, setSocket] = useState(null);
  const [_localStream, setLocalStream] = useState(null);
  const [_myPeer, setMyPeer] = useState(null);

  const handleHangup = () => {

    if (_localStream) {
      _localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    _myPeer.destroy();
    _socket.disconnect();
    navigate(`/learn/${lang}`);
  };

  useEffect(async () => {
    let socket;
    let localStream;

    setIsLoading(true);


  
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
    setMyPeer(myPeer);
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

          setParticipants(prev => prev + 1);
          console.log("participants: " + participants)
          const containerDiv = document.createElement('div');
          containerDiv.style.position = 'relative';
          containerDiv.style.width = '320px';
          containerDiv.style.height = '240px';
          containerDiv.classList.add('video-container');

          
          const videoElement = document.createElement('video');
          videoElement.setAttribute('playsinline', '');
          videoElement.setAttribute('autoplay', '');
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.classList.add('video-element');

          try{ 
            const remoteUsername = idFormat.filter((ids) => ids[0] === call.peer)[0][2];

            const subtitle = document.createElement('div');
            subtitle.innerText = remoteUsername;
            subtitle.classList.add('video-subtitle'); // Add class for styling
  
  
            videoElement.srcObject = userVideoStream;
  
            containerDiv.appendChild(videoElement);
            containerDiv.appendChild(subtitle);
  
            document.getElementById('video-chat').appendChild(containerDiv);
            userVideoElements[call.peer] = containerDiv;
            updateLayout()
          }
          catch{
            console.log("catched")
          }

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
            setParticipants(prev => prev + 1);



            const containerDiv = document.createElement('div');
            containerDiv.style.position = 'relative';
            containerDiv.style.width = '320px';
            containerDiv.style.height = '240px';
            containerDiv.classList.add('video-container');

            const videoElement = document.createElement('video');
            videoElement.setAttribute('playsinline', '');
            videoElement.setAttribute('autoplay', '');
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.classList.add('video-element');
            const remoteUsername = idFormat.filter((ids) => ids[0] === data.user_id)[0][2];

            const subtitle = document.createElement('div');
            subtitle.innerText = remoteUsername;
            subtitle.classList.add('video-subtitle'); // Add class for styling


            videoElement.srcObject = userVideoStream;

            containerDiv.appendChild(videoElement);
            containerDiv.appendChild(subtitle);

            document.getElementById('video-chat').appendChild(containerDiv);
            userVideoElements[data.user_id] = containerDiv;
            console.log("participants: " + participants)
            updateLayout()

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
        setParticipants(prev => Math.max(prev - 1, 1));
        updateLayout()

      });
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStream = stream;
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;
    });

    myPeer.on('open', async (id) => {
      setIsLoading(false);
      const stream = await waitForVariable();
      socket = io.connect(`http://${findHostname()}:${io_port}`);
      setSocket(socket)

      handleSocketEvents();
    });

    return () => {
      handleHangup()
    };
  },[]);
const getGridStyle = (participants) => {
  switch (participants) {
    case 1:
      return { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' };
    case 2:
      return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' };
    case 3:
      return { gridTemplateColumns: '1fr', gridTemplateRows: '1fr 1fr' };
    case 4:
      return { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' };
    default:
      return { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }; 
  }
};
const updateLayout = () => {
  const numRemoteParticipants = Object.keys(userVideoElements).length;
  const totalParticipants = numRemoteParticipants + 1; 
  const videoChatContainer = document.getElementById('video-chat');
  const paperElement = videoChatContainer.parentNode;

  let numRows, numColumns;

  if (totalParticipants <= 2) {
    numRows = 1;
    numColumns = totalParticipants;
  } else {
    numRows = 2;
    numColumns = Math.ceil(totalParticipants / 2);
  }

  const paddingBottom = 50;
  const videoWidth = paperElement.clientWidth / numColumns;
  const videoHeight = (paperElement.clientHeight - paddingBottom) / numRows;

  videoChatContainer.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`;
  videoChatContainer.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;

  Object.values(userVideoElements).forEach(videoContainer => {
    videoContainer.style.width = `${videoWidth}px`;
    videoContainer.style.height = `${videoHeight}px`;
  });

  const localVideoContainer = localVideoRef.current.parentNode;
  if (localVideoContainer) {
    localVideoContainer.style.width = `${videoWidth}px`;
    localVideoContainer.style.height = `${videoHeight}px`;
  }

};



if (isLoading) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <ClimbingBoxLoader color="#353BFF" loading={isLoading} css={override} size={40} />
      <div style={{ marginTop: 16, fontWeight: 'bold' }}>Hold on...
      </div>
      <div style={{ marginTop: 16, fontWeight: 'bold' }}>
      taking longer than ususal? try refreshing the page
      </div>
    </div>
  );
}

return (
  <Paper elevation={3} sx={{ 
    padding: 2, 
    margin: 'auto', 
    marginTop: 2, 
    marginBottom: 50, 
    maxHeight: '70vh', 
    maxWidth: '80vw', 
    overflow: 'hidden',
    paddingBottom: 3, 

  }}>
  <div id="video-chat" className="video-call-container" style={getGridStyle(participants)}>
    <div className='video-container'>
      <video id="local-video" ref={localVideoRef} muted autoPlay playsInline className="video-element" />
    </div>
  </div>

  <Button variant="contained" onClick = {handleHangup} color="error" sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' }}>
    Hang Up
  </Button>
</Paper>
);
};

export default VideoCallComponent;
