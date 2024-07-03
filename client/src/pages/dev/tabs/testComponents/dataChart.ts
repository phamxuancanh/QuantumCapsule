const dataset: {}[]= [
    // Dữ liệu cho năm 2017
    { country: 'USA', year: 2017, other: 0, bio: 0.5, solar: 0.9, wind: 6.3, hydro: 7.3, nuclear: 19.7, oil: 20.5, gas: 31.7, coal: 12.9 },
    { country: 'China', year: 2017, other: 0, bio: 0.7, solar: 0.2, wind: 3.9, hydro: 19.3, nuclear: 1.9, oil: 1.8, gas: 6.6, coal: 66.6 },
    { country: 'Japan', year: 2017, other: 0, bio: 0.2, solar: 4.3, wind: 0.4, hydro: 8.3, nuclear: 3.2, oil: 43.6, gas: 8.3, coal: 31.7 },
    { country: 'Germany', year: 2017, other: 0, bio: 7.1, solar: 3.1, wind: 15.1, hydro: 3.2, nuclear: 6.1, oil: 35.1, gas: 12.1, coal: 18.2 },
    { country: 'India', year: 2017, other: 0, bio: 2.2, solar: 1.3, wind: 2.9, hydro: 4.6, nuclear: 1.9, oil: 25.7, gas: 6.8, coal: 54.6 },
    { country: 'Russia', year: 2017, other: 0, bio: 0.3, solar: 0, wind: 0.1, hydro: 3.1, nuclear: 18.7, oil: 42.7, gas: 16.7, coal: 18.4 },
    { country: 'South Korea', year: 2017, other: 0, bio: 2.2, solar: 0.7, wind: 0.9, hydro: 2.5, nuclear: 11.7, oil: 43.7, gas: 16.7, coal: 21.5 },
    
    // Dữ liệu cho năm 2018
    { country: 'USA', year: 2018, other: 0.1, bio: 0.6, solar: 1.1, wind: 6.9, hydro: 7.1, nuclear: 19.3, oil: 21.0, gas: 31.0, coal: 12.5 },
    { country: 'China', year: 2018, other: 0.1, bio: 0.8, solar: 0.3, wind: 4.1, hydro: 19.0, nuclear: 2.0, oil: 1.9, gas: 6.8, coal: 65.0 },
    { country: 'Japan', year: 2018, other: 0.1, bio: 0.3, solar: 4.5, wind: 0.5, hydro: 8.1, nuclear: 3.3, oil: 42.5, gas: 8.2, coal: 31.5 },
    { country: 'Germany', year: 2018, other: 0.1, bio: 7.3, solar: 3.3, wind: 15.7, hydro: 3.1, nuclear: 6.0, oil: 34.5, gas: 12.0, coal: 17.5 },
    { country: 'India', year: 2018, other: 0.1, bio: 2.3, solar: 1.5, wind: 3.2, hydro: 4.4, nuclear: 2.0, oil: 25.5, gas: 6.5, coal: 54.0 },
    { country: 'Russia', year: 2018, other: 0.1, bio: 0.4, solar: 0, wind: 0.2, hydro: 3.0, nuclear: 18.5, oil: 42.5, gas: 16.5, coal: 18.0 },
    { country: 'South Korea', year: 2018, other: 0.1, bio: 2.3, solar: 0.8, wind: 1.0, hydro: 2.4, nuclear: 11.5, oil: 43.5, gas: 16.5, coal: 21.0 },
    
    // Dữ liệu cho năm 2019
    { country: 'USA', year: 2019, other: 0.2, bio: 0.7, solar: 1.3, wind: 7.5, hydro: 6.9, nuclear: 19.1, oil: 21.5, gas: 30.5, coal: 12.1 },
    { country: 'China', year: 2019, other: 0.2, bio: 0.9, solar: 0.4, wind: 4.3, hydro: 18.8, nuclear: 2.1, oil: 2.0, gas: 7.0, coal: 63.5 },
    { country: 'Japan', year: 2019, other: 0.2, bio: 0.4, solar: 4.7, wind: 0.6, hydro: 7.9, nuclear: 3.4, oil: 41.5, gas: 8.1, coal: 31.3 },
    { country: 'Germany', year: 2019, other: 0.2, bio: 7.5, solar: 3.5, wind: 16.3, hydro: 3.0, nuclear: 5.9, oil: 34.0, gas: 11.9, coal: 16.8 },
    { country: 'India', year: 2019, other: 0.2, bio: 2.4, solar: 1.7, wind: 3.5, hydro: 4.3, nuclear: 2.1, oil: 25.3, gas: 6.3, coal: 53.5 },
    { country: 'Russia', year: 2019, other: 0.2, bio: 0.5, solar: 0, wind: 0.3, hydro: 2.9, nuclear: 18.3, oil: 42.3, gas: 16.3, coal: 17.6 },
    { country: 'South Korea', year: 2019, other: 0.2, bio: 2.4, solar: 0.9, wind: 1.1, hydro: 2.3, nuclear: 11.3, oil: 43.3, gas: 16.3, coal: 20.5 },
    
    // Dữ liệu cho năm 2020
    { country: 'USA', year: 2020, other: 0.3, bio: 0.8, solar: 1.5, wind: 8.1, hydro: 6.7, nuclear: 18.9, oil: 22.0, gas: 30.0, coal: 11.7 },
    { country: 'China', year: 2020, other: 0.3, bio: 1.0, solar: 0.5, wind: 4.5, hydro: 18.6, nuclear: 2.2, oil: 2.1, gas: 7.2, coal: 62.0 },
    { country: 'Japan', year: 2020, other: 0.3, bio: 0.5, solar: 4.9, wind: 0.7, hydro: 7.7, nuclear: 3.5, oil: 40.5, gas: 8.0, coal: 31.0 },
    { country: 'Germany', year: 2020, other: 0.3, bio: 7.7, solar: 3.7, wind: 17.0, hydro: 2.9, nuclear: 5.8, oil: 33.5, gas: 11.8, coal: 16.1 },
    { country: 'India', year: 2020, other: 0.3, bio: 2.5, solar: 1.9, wind: 3.8, hydro: 4.2, nuclear: 2.2, oil: 33.2, gas: 6.2, coal: 52.2 },
    { country: 'Russia', year: 2020, other: 0.3, bio: 0.6, solar: 0, wind: 0.4, hydro: 2.7, nuclear: 18.1, oil: 42.1, gas: 16.1, coal: 17.2 },
    { country: 'South Korea', year: 2020, other: 0.3, bio: 2.5, solar: 1.0, wind: 1.2, hydro: 2.1, nuclear: 11.1, oil: 43.1, gas: 16.1, coal: 20.0 },
];

export default dataset;
export type datasetType = {
    country: string,
    year: number,
    other: number,
    bio: number,
    solar: number,
    wind: number,
    hydro: number,
    nuclear: number,
    oil: number,
    gas: number,
    coal: number
};