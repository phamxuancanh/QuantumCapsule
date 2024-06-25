import { BarChart } from '@mui/x-charts/BarChart';
import React from 'react';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface IVerySimpleBarChartProps {
    data: any
    labels: string[]
    yAxis: string
    width?: number
    height?: number
    valueFormatter?: (value: number | null) => string
    onItemClick?: (index: number) => void
}

const VerySimpleBarChart: React.FC<IVerySimpleBarChartProps> = (props: IVerySimpleBarChartProps) => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [state, setState] = React.useState<{ arrData: number[] }>({
        arrData: []
    });
    React.useEffect(() => {
        const tempArr: number[] = [];
        for (const label of props.labels) {
            tempArr.push(props.data?.[label]);
        }
        setState({
            arrData: tempArr
        });
    }, [props.data, props.labels]);
    const handleItemClick = (index: number) => {
        props.onItemClick && props.onItemClick(index)
    }
    return (
        // JSX markup goes here
        <div>
            <BarChart
                margin={{ left: 100 }}
                xAxis={!isSmallScreen?[{ scaleType: 'band', data: props.labels }]: undefined}
                yAxis={isSmallScreen?[{ scaleType: 'band', data: props.labels }]: undefined}
                series={[{ data: state.arrData, valueFormatter: props.valueFormatter }]}
                width={!isSmallScreen? props.width: 400}
                height={!isSmallScreen? props.height: 300}
                onItemClick={(_, data) => { handleItemClick(data.dataIndex) }}
                layout={!isSmallScreen ? 'vertical' : 'horizontal'}
            />
        </div>
    );
};

export default VerySimpleBarChart;