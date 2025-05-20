import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { addQuestion, editQuestion, deleteQuestion, createFolder, getFolders, deleteFolder, moveQuestionToFolder, getAllQuestions } from '../utils/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Error Boundary Component
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

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movingQuestion, setMovingQuestion] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    title: '',
    question: '',
    solution: '',
    category: '',
    difficulty: '',
    author: '',
    folderId: '',
    publishedDate: '',
    private: false,
  });
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [questionsData, foldersData] = await Promise.all([
          getAllQuestions(page, 10),
          getFolders(),
        ]);
        setQuestions(Array.isArray(questionsData.questions) ? questionsData.questions : []);
        setTotalPages(questionsData.totalPages || 1);
        setFolders(Array.isArray(foldersData) ? foldersData : []);
      } catch (error) {
        console.error('Error fetching data:', error.error || error.message);
        setQuestions([]);
        setFolders([]);
        if (error.error === 'Invalid token' || error.error === 'No token provided') {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
        } else {
          setError(error.error || 'Failed to load data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    console.log('Questions:', questions.map(q => ({ _id: q._id, title: q.title, folderId: q.folderId, private: q.private })));
    console.log('Folders:', folders.map(f => ({ _id: f._id, name: f.name })));
  }, [questions, folders]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuestionForm({
      ...questionForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const newQuestion = await addQuestion({
        ...questionForm,
        publishedDate: questionForm.publishedDate || new Date().toISOString().split('T')[0],
      });
      setQuestions([newQuestion, ...questions]);
      setShowAddQuestionModal(false);
      setQuestionForm({
        title: '',
        question: '',
        solution: '',
        category: '',
        difficulty: '',
        author: '',
        folderId: '',
        publishedDate: '',
        private: false,
      });
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question: ' + (error.error || error.message));
    }
  };

  const handleEditQuestion = async (e) => {
    e.preventDefault();
    const { title, question, solution, category, difficulty, publishedDate, author } = questionForm;

    if (!title || !question || !solution || !category || !difficulty || !publishedDate || !author) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      console.log('Editing question with ID:', currentQuestion._id);
      console.log('Payload:', JSON.stringify(questionForm, null, 2));
      const updatedQuestion = await editQuestion(currentQuestion._id, questionForm);
      setQuestions(questions.map(q => (q._id === currentQuestion._id ? updatedQuestion : q)));
      setShowEditQuestionModal(false);
      setCurrentQuestion(null);
      setQuestionForm({
        title: '',
        question: '',
        solution: '',
        category: '',
        difficulty: '',
        author: '',
        folderId: '',
        publishedDate: '',
        private: false,
      });
    } catch (error) {
      console.error('Error editing question:', error);
      alert('Failed to edit question: ' + (error.error || error.message));
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id);
        setQuestions(questions.filter(q => q._id !== id));
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Failed to delete question: ' + (error.error || error.message));
      }
    }
  };

  const handleAddFolder = async (e) => {
    e.preventDefault();
    try {
      const newFolder = await createFolder(folderName);
      setFolders([...folders, newFolder]);
      setShowAddFolderModal(false);
      setFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder: ' + (error.error || error.message));
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm('Are you sure you want to delete this folder? Questions will be moved to "No Folder".')) {
      try {
        const result = await deleteFolder(folderId);
        setFolders(folders.filter(f => f._id !== folderId));
        setQuestions(questions.map(q => (q.folderId && q.folderId.toString() === folderId.toString() ? { ...q, folderId: null } : q)));
        alert(`Folder deleted successfully. ${result.message || ''}`);
      } catch (error) {
        console.error('Error deleting folder:', error);
        alert('Failed to delete folder: ' + (error.error || error.message));
      }
    }
  };

  const handleMoveToFolder = async (questionId, folderId) => {
    try {
      setMovingQuestion(questionId);
      const updatedQuestion = await moveQuestionToFolder(questionId, folderId);
      setQuestions(questions.map(q => (q._id === questionId ? updatedQuestion : q)));
    } catch (error) {
      console.error('Error moving question:', error);
      alert('Failed to move question: ' + (error.error || error.message));
    } finally {
      setMovingQuestion(null);
    }
  };

  const openEditModal = (question) => {
    console.log('Opening edit modal for question:', JSON.stringify(question, null, 2));
    setCurrentQuestion(question);
    setQuestionForm({
      title: question.title || '',
      question: question.question || '',
      solution: question.solution || '',
      category: question.category || '',
      difficulty: question.difficulty || '',
      author: question.author || '',
      publishedDate: question.publishedDate || new Date().toISOString().split('T')[0],
      folderId: question.folderId || '',
      private: question.private || false,
    });
    setShowEditQuestionModal(true);
  };

  const openFolderModal = (folder) => {
    setSelectedFolder(folder);
    setShowFolderModal(true);
  };

  const getPreviewText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <ErrorBoundary>
      <div className="container mt-4">
        <h1 className="mb-4"><i className="bi bi-grid-fill me-2"></i>Dashboard</h1>
        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}
        <div className="d-flex justify-content-between mb-4">
          <button className="btn btn-primary" onClick={() => setShowAddQuestionModal(true)}>
            <i className="bi bi-file-earmark-plus me-2"></i>Add Question
          </button>
          <button className="btn btn-success" onClick={() => setShowAddFolderModal(true)}>
            <i className="bi bi-folder-plus me-2"></i>Create Folder
          </button>
        </div>

        {/* Folder View */}
        <h3><i className="bi bi-folder-fill me-2 text-warning"></i>Folders</h3>
        <div className="row">
          {loading ? (
            Array(3).fill().map((_, index) => (
              <div key={index} className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Skeleton width={150} height={20} />
                    </h5>
                    <ul className="list-group list-group-flush">
                      {Array(3).fill().map((_, i) => (
                        <li key={i} className="list-group-item">
                          <Skeleton height={20} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title"><i className="bi bi-files me-2 text-muted"></i>No Folder</h5>
                    <ul className="list-group list-group-flush">
                      {Array.isArray(questions) && questions.length === 0 && !loading && (
                        <li className="list-group-item text-muted">No questions created yet. Click "Add Question" to start.</li>
                      )}
                      {Array.isArray(questions) && questions.filter(q => !q.folderId).map(q => (
                        <li key={q._id} className="list-group-item d-flex justify-content-between align-items-center">
                          <span>
                            <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                            {getPreviewText(q.title)}
                            {q.private && <i className="bi bi-lock-fill ms-2 text-muted" title="Private"></i>}
                          </span>
                          <div>
                            <select
                              className="form-select form-select-sm d-inline-block me-2"
                              style={{ width: 'auto' }}
                              value={q.folderId || ''}
                              onChange={(e) => handleMoveToFolder(q._id, e.target.value || null)}
                              disabled={movingQuestion === q._id}
                            >
                              <option value="">Move to Folder</option>
                              {Array.isArray(folders) && folders.map(f => (
                                <option key={f._id} value={f._id}>{f.name}</option>
                              ))}
                            </select>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(q)} title="Edit">
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteQuestion(q._id)} title="Delete">
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {Array.isArray(folders) && folders.length > 0 ? (
                folders.map(folder => (
                  <div key={folder._id} className="col-md-4 mb-3">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="card-title">
                            <i
                              className="bi bi-folder-fill me-2 text-warning"
                              style={{ cursor: 'pointer' }}
                              onClick={() => openFolderModal(folder)}
                              title="View Folder Contents"
                            ></i>
                            {folder.name}
                          </h5>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteFolder(folder._id)} title="Delete Folder">
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                        <ul className="list-group list-group-flush">
                          {Array.isArray(questions) && questions.filter(q => {
                            const folderMatch = q.folderId?.toString() === folder._id?.toString();
                            if (!folderMatch && q.folderId && folder._id) {
                              console.warn(`Folder ID mismatch: question.folderId=${q.folderId}, folder._id=${folder._id}`);
                            }
                            return folderMatch;
                          }).map(q => (
                            <li key={q._id} className="list-group-item d-flex justify-content-between align-items-center">
                              <span>
                                <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                                {getPreviewText(q.title)}
                                {q.private && <i className="bi bi-lock-fill ms-2 text-muted" title="Private"></i>}
                              </span>
                              <div>
                                <select
                                  className="form-select form-select-sm d-inline-block me-2"
                                  style={{ width: 'auto' }}
                                  value={q.folderId || ''}
                                  onChange={(e) => handleMoveToFolder(q._id, e.target.value || null)}
                                  disabled={movingQuestion === q._id}
                                >
                                  <option value="">Move to No Folder</option>
                                  {Array.isArray(folders) && folders.filter(f => f._id !== folder._id).map(f => (
                                    <option key={f._id} value={f._id}>{f.name}</option>
                                  ))}
                                </select>
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(q)} title="Edit">
                                  <i className="bi bi-pencil-fill"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteQuestion(q._id)} title="Delete">
                                  <i className="bi bi-trash-fill"></i>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <p className="text-muted">No folders created yet. Click "Create Folder" to organize your questions.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(page - 1)}>Previous</button>
                </li>
                {[...Array(totalPages).keys()].map(p => (
                  <li key={p + 1} className={`page-item ${page === p + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(p + 1)}>{p + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(page + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Add Question Modal */}
        {showAddQuestionModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"><i className="bi bi-file-earmark-plus me-2"></i>Add New Question</h5>
                  <button className="btn-close" onClick={() => setShowAddQuestionModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddQuestion}>
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input type="text" className="form-control" name="title" value={questionForm.title} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Question</label>
                      <textarea className="form-control" name="question" value={questionForm.question} onChange={handleInputChange} required rows="4"></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Solution</label>
                      <textarea className="form-control" name="solution" value={questionForm.solution} onChange={handleInputChange} required rows="4"></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input type="text" className="form-control" name="category" value={questionForm.category} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Difficulty</label>
                      <select className="form-select" name="difficulty" value={questionForm.difficulty} onChange={handleInputChange} required>
                        <option value="">Select Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Author</label>
                      <input type="text" className="form-control" name="author" value={questionForm.author} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Published Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="publishedDate"
                        value={questionForm.publishedDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Folder</label>
                      <select className="form-select" name="folderId" value={questionForm.folderId} onChange={handleInputChange}>
                        <option value="">No Folder</option>
                        {Array.isArray(folders) && folders.map(f => (
                          <option key={f._id} value={f._id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3 form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="privateSwitch"
                        name="private"
                        checked={questionForm.private}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="privateSwitch">
                        Private (visible only to you)
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary"><i className="bi bi-save me-2"></i>Add Question</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Question Modal */}
        {showEditQuestionModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"><i className="bi bi-pencil-square me-2"></i>Edit Question</h5>
                  <button className="btn-close" onClick={() => setShowEditQuestionModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleEditQuestion}>
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input type="text" className="form-control" name="title" value={questionForm.title} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Question</label>
                      <textarea className="form-control" name="question" value={questionForm.question} onChange={handleInputChange} required rows="4"></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Solution</label>
                      <textarea className="form-control" name="solution" value={questionForm.solution} onChange={handleInputChange} required rows="4"></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input type="text" className="form-control" name="category" value={questionForm.category} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Difficulty</label>
                      <select className="form-select" name="difficulty" value={questionForm.difficulty} onChange={handleInputChange} required>
                        <option value="">Select Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Author</label>
                      <input type="text" className="form-control" name="author" value={questionForm.author} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Published Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="publishedDate"
                        value={questionForm.publishedDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Folder</label>
                      <select className="form-select" name="folderId" value={questionForm.folderId} onChange={handleInputChange}>
                        <option value="">No Folder</option>
                        {Array.isArray(folders) && folders.map(f => (
                          <option key={f._id} value={f._id}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3 form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="privateSwitchEdit"
                        name="private"
                        checked={questionForm.private}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="privateSwitchEdit">
                        Private (visible only to you)
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary"><i className="bi bi-save me-2"></i>Save Changes</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Folder Modal */}
        {showAddFolderModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"><i className="bi bi-folder-plus me-2"></i>Create New Folder</h5>
                  <button className="btn-close" onClick={() => setShowAddFolderModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddFolder}>
                    <div className="mb-3">
                      <label className="form-label">Folder Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary"><i className="bi bi-folder-plus me-2"></i>Create Folder</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Folder Contents Modal */}
        {showFolderModal && selectedFolder && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title"><i className="bi bi-folder-fill me-2 text-warning"></i>{selectedFolder.name} Contents</h5>
                  <button className="btn-close" onClick={() => setShowFolderModal(false)}></button>
                </div>
                <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {Array.isArray(questions) && questions.filter(q => {
                    const folderMatch = q.folderId?.toString() === selectedFolder._id?.toString();
                    if (!folderMatch && q.folderId && selectedFolder._id) {
                      console.warn(`Folder ID mismatch in modal: question.folderId=${q.folderId}, selectedFolder._id=${selectedFolder._id}`);
                    }
                    return folderMatch;
                  }).length === 0 ? (
                    <p>No questions in this folder.</p>
                  ) : (
                    <ul className="list-group">
                      {Array.isArray(questions) && questions.filter(q => q.folderId?.toString() === selectedFolder._id?.toString()).map(q => (
                        <li key={q._id} className="list-group-item mb-3 border rounded">
                          <h6>
                            <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                            {q.title}
                            {q.private && <i className="bi bi-lock-fill ms-2 text-muted" title="Private"></i>}
                          </h6>
                          <p><strong>Question:</strong> {getPreviewText(q.question, 200)}</p>
                          <p><strong>Solution:</strong> {getPreviewText(q.solution, 200)}</p>
                          <p><strong>Category:</strong> {q.category} | <strong>Difficulty:</strong> {q.difficulty} | <strong>Author:</strong> {q.author}</p>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => alert(JSON.stringify(q, null, 2))}
                              title="View Details"
                            >
                              <i className="bi bi-eye-fill"></i> View
                            </button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => openEditModal(q)} title="Edit">
                              <i className="bi bi-pencil-fill"></i> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteQuestion(q._id)} title="Delete">
                              <i className="bi bi-trash-fill"></i> Delete
                            </button>
                            <select
                              className="form-select form-select-sm"
                              style={{ width: 'auto' }}
                              value={q.folderId || ''}
                              onChange={(e) => handleMoveToFolder(q._id, e.target.value || null)}
                              disabled={movingQuestion === q._id}
                            >
                              <option value="">Move to No Folder</option>
                              {Array.isArray(folders) && folders.filter(f => f._id !== selectedFolder._id).map(f => (
                                <option key={f._id} value={f._id}>{f.name}</option>
                              ))}
                            </select>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowFolderModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;