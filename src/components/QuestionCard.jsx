import React from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

const QuestionCard = ({ question, loading }) => {
  if (loading) {
    return (
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title"><Skeleton width="80%" /></h5>
          <h6 className="card-subtitle mb-2 text-muted"><Skeleton width="50%" /></h6>
          <p className="card-text flex-grow-1"><Skeleton count={2} /></p>
          <div className="mt-auto">
            <Skeleton width={80} height={38} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{question.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Difficulty: {question.difficulty}
        </h6>
        <p className="card-text flex-grow-1">
          Category: {question.category || (Array.isArray(question.tags) && question.tags.join(', '))}
        </p>
        <div className="mt-auto">
          {/* This now links to the dedicated page */}
          <Link to={`/questions/${question._id}`} className="btn btn-primary">
            View Question
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;