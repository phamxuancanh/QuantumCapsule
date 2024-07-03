import { SxProps } from '@mui/material';
import { Box } from '@mui/system';
import IconBtn from 'components/buttons/iconBtn/Iconbtn';
import React, { useEffect, useState } from 'react';
import { IconName } from 'utils/enums';

export interface ITimeCountdownProps {
  initialSeconds: number;
  sx?: SxProps;
  onCountdownEnd?: () => void;
}

const TimeCountdown: React.FC<ITimeCountdownProps> = (props: ITimeCountdownProps) => {
  const { initialSeconds, sx } = props
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (seconds === 0 && props.onCountdownEnd) {
      props.onCountdownEnd();
    }
  }, [seconds]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Box>
      <IconBtn
        iconName={IconName.clock}
        name={formatTime(seconds)}
        onClick={() => { }}
        sx={sx}
        variant='outlined'
      />
      {/* <p>{formatTime(seconds)}</p> */}
    </Box>
  );
};

export default TimeCountdown;