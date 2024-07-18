import React from 'react';
import './SmileyComponent.css';

const SmileyComponent = () => {
  return (
    <div className="smiley">
        <span className="smiley-text">Great job!</span>
      <div className="smiley-face">
        <div className="smiley-eyes">
          <div className="smiley-eye left"></div>
          <div className="smiley-eye right"></div>
        </div>
        <div className="smiley-mouth"></div>
      </div>
    </div>
  );
};

export default SmileyComponent;
