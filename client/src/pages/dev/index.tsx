import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import CRUD from './tabs/CRUD'
import Components from './tabs/Components';
import Layouts from './tabs/Layouts';
import GridSetting from './tabs/GridSetting';
import Payment from './tabs/Payment';
import Excel from './tabs/Excel';
import RoomManager from './tabs/RoomManager';
import Charts from './tabs/Charts';
import TableCustom from './tabs/TableCustom';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
const DevPage: React.FC = () => {
    const [value, setValue] = React.useState(0);
    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
            </div>
        );
    }
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="custom table" />
                    <Tab label="paypal"  />
                    <Tab label="charts" />
                    <Tab label="table grid" />
                    <Tab label="layout grid" />
                    <Tab label="grid setting" />
                    <Tab label="excel" />
                    <Tab label="rooms" />
                    <Tab label="components" />

                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <TableCustom />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={8}>
                <Components />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <Charts />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={7}>
                <RoomManager />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={6}>
                <Excel />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Payment />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <CRUD />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
                <Layouts />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
                <GridSetting />
            </CustomTabPanel>
        </div>
    );
};

export default DevPage;