import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const Guess = () => {
    const { id } = useParams();
    const [story, setStory] = useState ('');
    const [guess, setGuess] = useState ('');
    const [guesses, setGuesses] = useState ([]);
    const [status, setStatus] = useState ('pending');
    const [roomId, setRoomId] = useState ('');

    useEffect (() => {
        const getStory = async () => {
            const res = await fetch (`http://localhost:3030/room/${id}/story`);
            const data = await res.json ();
            setStory (data.story);
        };
        getStory ();
    }, []);

    useEffect (() => {
        const getGuesses = async () => {
            const res = await fetch (`http://localhost:3030/room/${id}/guesses`);
            const data = await res.json ();
            setGuesses (data);
        };
        getGuesses ();
    }, []);

    const addGuess = async () => {
        const res = await fetch (`http://localhost:3030/room/${id}/addGuess`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify ({guess, roomId: id})
        });
        const data = await res.json ();
        setGuesses (data.guesses);
    };
  return (
    <div>
        <h1>Guess</h1>
        <input type="text" value={guess} onChange={(e) => setGuess (e.target.value)} />
        <button onClick={addGuess}>Add Guess</button>
        <ul>
            {guesses.map ((guess) => (
                <li key={guess._id}>{guess.guess}</li>
            ))}
        </ul>
    </div>
  )
}

export default Guess