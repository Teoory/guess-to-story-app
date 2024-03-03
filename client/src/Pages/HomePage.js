import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const randomRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = async () => {
    const response = await fetch('http://localhost:3030/createRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'user1', roomId: randomRoomCode()}),
    });
    const data = await response.json();
    navigate(`/room/${data.roomId}`);
    localStorage.setItem('username', 'user1');
  };

  const handleJoinRoom = async () => {
    const response = await fetch(`http://localhost:3030/joinRoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomId: roomCode, username: 'user2' }),
    });
    const data = await response.json();
    navigate(`/room/${data.roomId}`);
    localStorage.setItem('username', 'user2');
  };

  const handleInputChange = (e) => {
    setRoomCode(e.target.value);
  };

  return (
    <div className='home-page-container'>
        <h1>Home Page</h1>
        <div className="buttonArea">
          <button className='home-page-button' onClick={handleCreateRoom}>New Room</button>
          <input className='home-page-input' type="text" placeholder="Enter room code" value={roomCode} onChange={handleInputChange} />
        </div>
        <button className='home-page-button joinButton' onClick={handleJoinRoom}>Join</button>
        <div className="Amac">
          <p>Sherlock</p>
          <p>Anlatıcının görevi: <span>Hikayeyi okuyarak oyuncuları yönlendirmeli ve oyuncuların hikayeyi bulmasını sağlamaktır.</span></p>
          <p>Oyuncunun görevi: <span>Bize verilen cümleden yola çıkarak anlatıcıya doğru, yanlış soruları sorarak hikayeyi bulmalı ve olayları çözmelidir.</span></p>
        </div>
        
        <div className="HowToPlay">
          <p>How to play:</p>
          <p>1. Create a new room or join an existing room</p>
          <p>2. Share the room code with your friends</p>
          <p>3. Start playing!</p>
        </div>
    </div>
  );
}

export default HomePage;
