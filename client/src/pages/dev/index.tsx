import GridTable from 'components/tables/gridTable/GridTable';
import React from 'react';

const DevPage: React.FC = () => {
    return (
        <>
            <GridTable 
                tableName="Test Table"
                tableData={[
                    { name: 'John', age: 25, job: 'Engineer' },
                    { name: 'Jane', age: 22, job: 'Doctor' },
                    { name: 'Joe', age: 30, job: 'Teacher' },
                ]}
            />
        </>
    );
};

export default DevPage;