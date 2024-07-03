import { Box, Tab, Tabs, Typography } from '@mui/material';
import React from 'react';
import './index.scss'

export interface ITabMenuProps {
    listItems: { index: number, label: string, item: any, disabled?: boolean }[]
    defaultIndex?: number
    vertical?: boolean
}
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
const TabMenu: React.FC<ITabMenuProps> = (props: ITabMenuProps) => {
    const [value, setValue] = React.useState(props.defaultIndex || 0);
    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <Box
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </Box>
        );
    }
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box sx={{display: props.vertical? 'flex' : 'inline', width: '100%'}}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant='scrollable'
                scrollButtons='auto'
                allowScrollButtonsMobile
                orientation={props.vertical ? 'vertical' : 'horizontal'}
            >
                {props.listItems.sort((a, b) => a.index - b.index).map((item) => {
                    return <Tab 
                        key={item.index} label={item.label} disabled={item.disabled}
                    />
                })}
            </Tabs>
            {props.listItems.map((item) => {
                return <CustomTabPanel key={item.index} value={value} index={item.index}>
                    {item.item}
                </CustomTabPanel>
            })}
        </Box>
    );
};

export default TabMenu;