import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Card, Row, Col, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TiptapEditor from '../components/TiptapEditor';
import {
  getAllQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion,
  getFolders,
  createFolder,
  deleteFolder,
  moveQuestionToFolder,
} from '../utils/api';

const Dashboard = () => {
  // State for data
  const [questions, setQuestions] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for UI control
  const [selectedFolderId, setSelectedFolderId] = useState(null); // null represents "Unfiled"
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  
  // State for the question form
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [movingQuestion, setMovingQuestion] = useState(null);
  const [targetFolderId, setTargetFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [questionForm, setQuestionForm] = useState({
    title: '',
    question: '',
    solution: '',
    category: '',
    difficulty: 'Easy',
    private: false,
    folderId: null
  });

  const token = localStorage.getItem('token');

  // Fetches both questions and folders from the API
  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // --- THE FIX ---
      // Explicitly request a large number of questions to override any defaults.
      // We are fetching the first page with a limit of 100.
      const [questionsData, foldersData] = await Promise.all([
        getAllQuestions(1, 100), 
        getFolders()
      ]);
      setQuestions(questionsData.questions || []);
      setFolders(foldersData || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Folder Management Handlers ---
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder(newFolderName);
      setShowFolderModal(false);
      setNewFolderName('');
      fetchData();
    } catch (error) {
      console.error("Failed to create folder", error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm("Are you sure you want to delete this folder? Questions inside will become unfiled.")) {
      try {
        await deleteFolder(folderId);
        setSelectedFolderId(null);
        fetchData();
      } catch (error) {
        console.error("Failed to delete folder", error);
      }
    }
  };

  // --- Question Modal and Form Handlers ---
  const handleShowAddModal = () => {
    setIsEditing(false);
    setCurrentQuestion(null);
    setQuestionForm({
      title: '', question: '', solution: '', category: '', difficulty: 'Easy', private: false,
      folderId: selectedFolderId,
    });
    setShowQuestionModal(true);
  };
  
  const handleShowEditModal = (question) => {
    setIsEditing(true);
    setCurrentQuestion(question);
    setQuestionForm({ ...question, folderId: question.folderId || null });
    setShowQuestionModal(true);
  };
  
  const handleShowMoveModal = (question) => {
    setMovingQuestion(question);
    setTargetFolderId(question.folderId || '');
    setShowMoveModal(true);
  };

  const handleMoveQuestion = async () => {
    if (!movingQuestion) return;
    try {
      await moveQuestionToFolder(movingQuestion._id, targetFolderId || null);
      fetchData();
      setShowMoveModal(false);
      setMovingQuestion(null);
    } catch (error) {
      console.error("Failed to move question", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submissionData = { 
      ...questionForm, 
      author: "User",
      publishedDate: new Date().toISOString() 
    };

    try {
      if (isEditing) {
        await editQuestion(currentQuestion._id, submissionData);
      } else {
        await addQuestion(submissionData);
      }
      fetchData();
      setShowQuestionModal(false);
    } catch (error) {
      console.error("Failed to save question:", error);
      alert(`Error: Could not save question. ${error.error || ''}`);
    }
  };
  
  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this question?")) {
        try {
            await deleteQuestion(id);
            fetchData();
        } catch (error) {
            console.error("Failed to delete question", error);
        }
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuestionForm(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));
  };

  const handleEditorChange = (content, name) => {
    setQuestionForm(prev => ({ ...prev, [name]: content }));
  };
  
  const filteredQuestions = questions.filter(q => {
    if (selectedFolderId === null) return !q.folderId;
    return q.folderId === selectedFolderId;
  });

  const selectedFolderName = selectedFolderId ? folders.find(f => f._id === selectedFolderId)?.name : "Unfiled Questions";

  return (
    <div className="min-vh-100 container-fluid mt-4">
      <Row>
        <Col md={3}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              Folders
              <Button variant="outline-primary" size="sm" onClick={() => setShowFolderModal(true)}>+</Button>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item action active={selectedFolderId === null} onClick={() => setSelectedFolderId(null)}>
                Unfiled Questions
              </ListGroup.Item>
              {folders.map((folder) => (
                <ListGroup.Item key={folder._id} action active={selectedFolderId === folder._id} onClick={() => setSelectedFolderId(folder._id)} className="d-flex justify-content-between align-items-center">
                  {folder.name}
                  <span
                    role="button"
                    className="p-0 text-danger"
                    style={{ cursor: 'pointer', zIndex: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder.id);
                    }}
                  >
                    &#x2715;
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">{selectedFolderName}</h2>
            <Button variant="primary" onClick={handleShowAddModal}>+ Add Question</Button>
          </div>
          {loading ? <p>Loading questions...</p> : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredQuestions.length > 0 ? filteredQuestions.map((q) => (
                <Col key={q._id}>
                  <Card className="h-100">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{q.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{q.difficulty}</Card.Subtitle>
                      <div className="mt-auto pt-2">
                        <Link to={`/questions/${q._id}`} className="btn btn-outline-primary btn-sm me-2">View</Link>
                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShowMoveModal(q)}>Move</Button>
                        <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowEditModal(q)}>Edit</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteQuestion(q._id)}>Delete</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              )) : (
                <p className="text-muted">No questions in this folder. Click "Add Question" to get started!</p>
              )}
            </Row>
          )}
        </Col>
      </Row>

      {/* --- MODALS --- */}
      <Modal show={showQuestionModal} onHide={() => setShowQuestionModal(false)} size="lg" backdrop="static">
        <Modal.Header closeButton><Modal.Title>{isEditing ? 'Edit Question' : 'Add New Question'}</Modal.Title></Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Folder</Form.Label>
              <Form.Select name="folderId" value={questionForm.folderId || ''} onChange={handleFormChange}>
                <option value="">(Unfiled)</option>
                {folders.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={questionForm.title} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <TiptapEditor content={questionForm.question} onChange={(content) => handleEditorChange(content, 'question')} />
            </Form.Group>
             <Form.Group className="mb-3">
              <Form.Label>Solution</Form.Label>
              <TiptapEditor content={questionForm.solution} onChange={(content) => handleEditorChange(content, 'solution')} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={questionForm.category} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Difficulty</Form.Label>
              <Form.Select name="difficulty" value={questionForm.difficulty} onChange={handleFormChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Form.Select>
            </Form.Group>
             <Form.Check type="switch" id="private-switch" name="private" label="Make this question private" checked={questionForm.private} onChange={handleFormChange} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuestionModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Question</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showFolderModal} onHide={() => setShowFolderModal(false)} centered>
          <Modal.Header closeButton><Modal.Title>Create New Folder</Modal.Title></Modal.Header>
          <Modal.Body>
              <Form.Control type="text" placeholder="Folder Name" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowFolderModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateFolder}>Create</Button>
          </Modal.Footer>
      </Modal>

      <Modal show={showMoveModal} onHide={() => setShowMoveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Move Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Move "<strong>{movingQuestion?.title}</strong>" to:</p>
          <Form.Select value={targetFolderId} onChange={(e) => setTargetFolderId(e.target.value)}>
            <option value="">(Unfiled)</option>
            {folders.map(f => (
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMoveModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleMoveQuestion}>Move</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
