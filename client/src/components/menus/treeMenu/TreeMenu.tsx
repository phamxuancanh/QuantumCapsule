
import React from 'react';
import { RichTreeView, TreeViewBaseItem } from '@mui/x-tree-view/'
import { Box, Stack, SxProps } from '@mui/material';

export interface ITreeMenuProps {
    apiRef?: React.MutableRefObject<any>; // useTreeViewApiRef()
    dataTreeView: TreeViewBaseItem[];
    onSelectedItemsChange?: (itemId: string | null) => void;
    sx?: SxProps
}

const TreeMenu: React.FC<ITreeMenuProps> = (props: ITreeMenuProps) => {
    const { apiRef, dataTreeView, onSelectedItemsChange, sx } = props;

    return (
        <div>
            <Stack spacing={2}>
                <Box sx={{ minHeight: 352, minWidth: 250 }}>
                    <RichTreeView 
                        items={dataTreeView} 
                        apiRef={apiRef} 
                        onSelectedItemsChange={(_,itemId) => {
                            onSelectedItemsChange && onSelectedItemsChange(itemId);
                        }}
                        sx={sx}
                    />
                </Box>
            </Stack>
        </div>
    );
};

export default TreeMenu;