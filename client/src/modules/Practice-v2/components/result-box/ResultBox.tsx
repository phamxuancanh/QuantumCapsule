import { Box, Card, Typography } from '@mui/material';
import { useListAnswer, useListQuestion, useResult } from '../../context/context';
import ListResults from 'QCComponents/results/ListResults';
import React from 'react';
import { calculateTimeSpent } from 'helpers/Nam-helper/Caculate';

interface ResultBoxProps {
    isOpen: boolean;
}

const ResultBox: React.FC<ResultBoxProps> = (props) => {
    const {result} =  useResult()
    const {listQuestion} = useListQuestion()
    const {listAnswer} = useListAnswer()
    return (
        <Box display={props.isOpen ? "block" : "none"} p={2}>
          <Card sx={{p: 2, mb: 2}}>
            <Typography color="#4caf50" fontSize={"30px"}>Trả lời đúng: <span>{result.yourScore} / {result.totalScore} câu</span></Typography>
            <Typography color="#4caf50" fontSize={"30px"}>Thời gian làm bài: <span>{calculateTimeSpent(result.timeStart!, result.timeEnd!)}</span></Typography>
          </Card>
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