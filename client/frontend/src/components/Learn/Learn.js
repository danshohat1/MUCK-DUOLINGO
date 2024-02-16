import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, IconButton, Paper, Backdrop, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CloseIcon from '@mui/icons-material/Close';
import languages from '../../objects';
import axios from 'axios';
import findHostname from '../../FindIp';
import { ClimbingBoxLoader } from 'react-spinners';
import {css} from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 



const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function reverseObject(obj) {
  const reversed = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      reversed[obj[key]] = key;
    }
  }
  return reversed;
}


const LearnLanguage = () => {
  const { lang } = useParams();
  const [language, setLanguage] = useState(lang);
  const [selectedStage, setSelectedStage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [stagesInfo, setStagesInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();



  useEffect(async () => {
    setIsLoading(true);
    if (sessionStorage.getItem("loggedIn") !== "true"){
      return (
        navigate("/login")
      )
    }

    console.log("here")
    const response = await axios.post(`http://${findHostname()}:8003/get-stages`, {username: sessionStorage.getItem('username'), language: lang.toUpperCase()});
    console.log("here2")
    const data = response.data;
    console.log(data)
    setStagesInfo(data);
    try{
      const reversedLanguages = reverseObject(languages);
      const full_lang = reversedLanguages[lang][0].toUpperCase() + reversedLanguages[lang].slice(1);

      setLanguage(full_lang);
      setIsLoading(false)
    } catch(err) {
      return navigate("/main")
    }
  },[])
  
  const handleStageClick = (stageNumber) => {
    setSelectedStage(stageNumber);
    setShowPopup(true);
  };

  const handleClosePopup = () => setShowPopup(false);

  const renderStar = (filled) => (
    <StarIcon sx={{ color: filled ? '#FFD700' : '#e0e0e0', filter: filled ? 'drop-shadow(0 0 8px #FFD700)' : 'none' }} />
  );

  const renderStageContent = (stageNumber) => {
    const isCompleted = stagesInfo.completed.hasOwnProperty(stageNumber);
    const isCurrent = stageNumber === stagesInfo.current;
    const isLocked = stageNumber > stagesInfo.current;

    return (
      <Paper key={stageNumber} elevation={4} sx={{ padding: 2, textAlign: 'center', cursor: isLocked ? 'default' : 'pointer', backgroundColor: isLocked ? '#E0E0E0' : 'white' }} onClick={() => !isLocked && handleStageClick(stageNumber)}>
        <Typography variant="h6">{`Stage ${stageNumber}`}</Typography>
        {isCompleted && Array.from({ length: 3 }, (_, i) => renderStar(i < stagesInfo.completed[stageNumber].stars))}
        {isCurrent && <Typography variant="body1">Current Stage</Typography>}
        {isLocked && <LockIcon />}
      </Paper>
    );
  };
  const startStage = () => {
    navigate(`/new-words/${lang}/${selectedStage}`);
  }
  const PopupContent = () => {
    if (!selectedStage) return null;
  
    const isCompleted = stagesInfo.completed.hasOwnProperty(selectedStage);
    const stageDetails = isCompleted ? stagesInfo.completed[selectedStage] : { stars: 0, grade: 0 };
  
    return (
      <Box sx={{ 
        minWidth: 300, 
        textAlign: 'center',
        color: 'black', // Explicitly setting text color to black for visibility
        bgcolor: 'white' // You can also set a specific background color if needed
      }}>
        <Typography variant="h5" sx={{ my: 2 }}>{`Stage ${selectedStage}`}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          {Array.from({ length: 3 }, (_, i) => renderStar(i < stageDetails.stars, `detail-star-${selectedStage}-${i}`))}
        </Box>
        {isCompleted && <Typography sx={{ my: 2 }}>{`Grade: ${stageDetails.grade}%`}</Typography>}
        <Button onClick = {startStage} variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>
          {isCompleted ? 'Do Again' : 'Start Stage'}
        </Button>
      </Box>
    );
  };
  
  
  
  const Popup = () => {
    return (
      <Backdrop open={showPopup} onClick={handleBackdropClick} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, zIndex: 1000 }}>
          <IconButton onClick={handleClosePopup} sx={{ position: 'absolute', top: 0, right: 0 }}>
            <CloseIcon />
          </IconButton>
          <PopupContent />
        </Box>
      </Backdrop>
    );
  };

  const handleBackdropClick = (event) => {
    if (event.currentTarget === event.target) {
      handleClosePopup();
    }
  };
  const handleBack = () => {
    navigate("/main");
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
    <Container>
    <Paper sx={{ 
      my: 4, 
      p: 3, 
      height: '60vh', // Reduced height of the paper
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ textAlign: 'center', position: 'relative' }}>
      <IconButton onClick={handleBack} sx={{ position: 'absolute', top: 0, left: 0 }}>
            <ArrowBackIcon /> 
          </IconButton>
        <Typography variant="h4" gutterBottom>{`Learn ${language}`}</Typography>
        <IconButton onClick={() => navigate(`/video-chat/${lang}`)} sx={{ position: 'absolute', top: 0, right: 0, color: 'blue', fontSize: '2rem' }}>
          <VideoCallIcon fontSize="large" /> {/* Increased size of the icon */}
        </IconButton>
      </Box>

      <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
        {Array.from({ length: stagesInfo.total }, (_, i) => renderStageContent(i + 1))}
      </Box>
      {showPopup && <Popup />}
    </Paper>
  </Container>
  );
};

export default LearnLanguage;
