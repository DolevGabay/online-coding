import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css'; // Change to the desired theme
import 'prismjs/components/prism-javascript'; // Import the language you need
import './CodeBlock.css';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique identifiers
import getConfig from '../config-front';

function CodeBlock() {
  const { id } = useParams();
  const location = useLocation();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [isMentor, setIsMentor] = useState(false);
  const [socket, setSocket] = useState(null);
  const codeRef = useRef(null); // Create a ref for the code element
  const overlayRef = useRef(null); // Create a ref for the overlay element

  const query = new URLSearchParams(location.search);
  const port = query.get('port');
  const clientId = localStorage.getItem('clientId') || uuidv4();

  useEffect(() => {
    localStorage.setItem('clientId', clientId); // Store the clientId in local storage

    const socket = io(`${getConfig.backend.clean}${port}`, {
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
    socket.emit('update', newCode, parseInt(id));
    if (overlayRef.current) {
      overlayRef.current.innerHTML = Prism.highlight(newCode, Prism.languages.javascript, 'javascript');
    }
  };

  useEffect(() => {
    if (isMentor && codeRef.current) {
      codeRef.current.innerHTML = code;
      Prism.highlightElement(codeRef.current); // Highlight the code block
    } else if (overlayRef.current) {
      overlayRef.current.innerHTML = Prism.highlight(code, Prism.languages.javascript, 'javascript'); // Highlight the overlay
    }
  }, [code, isMentor]);

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
          <pre ref={overlayRef} className="overlay language-javascript" ></pre>
          <textarea
            className="code-textarea"
            value={code}
            onChange={handleCodeChange}
          ></textarea>
        </div>
      )}
    </div>
  );
}

export default CodeBlock;
