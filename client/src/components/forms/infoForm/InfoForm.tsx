import React from 'react';
import './index.scss'

interface IProps {
    image: string;
    name: string;
    masterParams: string[] // names of main fields
    detailParams: string[] // names of detail fields
    data: any
}

const InfoForm: React.FC<IProps> = (props: IProps) => {
    const { image, name, masterParams, detailParams, data } = props;
    return (
        <div className="info-form">
            <div className="info-header">
                <div className="image-container">
                    <img src={image} alt={`${name}'s avatar`} />
                </div>
                <div className="main-info">
                    <h1>{name}</h1>
                    <ul>
                        {masterParams.map((param, index) => (
                            <li key={index}>
                                <strong>{param}: </strong>{data[param]}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="details-section">
                <h2>Details</h2>
                <ul>
                    {detailParams.map((param, index) => (
                        <li key={index}>
                            <strong>{param}: </strong>{data[param]}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default InfoForm;