import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTheoryById } from 'api/theory/theory.api';
import { ITheory } from 'api/theory/theory.interface';

const Learning = () => {
  const [theory, setTheory] = useState<ITheory | null>(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const theoryId = queryParams.get('theoryId');

    if (theoryId) {
      fetchTheory(theoryId);
    }
  }, [location]);

  const fetchTheory = async (id: string) => {
    try {
      const response = await getTheoryById(id);
      setTheory(response.data.theory);
      console.log('Theory Name:', response.data);
    } catch (error) {
      console.error('Error fetching theory:', error);
    }
  };

  return (
      <div className='tw-flex tw-flex-col tw-items-center tw-justify-center'>
          <div className='tw-bg-blue-200 tw-w-full'>navigation</div>
          <div className='tw-w-4/5 tw-flex tw-bg-red-200'>
              <div className='tw-flex tw-flex-col tw-space-y-3'>
                  <div className='tw-font-bold tw-text-2xl'>{theory?.name}</div>
              </div>
          </div>
      </div>
  );
};

export default Learning;