import { Box, Typography } from '@mui/material';
import React from 'react';

interface IProps {
    imageContent: string
}

const RenderContentImg: React.FC<IProps> = (props) => {
    
    const renderContentImg = () => {
        if(!props.imageContent) return <></>;
        if(props.imageContent.startsWith('http')) return <img src={props.imageContent} alt="ảnh" style={{ height: "250px", objectFit: "contain" }}/>;
        if(props.imageContent.toLowerCase().startsWith('text_')) {
            const content = props.imageContent.substring(5);
            return (
                <Box>
                    <Typography fontSize={"30px"}>{content}</Typography>
                </Box>
            );
        }
        return (
            <></>
        );
    }
    
    return (
        <Box>
            {renderContentImg()}
        </Box>
    );
};

export default RenderContentImg;