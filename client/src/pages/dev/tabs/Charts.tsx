import { Button } from '@mui/material';
import SimpleBarChart, { ISimpleBarChartChartProps } from 'components/charts/barChart/SimpleBarChart';
import React, { useEffect } from 'react';
import { calculateData, filterByField, filterByFields } from 'utils/functions';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import dataset, {datasetType}from './dataChart';
import VerySimpleBarChart, { IVerySimpleBarChartProps } from 'components/charts/barChart/VerySimpleBarChart';
import VerySimplePieChart, { IVerySimplePieChartProps } from 'components/charts/pieChart/VerySimplePieChart';
import SimpleLineChart, { ISimpleLineChartProps } from 'components/charts/lineChart/SimpleLineChart';

const Charts: React.FC = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const parentData = React.useMemo(() => {
        const filterByYear = filterByField(dataset, 'year', 2020)
        const resultTemp = filterByYear.map((data) => {
            return calculateData(data, 'country', ['other', 'bio', 'solar', 'wind', 'hydro', 'nuclear', 'oil', 'gas', 'coal'], 'sum')
        })
        return resultTemp
    }, [])

    const [columnSelectIndex, setColumnSelectIndex] = React.useState(0)
    const [childData, setChildData] = React.useState<datasetType>({
        country: "",
        year: 0,
        other: 0,
        bio: 0,
        solar: 0,
        wind: 0,
        hydro: 0,
        nuclear: 0,
        oil: 0,
        gas: 0,
        coal: 0
    })
    const [lineData, setLineData] = React.useState<{index: number, key: any, value: number}[]>([])
    useEffect(() => {
        const tempChildData = filterByFields(dataset, ['country', 'year'], [parentData[columnSelectIndex].key, 2020])
        setChildData(tempChildData[0])

        const tempLineData = filterByField(dataset, 'country', parentData[columnSelectIndex].key)
        
        const lineData = tempLineData.map((data) => {
            return calculateData(data, 'year', ['other', 'bio', 'solar', 'wind', 'hydro', 'nuclear', 'oil', 'gas', 'coal'], 'sum')
        })
        setLineData(lineData)
    },[columnSelectIndex, parentData])

    const handleClick = () => {
        console.log(parentData);
        console.log(childData);
        console.log(lineData);
    }

    const barChartProps: ISimpleBarChartChartProps = {
        yAxis: 'TWh',
        width: 700,
        height: 300,
        valueFormatter: (value: number | null) => `${value} TWh`,
        dataset: parentData,
        labelField: "key",
        dataField: "value",
        onItemClick(index) {
            setColumnSelectIndex(index)
        },
    }
    const barChartChildProps: IVerySimpleBarChartProps = {
        yAxis: 'TWh',
        width: 600,
        height: 300,
        valueFormatter: (value: number | null) => `${value} TWh`,
        data: childData,
        labels: ["gas", "coal", "oil", "nuclear", "hydro", "wind", "solar", "bio", "other"],
    }
    const pieChartProps: IVerySimplePieChartProps = {
        data: childData,
        labels: ["gas", "coal", "oil", "nuclear", "hydro", "wind", "solar", "bio", "other"],
        height: 200,
        width: 550,
    }
    const lineChartProps: ISimpleLineChartProps = {
        dataset: lineData,
        labelField: 'key',
        dataField: 'value',
        width: 700,
        height: 300,
        yAxis: "TWh"
    }
    return (
        <div className='app-container'>
            <Button onClick={handleClick}> do something</Button>
            <SimpleBarChart {...barChartProps} />
            <SimpleLineChart {...lineChartProps}/>
            <div style={{display: 'flex', alignItems: "center", flexDirection: !isSmallScreen? 'row' : 'column' }}>
                <VerySimpleBarChart {...barChartChildProps}/>
                <VerySimplePieChart  {...pieChartProps}/>
            </div>

        </div>
    );
};

export default Charts;