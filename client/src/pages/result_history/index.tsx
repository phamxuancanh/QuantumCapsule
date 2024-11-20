import { Box, Button, Grid, Rating, Typography } from '@mui/material';
import { IAnswer } from 'api/answer/answer.interfaces';
import { IQuestion } from 'api/question/question.interfaces';
import { getListResultByUserId, getResultDetailByResultId } from 'api/result/result.api';
import { IGetResultByUserIdFilterParams, IResult, IResultDetail } from 'api/result/result.interface';
import { time } from 'console';
import { formatDisplayData } from 'helpers/Nam-helper/FormatData';
import { getUserIDLogin } from 'helpers/Nam-helper/InitHelper';
import QCDateFilter, { IDateFilter } from 'QCComponents/QCDateFilter/QCDateFilter';
import ListResults from 'QCComponents/results/ListResults';
import React from 'react';
import { toast } from 'react-toastify';
import { DATA_TYPE } from 'utils/enums';

const ResultHistory: React.FC = () => {
    const [listResult, setListResult] = React.useState<IResult[]>([]);
    const [resultDetail, setResultDetail] = React.useState<IResultDetail>();
    // const [filter, setFilter] = React.useState<IDateFilter>();
    React.useEffect(() => {
        (async() => {
            try {
                const res = await getListResultByUserId(getUserIDLogin(), {
                    from: undefined,
                    to: undefined
                } as IGetResultByUserIdFilterParams);
                setListResult(res.data.data);
            } catch (err: any) {
                toast.error(err.message);
            }
        })();
    }, []);
    const handleClick = async (result : IResult) => {
        const resultDetail = await getResultDetailByResultId(result.id!);
        setResultDetail(resultDetail.data.data);
    }
    const handleFilter = async (filter: IDateFilter) => {
        try {
            const res = await getListResultByUserId(
                getUserIDLogin(), 
                {
                    from: filter.from,
                    to: filter.to
                } as IGetResultByUserIdFilterParams
            );
            setListResult(res.data.data);
        } catch (err: any) {
            toast.error(err.message);
        }
    }



    return (
        <div className='tw-min-h-screen'>
        <Box p={3}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <QCDateFilter 
                        onChange={(filter) => {
                            console.log(filter);
                            handleFilter(filter)
                        }}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <Box p={2}>
                        <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '20px', color: '#4caf50' }}>
                            Lịch sử làm bài
                        </Typography>
                        <Box
                            sx={{
                                height: '100vh',
                                overflowY: 'auto',
                            }}
                        >
                            {listResult.map((result, index) => {
                                return (
                                <Button
                                    key={result.id}
                                    onClick={() => handleClick(result)}
                                    variant="outlined"
                                    style={{
                                        marginBottom: '10px',
                                        padding: '10px',
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
                                    <Grid container spacing={1} sx={{
                                        width: '100%',
                                    }}>
                                        <Grid item xs={9}>
                                            <Box>
                                                <Typography textAlign={"left"}>{result.examName}</Typography>
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                                <Typography color={"#08C2FF"}>{formatDisplayData(result.timeStart, DATA_TYPE.DATE)}</Typography>
                                                <Rating name="customized-10" defaultValue={result.star} max={3} readOnly/>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: "column",
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                                <Typography color={result.chapterName ? "#FD8B51" : "#10375C"} variant='caption'>
                                                    {result.chapterName ? result.chapterName : result.lessonName}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Button>
                                );
                            })}
                        </Box>

                    </Box>
                </Grid>
                <Grid item md={8} xs={12}>
                    <Box p={2}>
                        <Typography variant="h4" color="#4caf50" textAlign={"center"}>Kết quả: {resultDetail?.result.yourScore} / {resultDetail?.result.totalScore}</Typography>
                        <ListResults 
                            result={resultDetail?.result ?? {}}
                            listQuestion={resultDetail?.listQuestion ?? []}
                            listAnswer={resultDetail?.listAnswer ?? []}
                            sx={{
                                height: '100vh',
                                overflowY: 'auto',
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
        </div>
    );
};

export default ResultHistory;