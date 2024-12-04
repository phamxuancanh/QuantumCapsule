import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { calculateScore, calculateTimeSpent } from 'helpers/Nam-helper/Caculate';
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
          <Card>
            <TableContainer >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={2}>
                          <Typography fontSize={"30px"} color="#4caf50">
                            Kết quả bài làm
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell><Typography fontSize={"25px"}>Trả lời đúng:</Typography></TableCell>
                        <TableCell align="right">
                          <Typography fontSize={"25px"}>{result.yourScore} / {result.totalScore} câu</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Typography fontSize={"25px"}>Điểm:</Typography></TableCell>
                        <TableCell align="right">
                          <Typography fontSize={"25px"}>{calculateScore(result.totalScore, result.yourScore)}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><Typography fontSize={"25px"}>Thời gian làm bài:</Typography></TableCell>
                        <TableCell align="right">
                          <Typography fontSize={"25px"}>{calculateTimeSpent(result.timeStart!, result.timeEnd!)}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
            </TableContainer>

          </Card>

          {/* <ListResults 
            result={result}
            listQuestion={listQuestion}
            listAnswer={listAnswer}
            sx={{
              height: '100vh',
              overflowY: 'auto',
            }}
          /> */}
        </Box>
    );
};

export default ResultBox;