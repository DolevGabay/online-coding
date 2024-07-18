import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'; 
import 'prismjs/components/prism-javascript'; 
import './NewCodeBlock.css';
const config = require('../config.json');

function NewCodeBlock() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [error, setError] = useState(null);
  const overlayRef = useRef(null);
  const solutionOverlayRef = useRef(null);

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    if (overlayRef.current) {
      overlayRef.current.innerHTML = Prism.highlight(newCode, Prism.languages.javascript, 'javascript');
    }
  };

  const handleSolutionChange = (event) => {
    const newSolution = event.target.value;
    setSolution(newSolution);
    if (solutionOverlayRef.current) {
      solutionOverlayRef.current.innerHTML = Prism.highlight(newSolution, Prism.languages.javascript, 'javascript');
    }
  };

  const handleSubmit = async (e) => {
    if (!name || !code) {
      setError('Please provide a title and code snippet.');
      return;
    }
    e.preventDefault();
    try {
      const response = await fetch(`${config.backend.url}/code-blocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, code, description, solution })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        console.log('New code block created successfully');
        navigate('/'); // Redirect to lobby or wherever appropriate
      } else {
        setError('Failed to create new code block. Please try again.');
      }
    } catch (error) {
      console.error('Error creating new code block:', error);
      setError('Failed to create new code block. Please try again.');
    }
  };

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.innerHTML = Prism.highlight(code, Prism.languages.javascript, 'javascript');
    }
  }, [code]);

  useEffect(() => {
    if (solutionOverlayRef.current) {
      solutionOverlayRef.current.innerHTML = Prism.highlight(solution, Prism.languages.javascript, 'javascript');
    }
  }, [solution]);

  return (
    <div className="new-code-block-container">
      <h1>Create New Code Block</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Title:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="code">Code:</label>
          <div className="editor-container">
            <pre ref={overlayRef} className="overlay language-javascript"></pre>
            <textarea
              id="code"
              className="code-textarea"
              value={code}
              onChange={handleCodeChange}
              required
            ></textarea>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="solution">Solution:</label>
          <div className="editor-container">
            <pre ref={solutionOverlayRef} className="overlay language-javascript"></pre>
            <textarea
              id="solution"
              className="code-textarea"
              value={solution}
              onChange={handleSolutionChange}
              required
            ></textarea>
          </div>
        </div>
        <button type="submit">Create Code Block</button>
      </form>
      <button style={{ backgroundColor: 'lightcoral' }} onClick={() => navigate('/')}>Cancel</button>
    </div>
  );
}

export default NewCodeBlock;
