import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const CheckGuess = () => {
    const { id } = useParams();
    const [guesses, setGuesses] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            getGuesses();
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const getGuesses = async () => {
        try {
            const res = await fetch(`http://localhost:3030/room/${id}/guesses`);
            const data = await res.json();
            setGuesses(data);
        } catch (error) {
            console.error('Error fetching guesses:', error);
        }
    };

    const handleGuessStatus = async (guessId, status) => {
        try {
            const res = await fetch(`http://localhost:3030/room/${id}/guesses/${guessId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            setGuesses(data.guesses);
        } catch (error) {
            console.error('Error updating guess status:', error);
        }
    };

    return (
        <div>
            <h1>Check Guess</h1>
            <ul>
                {guesses.map(guess => (
                    <li key={guess._id}>
                        <h3>{guess.guess}</h3>
                        <button onClick={() => handleGuessStatus(guess._id, 'true')}>True</button>
                        <button onClick={() => handleGuessStatus(guess._id, 'false')}>False</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CheckGuess;