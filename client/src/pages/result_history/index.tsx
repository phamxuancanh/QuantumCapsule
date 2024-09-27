import { Box, Button, Grid, Typography } from '@mui/material';
import { IAnswer } from 'api/answer/answer.interfaces';
import { IQuestion } from 'api/question/question.interfaces';
import { getListResultByUserId, getResultDetailByResultId } from 'api/result/result.api';
import { IResult, IResultDetail } from 'api/result/result.interface';
import { getUserIDLogin } from 'helpers/Nam-helper/InitHelper';
import ListResults from 'QCComponents/results/ListResults';
import React from 'react';
import { toast } from 'react-toastify';

const ResultHistory: React.FC = () => {
    const [listResult, setListResult] = React.useState<IResult[]>([]);
    const [resultDetail, setResultDetail] = React.useState<IResultDetail>(
        {
            result: {
                examId: "",
                totalScore: 0,
                yourScore: 0,
                status: false,
                timeEnd: new Date(),
                timeStart: new Date(),
                userId: "",
            },
            listQuestion: [],
            listAnswer: [],
        }
    );
    const handleClick = async (result : IResult) => {
        const resultDetail = await getResultDetailByResultId(result.id!);
        setResultDetail(resultDetail.data.data);
    }
    React.useEffect(() => {
        (async() => {
            try {
                const res = await getListResultByUserId(getUserIDLogin());
                setListResult(res.data.data);
            } catch (err: any) {
                toast.error(err.message);
            }
        })();
    }, []);

    return (
        <div className='tw-min-h-screen'>
        <Box p={3}>
            <Grid container spacing={2}>
            <Grid item xs={3}>
                <Typography variant="h3" style={{ textAlign: 'center', marginBottom: '20px', color: '#4caf50' }}>
                    Lịch sử
                </Typography>
                {listResult.map((result, index) => {
                    return (
                    <Button
                        key={result.id}
                        onClick={() => handleClick(result)}
                        variant="outlined"
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            justifyContent: 'space-between',
                            width: '100%',
                            borderRadius: '10px',
                            color: '#4caf50',
                            borderColor: '#4caf50',
                            transition: 'all 0.3s ease-in-out',
                          }}
                          onMouseEnter={(e) => {
                            const button = e.currentTarget as HTMLElement;
                            button.style.backgroundColor = '#4caf50';
                            button.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            const button = e.currentTarget as HTMLElement;
                            button.style.backgroundColor = 'white';
                            button.style.color = '#4caf50';
                          }}
                    >
                        <span>{result.examId}</span>
                        <span>{result.yourScore}/{result.totalScore}</span>
                    </Button>
                    );
                })}
                </Grid>
                <Grid item xs={9}>
                    <Box p={2}>
                        <Typography variant="h3" color="#4caf50">Kết quả: {resultDetail?.result.yourScore} / {resultDetail?.result.totalScore}</Typography>
                        <ListResults 
                            result={resultDetail?.result}
                            listQuestion={resultDetail?.listQuestion}
                            listAnswer={resultDetail?.listAnswer}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
        </div>
    );
};

export default ResultHistory;