import React from 'react';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 Not Found</h1>
      <p style={styles.message}>Oops! The page you are looking for might be in another universe.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '3em',
    color: '#333',
  },
  message: {
    fontSize: '1.2em',
    color: '#555',
  }
};

export default NotFound;
