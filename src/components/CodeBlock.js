import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-javascript';
import './CodeBlock.css';
import SmileyComponent from './SmileyComponent';
import CodeEditor from './CodeEditor';
const config = require('../config.json');

function CodeBlock() {
  const { id } = useParams();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [solution, setSolution] = useState('');
  const [isMentor, setIsMentor] = useState(false);
  
  const codeRef = useRef(null); // not causing re-render, persistent across renders
  const solutionRef = useRef(null); // Ref for solution code block

  const [smiley, setSmiley] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const query = new URLSearchParams(location.search);
  const port = query.get('port');

  useEffect(() => {
    const socket = io(`${config.backend.clean}${port}`);
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
      setLoading(false); 
    });

    socket.on('update', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off('connect');
      socket.off('load');
      socket.off('update');
      socket.disconnect();
    };
  }, [id, port]);

  const handleShowSolution = () => {
    setShowSolution(!showSolution);
  };

  useEffect(() => {
    if (isMentor && codeRef.current) {
      codeRef.current.innerHTML = code;
      Prism.highlightElement(codeRef.current);
    }
    if (showSolution && solutionRef.current) {
      solutionRef.current.innerHTML = Prism.highlight(solution, Prism.languages.javascript, 'javascript');
    }
  }, [code, isMentor, showSolution, solution]);

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    if (newCode === solution && solution !== '') {
      setSmiley(true);
    } else {
      setSmiley(false);
    }

    socket.emit('update', newCode, parseInt(id));
    
    if (codeRef.current) {
      codeRef.current.innerHTML = newCode;
      Prism.highlightElement(codeRef.current);
    }

  };

  return (
    <div className="code-block">
      <button onClick={() => window.location.href = '/'}>Back</button>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <h1>{isMentor ? `${title} - Mentor` : `${title} - Student`}</h1>
          {isMentor ? (
            <pre>
              <code ref={codeRef} className="language-javascript">{code}</code>
            </pre>
          ) : (
            <CodeEditor code={code} handleCodeChange={handleCodeChange} /> 
          )}
          {smiley && <SmileyComponent />}
          <button 
            onClick={handleShowSolution} 
            style={{ width: '150px', backgroundColor: 'gray' }}
            >
            {showSolution ? 'Hide' : 'Show Solution'}
            </button>
          {showSolution && (
            <div className="solution-container">
              <h2>Solution</h2>
              <pre>
                <code ref={solutionRef} className="language-javascript"></code>
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CodeBlock;
