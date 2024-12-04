import { Box, Card, Rating, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useListAnswer, useListQuestion, useResult } from '../../context/context';
import ListResults from 'QCComponents/results/ListResults';
import React from 'react';
import { calculateTimeSpent } from 'helpers/Nam-helper/Caculate';
import { caculateStar } from 'helpers/Nam-helper/InitHelper';

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
                        <TableCell><Typography fontSize={"25px"}>Số sao:</Typography></TableCell>
                        <TableCell align="right">
                        <Rating value={caculateStar(result)} max={3} size="medium" readOnly
                            sx={{
                                fontSize: '3rem' // Gấp 5 lần bình thường (khoảng 80px)
                            }}
                        />
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