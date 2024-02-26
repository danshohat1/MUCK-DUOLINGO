import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, TextField, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "country-flag-icons/3x2/flags.css";
import countries from './countries';
import "./MainPage.css";
import { ClimbingBoxLoader } from 'react-spinners';
import {css} from '@emotion/react';
import { ArrowForwardIos } from '@mui/icons-material';
import languages  from '../../objects';
import findHostname from '../../FindIp';
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

const Typewriter = ({ text, language }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false); 

  let currentCharIndex = 0;
  let currentWordIndex = 0;
  const words = text ? text.split(' ') : [];

  useEffect(() => {
    if (isCompleted) return; 

    const timer = setInterval(() => {
      if (!words.length) return; 

      if (currentWordIndex < words.length) {
        const currentWord = words[currentWordIndex];
        if (currentCharIndex < currentWord.length) {
          setDisplayedText(prev => prev + currentWord.charAt(currentCharIndex));
          currentCharIndex++;
        } else {
          setDisplayedText(prev => prev + ' ');
          currentCharIndex = 0;
          currentWordIndex++;
        }
      } else {
        setIsCompleted(true);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [isCompleted, words.length]);
  const getFlagIcon = (language) => {
    const countryCode = countries[language];
    return <span className={"flag:" + countryCode} /> 
  };
  return (
    <div>
      <h1>{displayedText}<span className="blinking-cursor">|</span></h1>
      {isCompleted && <div className="language-name">{getFlagIcon(language)} {language}</div>}
    </div>
  );
};






const MainPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [languageToCountryCode, setLanguageToCountryCode] = useState({});
  const [languageList, setLanguageList] = useState([]);
  const [helloMsg, setHelloMsg] = useState({});
  const [stagesInfo, setStagesInfo] = useState({});
  const navigate = useNavigate();

  useEffect(async () => {
    if (sessionStorage.getItem("loggedIn") !== "true"){
      return (
        navigate("/login")
      )
    }
    
    setIsLoading(true);



    const response = await axios.post(`http://${findHostname()}:8003/home-info`, JSON.stringify({
      username: sessionStorage.getItem("username")
    }));

    console.log(response.data.stages_info)
    setStagesInfo(response.data.stages_info);
    setLanguageList(Object.keys(response.data.languages));
    console.log(
      response.data.languages
    )
    
    setLanguageToCountryCode(countries);
    
    const mostSpokenLanguagesISO = [
      { name: "English", iso: "en" },
      { name: "Mandarin Chinese", iso: "zh" },
      { name: "Hindi", iso: "hi" },
      { name: "Spanish", iso: "es" },
      { name: "French", iso: "fr" },
      { name: "Standard Arabic", iso: "ar" },
      { name: "Bengali", iso: "bn" },
      { name: "Russian", iso: "ru" },
      { name: "Portuguese", iso: "pt" },
      { name: "Hebrew", iso: "he"}
    ];
    console.log("here")

    const randomIndex = Math.floor(Math.random() * mostSpokenLanguagesISO.length);
    console.log(mostSpokenLanguagesISO[randomIndex].iso)
    if (mostSpokenLanguagesISO[randomIndex].iso !== "en"){

    const translate_response = await fetch(`https://api.mymemory.translated.net/get?q=Nice to see you back! What are we doing today?&langpair=en|${mostSpokenLanguagesISO[randomIndex].iso}`);;
    const data = await translate_response.json();
    console.log(data.responseData.translatedText)
    setHelloMsg({text: data.responseData.translatedText, lang: mostSpokenLanguagesISO[randomIndex].name});
    }
    else{ 
      setHelloMsg({text: "Nice to see you back! What are we doing today?", lang: "English"});;

    }

    setIsLoading(false)
  }, [])
  
  const getFlagIcon = (language) => {
    const countryCode = languageToCountryCode[language];
    return <span className={"flag:" + countryCode} /> 
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const startsWithFilter = languageList.filter(lang =>
        lang.toLowerCase().startsWith(value.toLowerCase())
      );
      const includesFilter = languageList.filter(lang =>
        lang.toLowerCase().includes(value.toLowerCase()) && !startsWithFilter.includes(lang)
      );
      setFilteredLanguages([...startsWithFilter, ...includesFilter].slice(0, 3));
    } else {
      setFilteredLanguages([]);
    }
  };

  const renderSearchResults = () => {
    if (!searchTerm) return null;
  
    return filteredLanguages.length ? (
      <List>
        {filteredLanguages.map((language, index) => (
          
          <ListItem key={`${language}-${index}`} component={Link} to={`/learn/${languages[language.toLowerCase()]}`}>
            <ListItemAvatar>
              {getFlagIcon(language)}
            </ListItemAvatar>
            <ListItemText primary={language} />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography variant="subtitle1">No language found</Typography>
    );
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

  
  const renderRecentlyPracticed = () => {
    return (
      <List sx={{ maxHeight: 300, overflow: 'auto' }}>
        {Object.entries(stagesInfo).map(([lang, [lastStage, grade]]) => (
          <ListItem 
            key={lang} 
            button 
            component={Link} 
            to={`/learn/${languages[lang.toLowerCase()]}`}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Darker background on hover
                '.MuiListItemText-root': {
                 
                },
                '.arrow-icon': {
                  visibility: 'visible', // Make the arrow visible on hover
                }
              }
            }}
          >
            <ListItemText primary={`${lang} - Stage ${lastStage}`} secondary={`Grade: ${grade}%`} />
            <ArrowForwardIos className="arrow-icon" sx={{ visibility: 'hidden', ml: 1 }} />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Container>
    <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Welcome Message Section with Typewriter Effect */}
      <Grid key = "1" container spacing={4}>
      <Grid item xs={12} md={4}>
            <Box className = "box">
            {helloMsg.text && helloMsg.lang && <Typewriter text={helloMsg.text} language = {helloMsg.lang}/>}            
            </Box>
      </Grid>

      {/* Rest of your component */}
      
      {/* Continue Section (Left) */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f0f0f0', minHeight: 300,width: '100%', boxSizing: 'border-box' }}>
          <Typography variant="h6">Recently Practiced Languages</Typography>
          {renderRecentlyPracticed()}
        </Paper>
      </Grid>

      {/* Search Section (Right) */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f0f0f0', minHeight: 300,width: '100%', boxSizing: 'border-box' }}>
          <Typography variant="h6">Search for a Language</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Search Language"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {renderSearchResults()}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
</Container>

  );
};

export default MainPage;
