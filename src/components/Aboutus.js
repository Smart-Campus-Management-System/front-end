import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import banner from '../images/about.gif';

const AboutUs = () => {
  return (
    <motion.div
      // initial={{ opacity: 0, x: -50 }}
      //animate={{ opacity: 0, x: 0 }}
      //transition={{ duration: 0.8 }}
      style={styles.container}
    >
      <Navbar />
      <div style={styles.videoSection}>
        <video
          src="" 
          autoPlay
          loop
          muted
          style={styles.video}
        />
      </div>

      <div style={styles.contentSection}>
        <h1 style={styles.header}>About Us</h1>
        <p style={styles.text}>
        At <b>Smart Campus Management System</b> – an innovative solution designed to enhance efficiency, collaboration, and engagement within the university environment. Our integrated platform streamlines campus operations by offering seamless scheduling, resource management, event planning, and real-time analytics. With role-based access for administrators, lecturers, and students, the system ensures secure and personalized experiences while promoting effective communication and participation. Committed to security, mobility, and cross-platform compatibility, we strive to create a smarter, more connected campus for a productive academic journey.
        </p>
       
        <ul style={styles.list}>
          <b><li className="list-item">Personalized Learning Experiences</li>
          <li className="list-item">Innovative Technology Integration</li>
          <li className="list-item">Global Community of Learners</li>
          <li className="list-item">Commitment to Excellence</li></b>
        </ul>
      </div>
    </motion.div>
  );
};

const styles = {
  container: {
    background:'linear-gradient(-45deg, #1a1d28, #2a2d3a, #3e495d, #1f2937)',
    animation: 'gradientBG 15s ease infinite',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    height: '100vh',
    gap: '20px',
    //backgroundColor: '#5c6863', 
    color: '#ffffff',
  },
  
  videoSection: {
    flex: 1,
    backgroundImage: `url(${banner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    // backgroundBlendMode: 'overlay',
    //display: 'grid',  // Enables grid layout
    // gridTemplateColumns: 'repeat(3, 1fr)', // Creates 3 equal columns
    // gridTemplateRows: 'repeat(2, 1fr)', // Creates 2 equal rows
    // gap: '1px', // Adds spacing between videos
    // padding: '20px', // Adds padding around the section
},

video: {
    width: '100%',
    height: '100%', // Ensures full height in grid cell
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)', 
    objectFit: 'cover', // Ensures videos fill their grid area without distortion
    overflow: 'hidden', // Fixes the incorrect syntax
},
  contentSection: {
    flex: 1,
    textAlign: 'left',
    padding: '20px',
    backgroundColor: '#1e1e1e', 
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
    transition: 'transform 0.3s ease, box-shadow 0.1s ease', 
  },
  header: {
    fontSize: '2.5rem',
    color: '#00bcd4', 
    marginBottom: '20px',
  },
  text: {
    fontSize: '1.2rem',
    color: '#ddd',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  list: {
    fontSize: '1rem',
    color: '#ddd',
    lineHeight: '1.8',
    listStyleType: 'disc',
    paddingLeft: '20px',
  },
};


const addHoverStyles = () => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    /* Hover effect for the content section */
    div[style*='contentSection']:hover {
      transform: scale(1.03);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.9);
    }

    /* Hover effect for list items */
    .list-item {
      position: relative;
      transition: color 0.3s ease, transform 0.3s ease;
    }
    .list-item:hover {
      color: #00bcd4;
      transform: translateX(10px); 
    }
    .list-item::before {
      content: '→'; 
      position: absolute;
      left: -20px;
      opacity: 0;
      transition: opacity 0.3s ease, left 0.3s ease;
    }
    .list-item:hover::before {
      opacity: 1;
      left: -30px;
    }
  `;
  document.head.appendChild(styleTag);
};


addHoverStyles();

export default AboutUs;
