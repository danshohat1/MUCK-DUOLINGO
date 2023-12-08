import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import { useParams } from 'react-router-dom';
import { tryWrapperForImpl } from 'jsdom/lib/jsdom/living/generated/utils';

const WarmUpComponent = () => {
  const [wordsForWarmup, setWordsForWarmup] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [round, setRound] = useState(1);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { lang, level } = useParams();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8003/warm-up?lang=${lang}&level=${level}`);
        console.log(response.data)
        setWordsForWarmup(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching warmup list:', error);
      }
    };

    fetchData();
  }, [lang, level]);

  const handleSaveCorrectAnswer = (incorrectAnswer) => {
    const check = [...wordsForWarmup]
    check.splice(currentQuestionIndex, 1)
    console.log(check)
    setWordsForWarmup(check);

  };

  const handleShowDialog = () => {
    setDialogOpen(true);
  };

  const handleNextQuestion = (isCorrect) => {
    if (isCorrect) {
      // Save the incorrect answer
      console.log("here2")
      handleSaveCorrectAnswer(wordsForWarmup[currentQuestionIndex]);
    }
    console.log(wordsForWarmup[currentQuestionIndex + 1])
    if(wordsForWarmup[currentQuestionIndex + 1] === undefined)
    {
      if (wordsForWarmup.length === 0) {
        // Show the dialog if it's not the first round and there are incorrect answers
        console.log("here")
        handleShowDialog();
      } else {
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
  };

  const handleAgainButtonClick = () => {
    setRound(1);
    setIncorrectAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    handleDialogClose();
  };

  if (loading)
  {
    return <div>Loading...</div>;
  }

  return (
    <Card style={{ maxWidth: 400, margin: 'auto', marginTop: 20 }}>
      <CardContent>
        <Typography variant="h6">Round: {round}</Typography>
        <MultipleChoiceQuestion
          word={wordsForWarmup[currentQuestionIndex]}
          onNextQuestion={handleNextQuestion}
        />
        {dialogOpen && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default WarmUpComponent;
