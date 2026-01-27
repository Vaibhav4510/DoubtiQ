import React from 'react';
import './StaticPages.css';

const About = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-card">
          <h1>About DoubtiQ</h1>
          <p className="static-meta">
            DoubtiQ is a learning companion designed to make doubt-solving fast, clear, and accessible.
          </p>

          <p>
            DoubtiQ combines AI-powered matching, high-quality tutor solutions, and video explanations to help
            students get unstuck quickly. You can upload a photo of your question or type it in, and we&apos;ll try
            to find an existing solution or route it to an expert tutor.
          </p>

          <h2>Our Mission</h2>
          <p>
            We want to remove the frustration of being stuck on a single problem. DoubtiQ is built to give students
            instant clarity so they can keep learning with confidence.
          </p>

          <h2>How It Works</h2>
          <ul>
            <li>Upload your doubt as an image or text.</li>
            <li>Our system tries to match it with existing video or text solutions.</li>
            <li>If no match is found, your doubt is assigned to verified tutors.</li>
            <li>You receive clear, step-by-step solutions and optionally video explanations.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;

