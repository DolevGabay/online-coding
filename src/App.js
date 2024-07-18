import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './components/Lobby';
import CodeBlock from './components/CodeBlock';
import NewCodeBlock from './components/NewCodeBlock';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/codeblock/:id" element={<CodeBlock />} />
        <Route path="/create-code-block" element={<NewCodeBlock />} />
      </Routes>
    </Router>
  );
}

export default App;
