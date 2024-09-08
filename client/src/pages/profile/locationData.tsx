import axios from 'axios';

export type Ward = {
  Id: string;
  Name: string;
};

export type District = {
  Id: string;
  Name: string;
  Wards: Ward[];
};

export type City = {
  Id: string;
  Name: string;
  Districts: District[];
};

export const fetchLocations = async (): Promise<City[]> => {
  try {
    const response = await axios.get<City[]>('https://raw.githubusercontent.com/phamxuancanh/DiaGioiHanhChinhVN/master/data.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
