import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
export interface ISimpleBarChartChartProps {
    yAxis?: string;
    width?: number;
    height?: number;
    valueFormatter?: (value: number | null) => string;
    dataset: any[];
    labelField: string;
    dataField: string;
    label?: string
    onAxisClick?: (axis: string, index: number, value: number) => void;
    onItemClick?: (index: number) => void;
}

const SimpleBarChart: React.FC<ISimpleBarChartChartProps> = (props: ISimpleBarChartChartProps) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const chartSetting = {
        // yAxis: [
        //     isSmallScreen ?{
        //         label: props.yAxis,
        //     } : { scaleType: 'band', dataKey: props.labelField } 
        // ],
        width: !isSmallScreen? props.width || 500 : 400,
        height: !isSmallScreen? props.height || 300 : 300,
        sx: {
            [`.${axisClasses.left} .${axisClasses.label}`]: {
                transform: 'translate(-8px, 0px)',
            },
        },
    };


    const valueFormatter = props.valueFormatter;

    const handleAxisClick = (data: any) => {
        const { axisValue, dataIndex, seriesValues } = data;
        const axis = axisValue;
        const index = dataIndex;
        const value = seriesValues['auto-generated-id-0'];
        
        props.onAxisClick && props.onAxisClick(axis, index, value)
    }
    const handleItemClick = (index: number) => {
        props.onItemClick && props.onItemClick(index)
    }

    return (
        <BarChart
            margin = {{ left: 100 }} 
            dataset={props.dataset}
            xAxis={[
                !isSmallScreen? { scaleType: 'band', dataKey: props.labelField } :{label: props.yAxis},
            ]}
            yAxis = {[
                !isSmallScreen ?{
                    label: props.yAxis,
                } : { scaleType: 'band', dataKey: props.labelField } 
            ]}
            series={[{
                dataKey: props.dataField, valueFormatter
            }]}
            layout={!isSmallScreen ? 'vertical' : 'horizontal'}
            {...chartSetting}
            onAxisClick={(_, data) => handleAxisClick(data)}
            onItemClick={(_,data) => { handleItemClick(data.dataIndex)}}
            
        />
    );
};

export default SimpleBarChart;