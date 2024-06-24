import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
export interface ISimplePieChartProps {
    data: { id: any, label: string, value: number }[];
    width: number;
    height: number;
}

const SimplePieChart: React.FC<ISimplePieChartProps> = (props: ISimplePieChartProps) => {
    // Component logic goes here

    return (
        <PieChart
            series={[
                {
                    data: props.data,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    valueFormatter: (value, _) => {
                        const percentage = (value.value / props.data.reduce((a, b) => a + b.value, 0)) * 100;
                        return `${percentage.toFixed(2)}%`;
                    },
                    arcLabel: 'formattedValue'
                },
            ]}
            height={props.height}
            width={props.width}
        />
    );
};

export default SimplePieChart;