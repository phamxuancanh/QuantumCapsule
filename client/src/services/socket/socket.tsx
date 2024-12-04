import { io } from 'socket.io-client';

// const socket = io(`${process.env.REACT_APP_API}`, {
const socket = io('http://localhost:8000', {
  withCredentials: true
});

export default socket;