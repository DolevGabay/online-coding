import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lobby.css';
import getConfig from '../config-front';

function Lobby() {
  const navigate = useNavigate();
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    console.log('Fetching code blocks1');
    const fetchCodeBlocks = async () => {
      try {
        console.log('Fetching code blocks');
        const config = getConfig();
        console.log(`${config.backend.url}/code-blocks`);
        const response = await fetch(`${config.backend.url}/code-blocks`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCodeBlocks(data);
        console.log('Code blocks:', data);
      } catch (error) {
        console.error('Error fetching code blocks:', error);
      }
    };
    fetchCodeBlocks();
  }, []);

  const handleCreateRoom = async (roomId) => {
    console.log('Creating room', roomId);
    try {
      const config = getConfig();
      const response = await fetch(`${config.backend.url}/create-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const { port, isMentor } = await response.json();
      navigate(`/codeblock/${roomId}?port=${port}&isMentor=${isMentor}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="page-container">
      <h1>Choose code block</h1>
      <div className="container">
        {codeBlocks.map((block, index) => (
          <div key={block.id} className="card">
            <div className="box">
              <div className="content">
                <h2>{String(index + 1).padStart(2, '0')}</h2>
                <h3>{block.name}</h3>
                <p>{block.description}</p>
                <button onClick={() => handleCreateRoom(block.id)}>Create Room</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lobby;
