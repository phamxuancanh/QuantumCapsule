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
                    {listResult.map((result, index) => {
                        return <Button key={result.id} onClick={()=>{handleClick(result)}}>
                            {result.examId} - {result.yourScore}/{result.totalScore}
                        </Button>
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