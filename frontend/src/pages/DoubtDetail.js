import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import AdBanner from '../components/AdBanner';
import './DoubtDetail.css';

const DoubtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doubt, setDoubt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoubt = async () => {
      try {
        const res = await axios.get(`/api/doubts/${id}`);
        setDoubt(res.data);
      } catch (err) {
        console.error('Error fetching doubt detail:', err);
        setError('Unable to load this doubt. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoubt();
  }, [id]);

  const extractYouTubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11 ? match[2] : null;
  };

  const renderSolutionBody = (solution) => {
    if (!solution) return null;

    const videoId =
      solution.youtubeVideoId ||
      extractYouTubeId(solution.videoUrl);

    const hasVideo = !!videoId;
    const hasSteps = Array.isArray(solution.steps) && solution.steps.length > 0;
    const hasContent = !!(solution.content && String(solution.content).trim());

    const left = (
      <div className="solution-left">
        {hasSteps ? (
          <ol className="solution-steps">
            {solution.steps.map((step, idx) => (
              <li key={idx}>
                <strong>Step {step.stepNumber}:</strong> {step.description}
                {step.imageUrl && (
                  <img src={step.imageUrl} alt={`Step ${step.stepNumber}`} />
                )}
              </li>
            ))}
          </ol>
        ) : (
          <div className="solution-text">
            <p>{hasContent ? solution.content : 'Solution is available but has no content yet.'}</p>
          </div>
        )}

        {hasSteps && hasContent && (
          <div className="solution-text">
            <h3 className="solution-subtitle">Explanation</h3>
            <p>{solution.content}</p>
          </div>
        )}
      </div>
    );

    const right = hasVideo ? (
      <div className="solution-right">
        <div className="solution-video">
          <iframe
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Solution Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    ) : null;

    return (
      <div className={`solution-grid ${hasVideo ? 'has-video' : ''}`}>
        {left}
        {right}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !doubt) {
    return (
      <div className="doubt-detail-page">
        <AdBanner position="header" />
        <div className="container">
          <div className="doubt-detail-card">
            <h2>Oops!</h2>
            <p>{error || 'Doubt not found.'}</p>
            <button className="btn-primary" onClick={() => navigate(-1)}>
              ⬅ Back
            </button>
          </div>
        </div>
        <AdBanner position="footer" />
      </div>
    );
  }

  const questionText = doubt.content || doubt.extractedText || 'No content available';

  return (
    <div className="doubt-detail-page">
      <AdBanner position="header" />
      <div className="container">
        <motion.div
          className="doubt-detail-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 120 }}
        >
          <div className="doubt-detail-header">
            <button className="btn-secondary" onClick={() => navigate(-1)}>
              ⬅ Back to My Doubts
            </button>
            <div>
              <h1>{doubt.title || 'Untitled Doubt'}</h1>
              <p className="doubt-detail-meta">
                📅 Submitted: {new Date(doubt.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <section className="doubt-detail-section">
            <h2>📝 Question</h2>
            <pre className="doubt-detail-question">
              {questionText}
            </pre>
            {doubt.imageUrl && (
              <img src={doubt.imageUrl} alt="Doubt" className="doubt-detail-image" />
            )}
          </section>

          {doubt.assignedTutor && (
            <section className="doubt-detail-section">
              <h3>👨‍🏫 Assigned Tutor</h3>
              <p>
                <strong>{doubt.assignedTutor.name || 'Tutor'}</strong>
                {doubt.assignedTutor.email && ` · ${doubt.assignedTutor.email}`}
              </p>
            </section>
          )}

          {doubt.matchedSolution && (
            <section className="doubt-detail-section">
              <h2>🎯 Matched Answer</h2>
              {renderSolutionBody(doubt.matchedSolution)}
            </section>
          )}

          {doubt.solution && (
            <section className="doubt-detail-section">
              <h2>📚 Tutor Answer</h2>
              {renderSolutionBody(doubt.solution)}
            </section>
          )}

          {!doubt.matchedSolution && !doubt.solution && (
            <section className="doubt-detail-section">
              <h2>Answers</h2>
              <p>No answers are available for this doubt yet.</p>
            </section>
          )}
        </motion.div>
      </div>
      <AdBanner position="footer" />
    </div>
  );
};

export default DoubtDetail;

