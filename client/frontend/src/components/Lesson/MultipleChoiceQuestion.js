import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 400,
    margin: 'auto',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  question: {
    marginBottom: theme.spacing(2),
  },
  optionsList: {
    padding: 0,
    marginBottom: theme.spacing(2),
  },
  optionItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
  snackbar: {
    [theme.breakpoints.down('xs')]: {
      bottom: 90,
    },
  },
}));

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MultipleChoiceQuestion = ({ word, onNextQuestion, onSaveIncorrectAnswer, incorrectAnswers }) => {
  const classes = useStyles();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleAnswerSelection = (answer) => {
    if (!snackbarOpen) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    const isCorrect = selectedAnswer === word[Object.keys(word)[0]].answer;
    setFeedbackMessage(isCorrect ? 'Correct!' : 'Incorrect. Try again next round.');
    setSnackbarOpen(true);
  };

  // Inside the MultipleChoiceQuestion component

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setSnackbarOpen(false);
    console.log(reason)
    if (feedbackMessage.includes('Incorrect')) {
      // Move to the next question only if the feedback is for an incorrect answer
      console.log("here1")
      onNextQuestion(false);
    } else {
      // Move to the next question for any other reason (including correct answers)
      onNextQuestion(true);
    }
  
    setFeedbackMessage('');
  };

  const handleConfirmation = () => {
    setSnackbarOpen(false);
    setFeedbackMessage('');
    onNextQuestion(selectedAnswer === word[Object.keys(word)[0]].answer);
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.question}>
          {Object.keys(word)[0]}
        </Typography>
        <Typography variant="body1">What is the translation?</Typography>
        <List className={classes.optionsList}>
          {word[Object.keys(word)[0]].options.map((option) => (
            <li
              key={option}
              className={classes.optionItem}
              onClick={() => handleAnswerSelection(option)}
              style={{
                cursor: snackbarOpen ? 'not-allowed' : 'pointer',
                backgroundColor: selectedAnswer === option ? '#d3d3d3' : 'transparent',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '5px',
              }}
            >
              {option}
            </li>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          className={classes.submitButton}
          onClick={handleSubmit}
          disabled={snackbarOpen}
        >
          Submit
        </Button>
      </CardContent>

      <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} className={classes.snackbar}>
        <Alert onClose={handleSnackbarClose} severity={feedbackMessage.includes('Correct') ? 'success' : 'error'}>
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MultipleChoiceQuestion;
