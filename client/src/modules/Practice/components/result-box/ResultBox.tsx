import { Box, Typography } from '@mui/material';
import { useListAnswer, useListQuestion, useResult } from 'modules/Practice/context/context';
import ListResults from 'QCComponents/results/ListResults';
import React from 'react';

interface ResultBoxProps {
    isOpen: boolean;
}

const ResultBox: React.FC<ResultBoxProps> = (props) => {
    const {result} =  useResult()
    const {listQuestion} = useListQuestion()
    const {listAnswer} = useListAnswer()
    return (
        <Box display={props.isOpen ? "block" : "none"} p={2}>
          <Typography variant="h3" color="#4caf50">Kết quả: {result.yourScore} / {result.totalScore}</Typography>
          <ListResults 
            result={result}
            listQuestion={listQuestion}
            listAnswer={listAnswer}
            sx={{
              height: '100vh',
              overflowY: 'auto',
            }}
          />
        </Box>
    );
};

export default ResultBox;