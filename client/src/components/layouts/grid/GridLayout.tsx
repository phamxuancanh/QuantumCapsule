import { Box } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';

interface ISpacing {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number

}

export interface GridLayoutProps {
    items: any[]

    columnSpacing?: number
    itemSpacing?: ISpacing

}

const GridLayout: React.FC<GridLayoutProps> = (props: GridLayoutProps) => {

    return (

        <Box  sx={{ display: 'flex', justifyContent:"center", alignItems:"center" }}>
            <Grid2 container columnSpacing={props.columnSpacing}  sx={{ display: 'flex', justifyContent:"space-around", alignItems:"center" }}>
                {props.items.map((item: any, index: number) => {
                    return (
                        <Grid2 
                        component="div" 
                        xs={props.itemSpacing?.xs} 
                        md={props.itemSpacing?.md} 
                        sm={props.itemSpacing?.sm}
                        lg={props.itemSpacing?.lg}
                        xl={props.itemSpacing?.xl}
                        sx={{ display: 'flex', justifyContent:"center", alignItems:"center" }}
                        key={index} 
                        >
                            {item}
                        </Grid2>
                    )
                })}
            </Grid2>
        </Box>
    );
};

export default GridLayout;