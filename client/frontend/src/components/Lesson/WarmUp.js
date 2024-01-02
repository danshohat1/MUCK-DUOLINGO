import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import { useParams } from 'react-router-dom';
import JSConfetti from 'js-confetti';
import { ClimbingBoxLoader } from 'react-spinners';
import { css } from '@emotion/react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const WarmUpComponent = () => {
  const location = useLocation();
  const [finishedWarmUp, setFinishedWarmUp] = useState(false);
  const [wordsForWarmup, setWordsForWarmup] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [round, setRound] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { lang, level } = useParams();
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  let  words;

  const fetchData = async () => {
    if (location.state === null || location.state.from !== "new-words") {

      console.log("Warmup component");
      navigate(`/new-words/${lang}/${level}`);
    }

    try {
      const response = await axios.get(`http://10.0.0.28:8003/warm-up?lang=${lang}&level=${level}`);
      console.log(response.data)
      setWordsForWarmup(response.data);
      setLoading(false);
      words = response.data
      console.log(words)
    } catch (error) {
      console.error('Error fetching warmup list:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [lang, level]);

  const handleSaveCorrectAnswer = (incorrectAnswer) => {
    const check = [...wordsForWarmup]
    check.splice(currentQuestionIndex, 1)
    console.log(check)
    setWordsForWarmup(check);
    return check;
  };

  const handleShowDialog = () => {
    const confetti = new JSConfetti();
    confetti.addConfetti()
    setFinishedWarmUp(true);
    setDialogOpen(true);
  };

  const handleNextQuestion = (isCorrect) => {
    let current = wordsForWarmup;
    if (isCorrect) {
      // Save the incorrect answer
      console.log("here2")
      current = handleSaveCorrectAnswer(wordsForWarmup[currentQuestionIndex]);
    }
    console.log(current)
    if(wordsForWarmup[currentQuestionIndex + 1] === undefined)
    {
      console.log("current: "+ current)
      if (current.length ===0)
      {
        console.log("in gg ")
        handleShowDialog();
      }
      else{
        console.log("here3")
        setCurrentQuestionIndex(0);
        setRound(round + 1);
      }
    }
    else{
      if(isCorrect){
        setCurrentQuestionIndex(currentQuestionIndex)
      }
      else{
        setCurrentQuestionIndex(currentQuestionIndex +1)
      }
  

    }  

    setSelectedAnswer(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Handle dialog close, e.g., navigate to the next step
  };

  const handleAdvanceButtonClick = () => {
    // Handle advancing to the next step
    // You can implement the logic here
    handleDialogClose();
    navigate(`/${lang}/${level}`, { state: { from: "warm-up" } });
  };

  const handleAgainButtonClick = () => {
    window.location.reload();
  };
  if (loading)
  {
    return <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <ClimbingBoxLoader color="#353BFF" loading={loading} css={override} size={40} />
    <div style={{ marginTop: 16, fontWeight: 'bold' }}>Hold on...</div>
    </div>
  }

  return (
    <div>
      {!dialogOpen && wordsForWarmup !== undefined && (
            <Card style={{ maxWidth: 400, margin: 'auto', marginTop: 20 }}>
            <CardContent>
              <Typography variant="h6">Round: {round}</Typography>
              <MultipleChoiceQuestion
                word={wordsForWarmup[currentQuestionIndex]}
                onNextQuestion={handleNextQuestion}
              />
         
            </CardContent>
          </Card>
        
      )}
    {dialogOpen && (
      <div>
           <Dialog open={dialogOpen} onClose={handleDialogClose}>
           <DialogTitle>Warm Up Passed!</DialogTitle>
           <DialogContent>
             <Typography>Congratulations! You have passed the warm-up.</Typography>
           </DialogContent>
           <DialogActions>
             <Button onClick={handleAdvanceButtonClick} color="primary">
               Advance
             </Button>
             <Button onClick={handleAgainButtonClick} color="primary">
               Start Again
             </Button>
           </DialogActions>
           </Dialog>
          </div>
    )}
 
    </div>

  );
};

export default WarmUpComponent;
