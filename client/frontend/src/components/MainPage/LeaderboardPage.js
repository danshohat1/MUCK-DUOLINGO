import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead,Button, TableRow, Typography, MenuItem, Select, InputLabel, FormControl, Box } from '@mui/material';
import countries from './countries'; // Your existing mapping
import axios from 'axios';
import findHostname from '../../FindIp';
import { ClimbingBoxLoader } from 'react-spinners';
import {css} from '@emotion/react';


const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;




// Reverse countries to map codes to names for display purposes
const languageNames = Object.keys(countries).reduce((acc, key) => {
  acc[countries[key]] = key;
  return acc;
}, {});

const getFlagIcon = (countryCode) => {
  return <span className={"flag:" + countryCode} />;
};

const LeaderboardComponent = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Use language name for selection
  const [selectedLanguageName, setSelectedLanguageName] = useState();
  // Example data, mapping should be adjusted as per actual data structure
  const [stages, setStages] = useState([]);

  
  const [filteredStages, setFilteredStages] = useState([])

  useEffect( () => {
    setIsLoading(true)
    try{
      axios.get(`http://${findHostname()}:8003/leaderboard`).then((res) => {
        setStages(res.data)
        setFilteredStages(res.data)
        setIsLoading(false);
      })}
    catch (error) {
      console.error('Failed to fetch data:', error);
    }
   
  },[])

  const handleChangeLanguage = (event) => {
    setSelectedLanguageName(event.target.value);
    setFilteredStages(stages.filter(stage => countries[event.target.value] === stage.languageCode))

  };

  // Filter stages based on selected language name
  const handleShowAllLanguages = () => {
    setFilteredStages(stages)
    setSelectedLanguageName(null)

  }

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
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{ paddingTop: 64, height: `calc(100vh - 164px)` }}>
    <Paper elevation={3} sx={{ padding: 3, width: '80vw', maxHeight: '70vh', overflowY: 'auto', margin: '20px 0' }}>
      <Typography variant="h4" gutterBottom align="center">
        Leaderboard
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            labelId="language-select-label"
            value={selectedLanguageName}
            onChange={handleChangeLanguage}
            label="Language"
          >
            {Object.entries(countries).map(([name, code]) => (
              <MenuItem key={code} value={name}>
                {name} {getFlagIcon(countries[name])}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleShowAllLanguages}>Show All Languages</Button>
      </Box>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Language</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Stage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStages.map((stage, index) => (
            <TableRow key={index}>
              <TableCell>{stage.language} {getFlagIcon(stage.languageCode)}</TableCell>
              <TableCell>{stage.username}</TableCell>
              <TableCell>{stage.stage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </Box>
);
};


export default LeaderboardComponent;
