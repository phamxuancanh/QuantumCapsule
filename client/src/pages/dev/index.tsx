import React from 'react';
import { Box } from '@mui/material';
import CRUD from './tabs/testComponents/CRUD'
import Components from './tabs/testComponents/Components';
import Layouts from './tabs/testComponents/Layouts';
import GridSetting from './tabs/GridSetting';
import Payment from './tabs/testComponents/Payment';
import RoomManager from './tabs/testComponents/RoomManager';
import Charts from './tabs/testComponents/Charts';

import TableCustom from './tabs/testComponents/TableCustom';
import TabMenu from 'components/menus/tabMenu/TabMenu';
import ExamSystem from './tabs/examination/ExamSystem';
const DevPage: React.FC = () => {
    
    return (
        <div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabMenu
                    listItems={[
                        {
                            index: 0, label: 'tables',
                            item: <TabMenu listItems={[
                                { index: 0, label: 'table custom', item: <TableCustom /> },
                                { index: 1, label: 'table CRUD', item: <CRUD /> },
                            ]} defaultIndex={0} />
                        },
                        {
                            index: 1, label: 'payment',
                            item: <Payment />
                        },
                        {
                            index: 2, label: 'Examination System',
                            item: <ExamSystem />
                        },
                        {
                            index: 3, label: 'charts',
                            item: <Charts />
                        },
                        {
                            index: 4, label: 'layouts',
                            item: <TabMenu 
                                listItems= {[
                                    {index: 0,label: 'grids', item: <Layouts />},
                                    {index: 1, label: 'buttons',item: <RoomManager />}
                                ]} 
                                defaultIndex={0}
                            /> 
                        },
                        {
                            index: 5, label: 'grid setting',
                            item: <GridSetting />
                        },
                        {
                            index: 6, label: 'components',
                            item: <Components />
                        }
                    ]}
                    defaultIndex={2}
                />
            </Box>

        </div>
    );
};

export default DevPage;