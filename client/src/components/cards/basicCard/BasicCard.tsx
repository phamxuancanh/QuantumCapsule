import { Card, CardContent } from '@mui/material';
import React from 'react';

export interface IBasicCardProps {
    children?: React.ReactNode;
    sx?: any;
}

const BasicCard: React.FC<IBasicCardProps> = (props: IBasicCardProps) => {
    return (
        <Card variant='outlined' sx={{margin: '15px', ...props.sx}}>
            <CardContent >
                {props.children}

            </CardContent>
        </Card>
    );
};

export default BasicCard;