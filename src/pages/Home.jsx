import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import BlogPost from '../components/BlogPost';
import { getAllQuestionsWithoutAuth } from '../utils/api';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger m-4">
          <h4><i className="bi bi-exclamation-triangle-fill me-2"></i>Something went wrong</h4>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const Home = ({ data, loading, setPage, totalPages }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null); // null means use props.data
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(null);
      setSearchError(null);
      return;
    }
    const fetchSearchResults = async () => {
      try {
        setSearchLoading(true);
        setSearchError(null);
        const response = await getAllQuestionsWithoutAuth(searchCurrentPage, 10, searchQuery);
        console.log('Search results:', response.questions.map(q => ({ _id: q._id, title: q.title })));
        setSearchResults(Array.isArray(response.questions) ? response.questions : []);
        setSearchTotalPages(response.totalPages || 1);
        setSearchCurrentPage(response.currentPage || 1);
      } catch (error) {
        console.error('Error fetching search results:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          query: searchQuery,
        });
        setSearchResults([]);
        setSearchTotalPages(1);
        setSearchError('Failed to fetch search results. Please try again.');
      } finally {
        setSearchLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchQuery, searchCurrentPage]);

  const displayQuestions = searchResults !== null ? searchResults : data;
  const displayLoading = searchResults !== null ? searchLoading : loading;
  const displayTotalPages = searchResults !== null ? searchTotalPages : totalPages;
  const displayCurrentPage = searchResults !== null ? searchCurrentPage : data.currentPage || 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (searchResults !== null) {
      setSearchCurrentPage(pageNumber);
    } else {
      setPage(pageNumber);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginationItems = [];
  for (let number = 1; number <= displayTotalPages; number++) {
    paginationItems.push(
      <li key={number} className={`page-item ${displayCurrentPage === number ? 'active' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(number)}>
          {number}
        </button>
      </li>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mt-4" aria-busy={displayLoading}>
        <div className="d-flex justify-content-end mb-4">
          <form className="d-flex" style={{ maxWidth: '400px', width: '100%' }} onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search by title or question"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={displayLoading}
            />
            <button className="btn btn-outline-primary" type="submit" disabled={displayLoading}>
              Search
            </button>
          </form>
        </div>
        {searchError && (
          <div className="alert alert-warning mb-4">
            {searchError}
          </div>
        )}
        <div className="row">
          {displayLoading ? (
            Array(6).fill().map((_, index) => (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
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
              </div>
            ))
          ) : displayQuestions.length === 0 ? (
            <div className="col-12">
              <p className="text-muted">No blog posts found.</p>
            </div>
          ) : (
            displayQuestions.map((blog) => (
              <div key={blog._id} className="col-md-6 col-lg-4 mb-4">
                <BlogPost blogdata={blog} loading={false} />
              </div>
            ))
          )}
        </div>
        {!displayLoading && displayTotalPages > 0 && (
          <nav aria-label="Blog post pagination">
            <ul className="pagination justify-content-center mt-4">
              <li className={`page-item ${displayCurrentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(displayCurrentPage - 1)}
                  disabled={displayCurrentPage === 1}
                >
                  Previous
                </button>
              </li>
              {paginationItems}
              <li className={`page-item ${displayCurrentPage === displayTotalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(displayCurrentPage + 1)}
                  disabled={displayCurrentPage === displayTotalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Home;