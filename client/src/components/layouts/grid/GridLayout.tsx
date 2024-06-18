import { Box, Button, Typography, TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React, { useState } from 'react';

interface ISpacing {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
}

export interface GridLayoutProps {
    items: any[]
    columnSpacing?: number
    itemSpacing?: ISpacing
    itemsPerPage?: number // Thêm thuộc tính itemsPerPage
}

const GridLayout: React.FC<GridLayoutProps> = (props: GridLayoutProps) => {
    const { items, columnSpacing, itemSpacing, itemsPerPage = 8 } = props;

    const [currentPage, setCurrentPage] = useState(0);
    const [pageInput, setPageInput] = useState('1');

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
        setPageInput(String(currentPage));
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
        setPageInput(String(currentPage + 2));
    };

    const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageInput(event.target.value);
    };

    const handlePageInputSubmit = () => {
        const pageNumber = Number(pageInput) - 1;
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber);
        } else {
            setPageInput(String(currentPage + 1)); // Reset to current page if input is invalid
        }
    };

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Grid2 container columnSpacing={columnSpacing} sx={{ display: 'flex', justifyContent: "space-around", alignItems: "center" }}>
                {currentItems.map((item: any, index: number) => (
                    <Grid2
                        component="div"
                        xs={itemSpacing?.xs}
                        md={itemSpacing?.md}
                        sm={itemSpacing?.sm}
                        lg={itemSpacing?.lg}
                        xl={itemSpacing?.xl}
                        sx={{ display: 'flex', justifyContent: "center", alignItems: "center" }}
                        key={index}
                    >
                        {item}
                    </Grid2>
                ))}
            </Grid2>
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
                <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 0}>
                    Previous
                </Button>
                <Typography variant="body1">
                    Page {currentPage + 1} of {totalPages}
                </Typography>
                <Button variant="contained" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                    Next
                </Button>
            </Box>
            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center' }}>
                <TextField
                    label="Go to page"
                    variant="outlined"
                    size="small"
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onBlur={handlePageInputSubmit}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            handlePageInputSubmit();
                        }
                    }}
                    sx={{ width: 100 }}
                />
                <Button variant="contained" onClick={handlePageInputSubmit}>
                    Go
                </Button>
            </Box>
        </Box>
    );
};

export default GridLayout;
