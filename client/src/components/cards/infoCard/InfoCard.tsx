import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import React from 'react';
import './index.scss'

export interface IInfoCardProps {
    image?: string
    name: string

    masterParams: string[]
    detailParams: string[]

    data: any

    btn1Name: string
    onClickBtn1: (btnName: string, data: {}) => void
    btn2Name: string
    onClickBtn2: (btnName: string, data: {}) => void

}

const InfoCard: React.FC<IInfoCardProps> = (props: IInfoCardProps) => {
    const { image, name, masterParams, detailParams, btn1Name, onClickBtn1, btn2Name, onClickBtn2, data } = props;
    const masterData = masterParams.map(param => data[param]);
    return (
        <div className={'info-card'}>
            <Card className="card">
                <CardMedia
                    component="img"
                    className="image-container"
                    image={image?? image}
                    alt="ehe..."
                />
                <CardHeader
                    className="card-header"
                    title={name}
                    subheader={masterData.join(', ')}
                />
                <CardContent className="card-content">
                    <Typography variant="h6">Details:</Typography>
                    <div className="details">
                        <Typography variant="body1" component="ul">
                            {detailParams.map((param, index) => (
                                <li key={index}>
                                    <strong>{param}: </strong>{data[param]}
                                </li>
                            ))}
                        </Typography>
                    </div>
                </CardContent>
                <CardActions className="card-actions">
                    <Button variant="contained" color="primary" onClick={() => { onClickBtn1(btn1Name, data) }}>
                        {btn1Name}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => { onClickBtn2(btn2Name, data) }}>
                        {btn2Name}
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
};

export default InfoCard;