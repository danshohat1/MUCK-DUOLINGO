import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';

const NewWordsComponent = () => {
  const [wordsData, setWordsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {lang, level} = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8003/new_words?lang=${lang}&level=${level}`).then((res) => {
      console.log(res.data);
      setWordsData(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleBeginLesson = () => {
    console.log('Lesson started!');
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % wordsData.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + wordsData.length) % wordsData.length);
    setIsFlipped(false);
  };

  return (
    <Card
      style={{
        textAlign: 'center',
        margin: '20px auto',
        width: '300px',
        height: '300px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Typography variant="h4" gutterBottom>
          New Words Pack
        </Typography>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              position: 'relative',
              border: '1px solid #ddd',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                transform: 'rotateY(0deg)',
                backfaceVisibility: 'hidden',
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: '8px',
              }}
            >
              <Typography variant="h5">{Object.keys(wordsData[currentIndex])[0]}</Typography>
            </div>
            <div
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: '8px',
              }}
            >
              <Typography variant="body1">{Object.values(wordsData[currentIndex])[0]}</Typography>
            </div>
          </div>
        )}
      </CardContent>
      <div>
        <Button variant="contained" color="primary" onClick={handleBeginLesson}>
          Begin Lesson
        </Button>
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={handlePrev} disabled={currentIndex === 0}>
          Previous
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext} disabled={currentIndex === wordsData.length - 1}>
          Next
        </Button>
      </div>
    </Card>
  );
};

export default NewWordsComponent;

