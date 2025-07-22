import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicQuestionById } from '../utils/api'; // You will need to create this function
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const QuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const data = await getPublicQuestionById(id);
        setQuestion(data);
      } catch (err) {
        console.log(err);
        setError('Failed to load the question. It may be private or does not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: question.title,
      text: `Check out this interview question: ${question.title}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktops
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) return <div className="container mt-5"><Skeleton count={10} /></div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h1 className="h2 mb-0">{question.title}</h1>
          <button onClick={handleShare} className="btn btn-outline-primary">
            Share
          </button>
        </div>
        <div className="card-body p-4">
          <h4 className="text-muted mb-3">Question</h4>
          {/* This renders the HTML from the rich text editor */}
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: question.question }} />
          <hr />
          <h4 className="text-muted my-3">Solution</h4>
          <div dangerouslySetInnerHTML={{ __html: question.solution }} />
        </div>
        <div className="card-footer text-muted d-flex justify-content-between">
          <span><strong>Difficulty:</strong> {question.difficulty}</span>
          <span><strong>Category:</strong> {question.category}</span>
        </div>
      </div>
       <Link to="/" className="btn btn-secondary mt-4">← Back to Home</Link>
    </div>
  );
};

export default QuestionPage;