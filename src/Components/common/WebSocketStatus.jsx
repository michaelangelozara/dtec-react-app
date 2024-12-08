import React from 'react';
import { useWebSocketContext } from '../../services/websocket/WebSocketProvider';

const WebSocketStatus = () => {
  const { isConnected } = useWebSocketContext();

  return (
    <div className="fixed bottom-4 right-4">
      <span className={`inline-block px-2 py-1 rounded text-sm ${
        isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}>
        {isConnected ? 'Connected to Server' : 'Disconnected'}
      </span>
    </div>
  );
};

export default WebSocketStatus;