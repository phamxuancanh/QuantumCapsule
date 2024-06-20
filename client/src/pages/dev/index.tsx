import React from 'react';
import CRUD from './tabs/CRUD'
import { Box, Tab, Tabs } from '@mui/material';
import Components from './tabs/Components';
import Layouts from './tabs/Layouts';
import GridSetting from './tabs/GridSetting';
import Payment from './tabs/Payment';
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
    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="components" {...a11yProps(1)}/>
                    <Tab label="paypal" {...a11yProps(0)} />
                    <Tab label="table grid" {...a11yProps(2)} />
                    <Tab label="layout grid" {...a11yProps(3)} />
                    <Tab label="grid setting" {...a11yProps(4)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={1}>
                <Payment />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={0}>
                <Components />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <CRUD />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <Layouts />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
                <GridSetting />
            </CustomTabPanel>
        </div>
    );
};

export default DevPage;