// Flashcard.js
import React, { useState } from 'react';
import './index.scss';
import { Box } from '@mui/material';

export interface IFlashcardProps {
  question: any;
  answer: any;
}

const Flashcard = ({ question, answer }: IFlashcardProps) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Box sx={{width: '100%'}}>

      <div className={`flip-card ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            {question}
          </div>
          <div className="flip-card-back">
            {answer}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Flashcard;
