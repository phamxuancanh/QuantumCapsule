import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
export interface ISimpleLineChartProps {
    dataset: any[];
    labelField: string;
    dataField: string;
    yAxis?: string;
    width?: number
    height?: number
    valueFormatter?: (value: number | null) => string;

    onItemClick?: (index: number) => void;

}

const SimpleLineChart: React.FC<ISimpleLineChartProps> = (props: ISimpleLineChartProps) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const valueFormatter = props.valueFormatter;
    return (
        <div>
            <LineChart
                dataset={props.dataset}
                xAxis={[{ scaleType: 'point', dataKey: props.labelField }]}
                yAxis={[{ label: props.yAxis }]}
                series={[{
                    dataKey: props.dataField, valueFormatter
                }]}
                width={!isSmallScreen? props.width || 500 : 400}
                height={!isSmallScreen? props.height || 300 : 300}
                sx={{
                    [`.${axisClasses.left} .${axisClasses.label}`]: {
                        transform: 'translate(-8px, 0px)',
                    },
                }}

                onMarkClick={(_,item)=>{
                    props.onItemClick && props.onItemClick(item.dataIndex!)
                }}

            />
        </div>
    );
};

export default SimpleLineChart;