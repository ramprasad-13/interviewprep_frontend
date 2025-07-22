import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllQuestionsWithoutAuth } from '../utils/api';
import QuestionCard from '../components/QuestionCard';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Use URL search params for all state to ensure persistence
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10); // Get limit from URL or default to 12

  // Local state for the search input field
  const [searchTerm, setSearchTerm] = useState(query);

  const fetchQuestions = useCallback(async (page, searchQuery, questionsLimit) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllQuestionsWithoutAuth(page, questionsLimit, searchQuery);
      setQuestions(Array.isArray(response.questions) ? response.questions : []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError('Failed to fetch questions. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to re-fetch data whenever page, query, or limit changes in the URL
  useEffect(() => {
    fetchQuestions(currentPage, query, limit);
  }, [currentPage, query, limit, fetchQuestions]);

  // Handler for the search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // When searching, always reset to page 1 but keep the current limit
    setSearchParams({ query: searchTerm, page: '1', limit: limit.toString() });
  };
  
  // Handler for changing the page number
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ query, page: newPage.toString(), limit: limit.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for changing the questions-per-page limit
  const handleLimitChange = (e) => {
    const newLimit = e.target.value;
    // When changing the limit, always reset to page 1
    setSearchParams({ query, page: '1', limit: newLimit });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center mt-4">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className='page-link' onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
            </li>
            {items}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className='page-link' onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center">
          <label htmlFor="limit-select" className="form-label me-2 mb-0">Per Page:</label>
          <select id="limit-select" className="form-select form-select-sm" style={{width: 'auto'}} value={limit} onChange={handleLimitChange}>
            <option value="12">12</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
          </select>
        </div>
        <form className="d-flex" style={{ maxWidth: '400px', width: '100%' }} onSubmit={handleSearchSubmit}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {loading ? (
          // The number of skeletons now dynamically matches the selected limit
          Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <QuestionCard loading={true} />
            </div>
          ))
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <div key={question._id} className="col-md-6 col-lg-4 mb-4">
              <QuestionCard question={question} loading={false} />
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <h4>No Questions Found</h4>
            <p>Try adjusting your search or check back later.</p>
          </div>
        )}
      </div>

      {!loading && renderPagination()}
    </div>
  );
};

export default Home;