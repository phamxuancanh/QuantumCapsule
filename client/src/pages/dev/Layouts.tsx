import InfoCard from 'components/cards/infoCard/InfoCard';
import { IInfoFormProps } from 'components/forms/infoForm/InfoForm';
import GridLayout, {GridLayoutProps} from 'components/layouts/grid/GridLayout';
import React from 'react';


const Layouts: React.FC = () => {
    const userProps: IInfoFormProps = {
        image: 'https://static.vinwonders.com/production/cach-tao-dang-chup-anh-2.jpg',
        name: 'John Doe',
        masterParams: ['Age', 'Country'],
        detailParams: ['Occupation', 'Hobby'],
        data: {
            Age: '30',
            Country: 'USA',
            Occupation: 'Engineer',
            Hobby: 'Photography Photography Photography '
        }
    };
    const items = (): any[] => {
        const array: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return array.map((item) => {
            return (
                <div key={item}>
                    <InfoCard
                        {...userProps}
                        btn1Name='Edit'
                        onClickBtn1={(btnName, data) => console.log(btnName, data)}
                        btn2Name='Delete'
                        onClickBtn2={(btnName, data) => console.log(btnName, data)}
                    />
                </div>
            )
        })
    }
    const GridLayoutProps: GridLayoutProps ={
        items: items(),
        columnSpacing: 10,
        itemSpacing: {xs: 10,sm: 5, md: 10/3, lg: 2.5, xl: 2}
    }
    return (
        <div>
            <GridLayout {...GridLayoutProps}/>
        </div>
    );
};

export default Layouts;