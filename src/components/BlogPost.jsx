import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const BlogPost = ({ blogdata, loading }) => {
  const [showModal, setShowModal] = useState(false);

  // Debug log to verify blogdata structure
  useEffect(() => {
    console.log('BlogPost blogdata:', { _id: blogdata._id, title: blogdata.title });
  }, [blogdata]);

  // Auto-open modal if hash matches blog _id
  useEffect(() => {
    if (!loading && blogdata._id && window.location.hash === `#${blogdata._id}`) {
      setShowModal(true);
    }
  }, [blogdata?._id, loading]);

  const getPreviewText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const handleShare = async () => {
    if (!blogdata._id) {
      console.error('Cannot share: blogdata._id is missing', blogdata);
      alert('Failed to share: Question ID is missing.');
      return;
    }

    const shareUrl = `${window.location.origin}/#${blogdata._id}`;
    console.log('Generated share URL:', shareUrl); // Debug log
    const shareData = {
      title: blogdata.title,
      text: `${blogdata.title} - Check out this question!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share canceled or failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        alert('Failed to copy link');
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  const handleWhatsAppShare = () => {
    if (!blogdata._id) {
      console.error('Cannot share to WhatsApp: blogdata._id is missing', blogdata);
      alert('Failed to share: Question ID is missing.');
      return;
    }

    const url = `${window.location.origin}/#${blogdata._id}`;
    console.log('Generated WhatsApp share URL:', url); // Debug log
    const message = `Check out this question: ${blogdata.title}\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="card mb-3 shadow-sm h-100" style={{ minHeight: '250px' }}>
        <div className="card-body d-flex flex-column">
          <h1 className="card-title h4">
            <Skeleton width={200} height={24} />
          </h1>
          <h6 className="card-subtitle mb-2 text-muted">
            <Skeleton width={100} height={16} />
          </h6>
          <p className="card-text flex-grow-1">
            <Skeleton count={3} height={16} />
          </p>
          <div className="mb-3 d-flex flex-wrap gap-2">
            <Skeleton width={100} height={24} />
            <Skeleton width={100} height={24} />
            <Skeleton width={120} height={24} />
            <Skeleton width={100} height={24} />
          </div>
          <Skeleton width={120} height={38} className="mt-auto" />
        </div>
      </div>
    );
  }

  // Check for missing _id
  if (!blogdata._id) {
    console.error('BlogPost rendering skipped: missing _id', blogdata);
    return null;
  }

  return (
    <>
      <div className="card mb-3 shadow-sm h-100" id={blogdata._id} style={{ minHeight: '250px' }}>
        <div className="card-body d-flex flex-column">
          <h1 className="card-title h4">{blogdata.title}</h1>
          <h6 className="card-subtitle mb-2 text-muted">Question</h6>
          <p className="card-text flex-grow-1">{getPreviewText(blogdata.question)}</p>

          <div className="mb-3 d-flex flex-wrap gap-2">
            <span className="badge bg-primary">Category: {blogdata.category}</span>
            <span className="badge bg-success">Difficulty: {blogdata.difficulty}</span>
            <span className="badge bg-warning text-dark">Published: {blogdata.publishedDate}</span>
            <span className="badge bg-info text-dark">Author: {blogdata.author}</span>
          </div>

          <button
            className="btn btn-outline-primary mt-auto"
            type="button"
            onClick={() => setShowModal(true)}
          >
            Show Solution
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{blogdata.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    if (window.history.replaceState) {
                      window.history.replaceState(null, '', window.location.pathname);
                    }
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="text-muted">Full Question</h6>
                <p>{blogdata.question}</p>

                <h6 className="text-muted">Solution</h6>
                <p>{blogdata.solution}</p>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  <span className="badge bg-primary">Category: {blogdata.category}</span>
                  <span className="badge bg-success">Difficulty: {blogdata.difficulty}</span>
                  <span className="badge bg-warning text-dark">Published: {blogdata.publishedDate}</span>
                  <span className="badge bg-info text-dark">Author: {blogdata.author}</span>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-success" onClick={handleWhatsAppShare}>
                    <i className="bi bi-whatsapp me-1"></i> WhatsApp
                  </button>
                  <button className="btn btn-outline-secondary" onClick={handleShare}>
                    <i className="bi bi-share-fill me-1"></i> Share / Copy Link
                  </button>
                </div>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

BlogPost.propTypes = {
  blogdata: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    solution: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    publishedDate: PropTypes.string.isRequired,
    private: PropTypes.bool,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default BlogPost;