import { io } from 'socket.io-client';

const socket = io('https://live-polling-backend-puce.vercel.app/'); // Replace with your backend URL in production

export default socket;
