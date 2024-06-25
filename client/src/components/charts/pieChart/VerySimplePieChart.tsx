import { PieChart } from '@mui/x-charts/PieChart';
import React from 'react';

export interface IVerySimplePieChartProps {
    data: any;
    labels: string[];
    height: number,
    width: number,
    arcLabel?: 'formattedValue' | 'label' | 'value' | undefined,
    onItemClick?: (index: number) => void;
}

const VerySimplePieChart: React.FC<IVerySimplePieChartProps> = (props: IVerySimplePieChartProps) => {
    const [state, setState] = React.useState<{arrData: { id: any, label: string, value: number }[]}>({
        arrData: []
    });
    React.useEffect(() => {
        const arrData = props.labels.map((label, index) => {
            return {
                id: index,
                label: label,
                value: props.data?.[label]
            };
        });
        setState({arrData: arrData});
    }, [props.data, props.labels]);

    return (
        <PieChart
            series={[
                {
                    data: state.arrData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    valueFormatter: (value, _) => {
                        const percentage = (value.value / state.arrData.reduce((a, b) => a + b.value, 0)) * 100;
                        return `${percentage.toFixed(2)}%`;
                    },
                    arcLabel: props.arcLabel? props.arcLabel : undefined,
                },
            ]}
            height={props.height}
            width={props.width}
            // margin={{left: }}
            onItemClick={(_,item) => {
                props.onItemClick && props.onItemClick(item.dataIndex);
            }}
        />
    );
};

export default VerySimplePieChart;