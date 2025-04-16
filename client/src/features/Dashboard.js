import React from 'react';

function Dashboard() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Smart Voting System</h1>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width : '100%',
    height: '100vh', // Ensures the content is vertically centered
    background: "linear-gradient(135deg, #00416A, #E4E5E6)", // Blue to light gray gradient
    fontFamily: "'Arial', sans-serif", // Clean font style
    color: '#fff', // White text for good contrast
    textAlign: 'center', // Center text horizontally
    padding: '0 20px', // Padding for mobile responsiveness
    boxSizing: 'border-box',
    backgroundSize: 'cover', // Ensures the background covers the full screen
  },
  heading: {
    fontSize: '3rem', // Larger heading font size
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '3px', // Adds spacing between letters for a sleek look
    textShadow: '4px 4px 10px rgba(0, 0, 0, 0.6)', // Strong shadow for contrast
    margin: 0,
    background: 'rgba(0, 0, 0, 0.3)', // Transparent background for the heading to stand out
    padding: '10px 20px', // Padding around the heading
    borderRadius: '8px', // Rounded corners
  }
};

export default Dashboard;
