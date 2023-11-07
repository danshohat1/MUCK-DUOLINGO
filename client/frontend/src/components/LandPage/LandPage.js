
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(9), // Increased padding for a thicker paper
    textAlign: 'center',
    borderRadius: '12px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  body: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(3),
  },
  featuresList: {
    listStyleType: 'disc',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  buttonGroup: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
}));

function LandPage() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h4" className={classes.title}>
              Welcome to the MUCK Language Learning Application
            </Typography>
            <Typography variant="body1" className={classes.body}>
              In an increasingly interconnected world, language proficiency is not just a valuable skill but a necessity. The MUCK Language Learning Application empowers individuals in their language learning journey by providing an immersive and personalized experience.
            </Typography>
            <Typography variant="body1" className={classes.body}>
              Our dynamic digital platform offers a wide range of features, including:
            </Typography>
            <ul className={classes.featuresList}>
              <li>Interactive lessons that adapt to your level</li>
              <li>Real-time feedback on pronunciation and fluency</li>
              <li>Connect with native speakers for authentic conversations</li>
              <li>Explore diverse languages and cultures</li>
            </ul>
            <Typography variant="body1" className={classes.body}>
              Whether you're a beginner or an advanced learner, our application caters to your language needs. Join our community today and unlock a world of opportunities. Break down language barriers, foster cross-cultural understanding, and become a global citizen.
            </Typography>
            <div className={classes.buttonGroup}>
              <Button variant="contained" color="primary" component={Link} to="/signup">
                Sign Up
              </Button>
              <Button variant="outlined" color="primary" component={Link} to="/login">
                Log In
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LandPage;
