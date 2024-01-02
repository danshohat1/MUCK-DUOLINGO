import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tooltip, Box} from '@mui/material';
import JSConfetti from 'js-confetti';
import { ClimbingBoxLoader } from 'react-spinners';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/system';
import { makeStyles } from '@mui/styles';
import StarIcon from '@mui/icons-material/Star';
import "./styles.css"
import FillSentence from './FillSentence';
import { useNavigate, useLocation} from 'react-router-dom';

let points = 100;


const StyledInput = styled(TextField)({
    width: '100%',
    marginTop: '10px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '5px',
      '&:hover fieldset': {
        borderColor: '#353BFF',
      },
    },
  });


  const useStyles = makeStyles((theme) => ({
    dialog: {
      minWidth: 300,
    },
    title: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    actions: {
      justifyContent: 'space-between',
    },
    button: {
      margin: theme.spacing(1),
    },
  }));


  const ShakeStar = styled(StarIcon)(({ theme }) => ({
    fontSize: '3em',
    color: '#FFD700',
    transform: 'scale(1)',

  }));

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const QuestionComponent = ({ question, onNextQuestion, round, points, setPoints}) => {
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [answer, setAnswer] = useState([]);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [translations, setTranslations] = useState({});
    const { lang } = useParams();

    console.log(question)
    
    useEffect(() => {
      // Fetch translations for each word when the component mounts
      
      const fetchTranslations = async () => {
        try {
            console.log("here")
        
          const translationPromises = question.sentence.split(' ').map(async (word) => {
            if(word.includes('_')) {
                return {[word]: ''}
            }
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${word}&langpair=${lang.toLowerCase()}|en`);
            const data = await response.json();
            return { [word]: data.responseData.translatedText };
          });
  
          const translationsArray = await Promise.all(translationPromises);
          const translationsObject = translationsArray.reduce((acc, curr) => ({ ...acc, ...curr }), {});
          setTranslations(translationsObject);
        } catch (error) {
          console.error('Error fetching translations:', error);
        }
      };
  
      fetchTranslations();
    }, [question.sentence, lang]);
  
    const handleAnswerSelection = (answer) => {
      setSelectedAnswer(answer);
    };
  
    const handleSubmit = () => {
      let isCorrect
      if (question.type !== "fillsentence"){
        isCorrect = selectedAnswer === question.answer;
      }
      else{
        console.log(question)
        isCorrect = answer.map(word => Object.keys(word)[0]).join(" ") === question.answer;
      }
      
      let feedback = isCorrect && round === 1 ? " +10🤙" : ""

      if (!isCorrect && round === 1){
        setPoints(prevPoints => prevPoints - 10)
      }
      else if (!isCorrect){
        setPoints(prevPoints => prevPoints - 5)
        feedback = ". -5😖"
      }
      console.log(isCorrect)
      setFeedbackMessage(isCorrect ? 'Correct!' + feedback : `Incorrect. Try again next round. The answer was ${question.answer}${feedback}`);
      setSelectedAnswer('');
      setAnswer([])
      setSnackbarOpen(true);

    };
  
    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setSnackbarOpen(false);
  
      if (feedbackMessage.includes('Incorrect')) {
        onNextQuestion(false);
      } else {
        onNextQuestion(true);
      }
  
      setFeedbackMessage('');
    };
  
    const handleConfirmation = () => {
      setSnackbarOpen(false);
      setFeedbackMessage('');
      onNextQuestion(selectedAnswer === question.answer);
    };
  
    return (
      <Card style={{ maxWidth: 1000, margin: 'auto', textAlign: 'center', padding: 16 }}>
        <CardContent>
        <Typography variant="h5" style={{ marginBottom: 16 }}>
            {
                question.type
            }
          </Typography>
          <Typography variant="h6" style={{ marginBottom: 16 }}>
            {
              question.sentence.split(' ').map((word, index) => (
                <Tooltip title={translations[word] || ''} key={index} style={{ fontSize: '2rem' }}>
                <span style={{ cursor: 'pointer' }}>{word} </span>
              </Tooltip>
                ))}
          </Typography>
          {question.type === 'fillin' &&(
            <StyledInput
              type="text"
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={snackbarOpen}
            />
          )}
          {question.type === "multiplechoice" &&(
              <List style={{ padding: 0, marginBottom: 16, marginTop: 30}}>
              {question.options.map((option) => (
                <li
                  key={option}
                  style={{
                    cursor: snackbarOpen ? 'not-allowed' : 'pointer',
                    backgroundColor: selectedAnswer === option ? '#d3d3d3' : 'transparent',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '5px',
                  }}
                  onClick={() => handleAnswerSelection(option)}
                >
                  {option}
                </li>
              ))}
            </List>
          )}

          { question.type === "fillsentence" && (
              <FillSentence data = {question} answer={answer} setAnswer={setAnswer} realAnswer = {question.answer}/> 
          )}
        
            
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={snackbarOpen}
            style={{ marginTop: 16 }}
          >
            Submit
          </Button>
        </CardContent>
  
        <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} style={{ bottom: 90 }}>
          <MuiAlert onClose={handleSnackbarClose} severity={feedbackMessage.includes('Correct') ? 'success' : 'error'}>
            {feedbackMessage}
          </MuiAlert>
        </Snackbar>
      </Card>
    );
  }

const LanguagePracticeComponent = () => {
    const [rating, setRating] = useState(0); // Controlled component for Rating
    const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);
  const { lang, level } = useParams();
    const [stars, setStars] = useState(0);

    const [points, setPoints] = useState(100);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (location.state === null || location.state.from !== "warm-up") {

      console.log("Warmup component");
      navigate(`/new-words/${lang}/${level}`);
    }
    try {
      const response = await axios.get(`http://10.0.0.28:8003/advanced?lang=${lang}&level=${level}`);;
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run only once on component mount
  const handleSaveCorrectAnswer = (incorrectAnswer) => {
    const check = [...questions]
    check.splice(currentQuestionIndex, 1)
    console.log(check)
    setQuestions(check);
    return check;
  };
  const handleNextQuestion = (isCorrect) => {
    let current =   questions;
    if (isCorrect) {
      // Save the incorrect answer
      console.log("here2")
      current = handleSaveCorrectAnswer(questions[currentQuestionIndex]);
    }
    console.log(current)
    if(questions[currentQuestionIndex + 1] === undefined)
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
  };

  const handleShowDialog = () => {
    const confetti = new JSConfetti();
    confetti.addConfetti();
    setDialogOpen(true);
    setPoints(prevPoints => Math.max(0, prevPoints))
    if (points < 33){
        setStars(1);
    }
    else if (points < 66){
        setStars(2);
    }
    else {
        setStars(3)
    }
    document.documentElement.classList.add('shake');

    // Remove the shake class after the animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('shake');
    }, 500); // 500 milliseconds, matching the duration of the shake animation
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentQuestionIndex(0);
    setRound(round + 1);
  };

  const handleNextLesson = async () => {
    console.log(points)
    const response = await axios.post(`http://10.0.0.28:8003/add_stage `, {username: "user1", lang: lang, level: level, points: points})

    console.log(response.data)
  }

  const handleBackToMain = () => {
  }

  const handleBackToWarmup = () => {
    navigate(`/warm-up/${lang}/${level}`, {state: {from: "new-words"}});

  }

  const handleTryAgain = () => {
    window.location.reload();
  }




  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClimbingBoxLoader color="#353BFF" loading={loading} css={override} size={40} />
        <div style={{ marginTop: 16, fontWeight: 'bold' }}>Hold on...</div>
      </div>
    );
  }
  

  return (
    <div>
      {!dialogOpen && questions.length > 0 && (
        <Card style={{ maxWidth: 900, margin: 'auto', marginTop: 20 }}>
          <CardContent>
            <Typography variant="h6">Round: {round}</Typography>
            <QuestionComponent question={questions[currentQuestionIndex]} onNextQuestion={handleNextQuestion} round = {round} points = {points} setPoints = {setPoints}/>
          </CardContent>
        </Card>
      )}
      {dialogOpen && (
         <Dialog open={dialogOpen} onClose={handleDialogClose} className={classes.dialog}>
         <DialogTitle className={classes.title}>Lesson Passed</DialogTitle>
         <DialogContent>
            <br/><br/>
           <Box display="flex" justifyContent="center" alignItems="center">
             {[...Array(stars)].map((value, index) => (
               <AnimatedShakeStar key={value} />
             ))}
           </Box>
           <center><Typography variant="h6" style={{ marginTop: 16 }}>Score: {points}</Typography></center>
         </DialogContent>
         <DialogActions className={classes.actions}>
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <Button onClick={handleBackToMain} color="primary" className={classes.button} style={{ minWidth: '80px' }}>
               Back to Main
             </Button>
             <Button onClick={handleNextLesson} color="primary" className={classes.button} style={{ minWidth: '120px' }}>
               Save And Continue
             </Button>
             <Button onClick={handleBackToWarmup} color="primary" className={classes.button} style={{ minWidth: '80px' }}>
               Back to Warmup
             </Button>
             <Button onClick={handleTryAgain} color="primary" className={classes.button} style={{ minWidth: '80px' }}>
               Try Again
             </Button>
           </div>
         </DialogActions>
       </Dialog>
       
       
      )}
    </div>
  );
};


const AnimatedShakeStar = ({ value, rating }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsVisible(true);
      }, value * 830); // Adjust the delay based on the star's position (e.g., value * 830)
  
      return () => clearTimeout(timeout);
    }, [value]);
  
    return (
      <div className={`star-container ${isVisible ? 'visible' : ''}`}>
        {isVisible && (
          <ShakeStar key={value} className={`star ${value <= rating ? 'shake' : ''}`} />
        )}
      </div>
    );
  };
  
export default LanguagePracticeComponent;
