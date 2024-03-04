import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Guess from '../Components/Guess';
import CheckGuess from '../Components/CheckGuess';

function RoomPage() {
    const { id } = useParams();
    const [playerCount, setPlayerCount] = useState(1);
    const [username, setUsername] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [GameStarted, setGameStarted] = useState(false);
    const [storyTeller, setStoryTeller] = useState(false);
    const [player, setPlayer] = useState(false);
    const [storyTellerCount, setStoryTellerCount] = useState(0);
    const [story, setStory] = useState('');
    const [selectedStory, setSelectedStory] = useState('');
    const [getStory, setGetStory] = useState(false);
    const [ApproveStory, setApproveStory] = useState(false);
    const [checkedStory, setCheckedStory] = useState(false);
    const [codeVisible, setCodeVisible] = useState(false);

    const fetchRoomData = async () => {
        if (!GameStarted) {
            const response = await fetch(`https://guess-to-story-api.vercel.app/room/${id}/userCount`);
            const data = await response.json();
            setPlayerCount(data.userCount);
        } else {
            return;
        }
    };

    useEffect(() => {
        setUsername(localStorage.getItem('username'));
    }, []); 

    useEffect(() => {
        const interval = setInterval(() => {
            fetchRoomData();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        firstHandlePlayer();
    }, []);

    const handleLeaveGame = () => {
        const response = fetch('https://guess-to-story-api.vercel.app/leaveRoom', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id, username }),
        });
    }
    const handleModLeaveGame = () => {
        const response = fetch('https://guess-to-story-api.vercel.app/deleteRoom', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id, username }),
        });
        if (response.ok) {
            localStorage.removeItem('username');
            setRedirect(true);
        }
        else {
            console.log('Error deleting room');
        }
    }

    const handleStartGame = () => {
        if (!GameStarted) {
        fetch(`https://guess-to-story-api.vercel.app/room/${id}/gameStarted`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id }),
        });
        setGameStarted(true);
        } else {
            return;
        }
    };

    const checkGameStarted = async () => {
        if (!GameStarted) {
            const response = await fetch(`https://guess-to-story-api.vercel.app/room/${id}/gameStarted`);
            const data = await response.json();
            setGameStarted(data.gameStarted); 
        } else {
            return;
        }
    };


    const checkStoryTellerCount = async () => {
        if (!GameStarted) {
            const response = await fetch(`https://guess-to-story-api.vercel.app/room/${id}/storyTellerCount`);
            const data = await response.json();
            setStoryTellerCount(data.storyTellerCount);
        } else {
            return;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            checkStoryTellerCount();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            checkGameStarted();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const checkStory = async () => {
        if (!getStory) {
        const response = await fetch(`https://guess-to-story-api.vercel.app/story`);
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.length);
        setStory(data[randomIndex]);
        }
        else {
            return;
        }
    };
    
    if (GameStarted && !storyTeller && !checkedStory) {
        setTimeout(() => {
            CheckGameStory();
        }, 3000);
    }

    const CheckGameStory = async () => {
        const response = await fetch(`https://guess-to-story-api.vercel.app/room/${id}/story`);
        const data = await response.json();
        setStory(data.story);
        setSelectedStory(data.story);
        console.log(data.story);
        setCheckedStory(true);
    }

    if(GameStarted && !getStory && storyTeller) {
        checkStory();
        setGetStory(true);
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    if (username === 'user2') {
        setTimeout(async () => {
            const response = await fetch(`https://guess-to-story-api.vercel.app/room/${id}`);
            if (!response.ok) {
                setRedirect(true);
            }
        }, 3000);
    }

    const handleStoryTeller = () => {
        fetch(`https://guess-to-story-api.vercel.app/room/${id}/storyTellerCountAdd`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id }),
        });
        fetch(`https://guess-to-story-api.vercel.app/room/${id}/playerCountDell`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id }),
        });
        setStoryTeller(true);
        setPlayer(false);
    }

    const handlePlayer = () => {
        fetch(`https://guess-to-story-api.vercel.app/room/${id}/storyTellerCountDel`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id }),
        });
        fetch(`https://guess-to-story-api.vercel.app/room/${id}/playerCountAdd`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id }),
        });
        setStoryTeller(false);
        setPlayer(true);
    }

    const firstHandlePlayer = () => {
        fetch(`https://guess-to-story-api.vercel.app/room/${id}/playerCountAdd`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id }),
        });
    }

    const GameStory = () => {
        fetch(`https://guess-to-story-api.vercel.app/room/${id}/story`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roomId: id, story: story.cümle }),
        });
        setApproveStory(true);
    }

    const NewStory = async () => {
        const response = await fetch(`https://guess-to-story-api.vercel.app/story`);
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.length);
        setStory(data[randomIndex]);
    }
    
    const copyCodeToClipboard = () => {
        const el = document.createElement('textarea');
        el.value = `${id}`; // Kod buraya gelecek
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };    

    return (
        <div className='room-container'>
            <div className="CodeArea">
                <Link onClick={() => setCodeVisible(!codeVisible)}>{codeVisible ? (<span>😲</span>) : (<span>🤐</span>)}</Link>
                {codeVisible ? (
                    <div className="code-container">
                        <h1 className='room-header'><span>{id}</span></h1>
                    </div>
                ) : (<h1 className='room-header'>Room: ######</h1>)
                }
                <Link onClick={copyCodeToClipboard}>Copy Code</Link>
            </div>
            <p className='player-count'>number of players: <span>{playerCount}</span></p>
            {!GameStarted ? (
                <>
                {playerCount >= 2 ? (
                    null
                ) : (
                    <p className='waiting-message'>Waiting for other players...</p>
                )}

                {username === 'user1' && playerCount >= 2 ? (
                    <>
                        {storyTellerCount === 1 ? (
                            <div className="fx-c"><button className='start-game-button' onClick={handleStartGame}>Start Game</button></div>
                        ) : null}
                    </>
                ) : null}

                {username === 'user1' ? (
                    <div className='fx-c'><Link className='leave-room-link' to="/" onClick={handleModLeaveGame}>Delete Room</Link></div>
                ) : username === 'user2' ? (
                    <div className="fx-c"><Link className='leave-room-link' to="/" onClick={handleLeaveGame}>Leave Room</Link></div>
                ) : null}

                    <p className='role-info storyTellerCount'>StoryTellerCount: <span className={storyTellerCount === 0 ? 'danger' : 'success'}>{storyTellerCount}/1</span></p>
                    <p className='role-info YourInfo'>Your Role: <span className={!storyTeller ? 'info' : 'success'}>{storyTeller ? 'Story Teller' : 'Player'}</span></p>
                    {!storyTeller ? (
                        <>
                        {storyTellerCount === 0 ? (
                            <>
                            <p>Choose your role:</p>
                            <button className='role-button' onClick={handleStoryTeller}>Story Teller</button>
                            </>
                        ) : null}
                        </>
                    ) : (
                        <button className='role-button' onClick={handlePlayer}>Player</button>
                    )}
                </>
            ): (
                <>
                    <p className='game-info'>Game has started!</p>
                    {storyTeller ? (
                        <div>
                            <p className='story-teller-info'>Your Role: Story Teller</p>
                            <p className='story-info-t'>Cümle: {story.cümle}</p>
                            <p className='story-info-p'>Hikaye: {story.hikaye}</p>
                            {/* hikayeyi onayla */}
                            {!ApproveStory ? (
                                <div className='story-buttons'>
                                <button className='story-button' onClick={NewStory}>New Story</button>
                                <button className='story-button' onClick={GameStory}>Approve Story</button>
                                </div>
                            ): null}
                            <CheckGuess />
                        </div>
                    ) : (
                        <div>
                            <p className='player-info'>Your Role: Player</p>
                            {(GameStarted && selectedStory !== '') ? (
                                <p className='story-info'> Cümle: {selectedStory}</p>
                            ) : (
                                <p className='waiting-message'>Waiting for story teller...</p>
                            )}
                            <Guess />
                        </div>
                    )}
                    <div className='fx-c' style={{marginTop:'100px'}}><Link className='leave-room-link' to="/" onClick={handleLeaveGame}>Leave Room</Link></div>
                </>                
            )}
        </div>
    );
}

export default RoomPage;