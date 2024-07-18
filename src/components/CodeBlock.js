import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-javascript';
import './CodeBlock.css';
import { v4 as uuidv4 } from 'uuid';
import SmileyComponent from './SmileyComponent';
const config = require('../config.json');

function CodeBlock() {
  const { id } = useParams();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [solution, setSolution] = useState('');
  const [isMentor, setIsMentor] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [socket, setSocket] = useState(null);
  const codeRef = useRef(null);
  const overlayRef = useRef(null);
  const solutionRef = useRef(null); // Ref for solution code block
  const [smiley, setSmiley] = useState(false);

  const query = new URLSearchParams(location.search);
  const port = query.get('port');
  const clientId = localStorage.getItem('clientId') || uuidv4();

  useEffect(() => {
    localStorage.setItem('clientId', clientId);

    const socket = io(`${config.backend.clean}${port}`, {
      query: { clientId }
    });

    setSocket(socket);

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('load', parseInt(id));
    });

    socket.on('load', (data) => {
      setTitle(data.name);
      setCode(data.code);
      if (data.solution) {
        setSolution(data.solution);
      }
      setIsMentor(data.isMentor);
    });

    socket.on('update', (newCode) => {
      setCode(newCode);
      if (overlayRef.current) {
        overlayRef.current.innerHTML = Prism.highlight(newCode, Prism.languages.javascript, 'javascript');
      }
    });

    return () => {
      socket.off('connect');
      socket.off('load');
      socket.off('update');
      socket.disconnect();
    };
  }, [id, port, clientId]);

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    if (newCode === solution && solution !== '') {
      setSmiley(true);
    } else {
      setSmiley(false);
    }

    socket.emit('update', newCode, parseInt(id));
    if (overlayRef.current) {
      overlayRef.current.innerHTML = Prism.highlight(newCode, Prism.languages.javascript, 'javascript');
    }
  };

  const handleShowSolution = () => {
    setShowSolution(!showSolution);
  };

  useEffect(() => {
    if (isMentor && codeRef.current) {
      codeRef.current.innerHTML = code;
      Prism.highlightElement(codeRef.current);
    } else if (overlayRef.current) {
      overlayRef.current.innerHTML = Prism.highlight(code, Prism.languages.javascript, 'javascript');
    }
    if (showSolution && solutionRef.current) {
      solutionRef.current.innerHTML = Prism.highlight(solution, Prism.languages.javascript, 'javascript');
    }
  }, [code, isMentor, showSolution, solution]);

  return (
    <div className="code-block">
      <button onClick={() => window.location.href = '/'}>Back</button>
      <h1>{isMentor ? `${title} - Mentor` : `${title} - Student`}</h1>
      {isMentor ? (
        <pre>
          <code ref={codeRef} className="language-javascript">{code}</code>
        </pre>
      ) : (
        <div className="editor-container">
          <pre ref={overlayRef} className="overlay language-javascript"></pre>
          <textarea
            className="code-textarea"
            value={code}
            onChange={handleCodeChange}
          ></textarea>
        </div>
      )}
      {smiley && <SmileyComponent />}
      <button 
        onClick={handleShowSolution} 
        style={{ width: '50px', backgroundColor: 'gray' }}
        >
        {showSolution ? 'Hide' : 'Show'}
        </button>
      {showSolution && (
        <div className="solution-container">
          <h2>Solution</h2>
          <pre>
            <code ref={solutionRef} className="language-javascript"></code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default CodeBlock;
