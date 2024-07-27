import React, { useRef, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-javascript';
import './CodeEditor.css';

function CodeEditor({ code, handleCodeChange, language = 'javascript' }) {
  const overlayRef = useRef(null);

  const notifyCodeChange = (event) => {
    handleCodeChange(event);

    const newCode = event.target.value;
    
    if (overlayRef.current) {
        overlayRef.current.innerHTML = Prism.highlight(newCode, Prism.languages.javascript, 'javascript');
      }
  };

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.innerHTML = Prism.highlight(code, Prism.languages[language], language);
    }
  }, [code, language]);

  return (
    <div className="editor-container">
      <pre ref={overlayRef} className={`overlay language-${language}`}></pre>
      <textarea
        className="code-textarea"
        value={code}
        onChange={notifyCodeChange}
      ></textarea>
    </div>
  );
}

export default CodeEditor;
