import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const CheckGuess = () => {
    const { id } = useParams();
    const [guesses, setGuesses] = useState([]);

    useEffect (() => {
        const interval = setInterval (() => {
            getGuesses ();
        }, 2000);
        return () => clearInterval (interval);
    }, []);

    const getGuesses = async () => {
        try {
            const response = await fetch (`https://guess-to-story-api.vercel.app/room/${id}/guesses`);
            const data = await response.json();
            setGuesses(data);
        } catch (e) {
            console.error (e);
        }
    };

    const handleGuessStatus = async (guessId, status) => {
        try {
            const response = await fetch (`https://guess-to-story-api.vercel.app/room/${id}/guesses/${guessId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({status}),
            });
            const data = await response.json();
            setGuesses ();
        } catch (e) {
            console.error (e);
        }
    };
    
    return (
        <div>
            <h1>Check Guess</h1>
            {guesses && guesses.length > 0 ? (
                <ul>
                    {guesses
                    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map(guess => (
                        <li className='stList' key={guess._id}>
                            <p className='df selectable'>
                                <span className='guessList'>{guess.guess}</span>
                                <div className="statusArea">
                                    <span className='stGuessStatus'>
                                        {guess.status == 'pending'
                                            ? ' ⏳'
                                            : null
                                        }
                                        {guess.status == 'true'
                                            ? ' ✔️'
                                            : null
                                        }
                                        {guess.status == 'false'
                                            ? ' ❌'
                                            : null
                                        }
                                    </span>
                                    <button onClick={() => handleGuessStatus(guess._id, 'true')}>✔️</button>
                                    <button onClick={() => handleGuessStatus(guess._id, 'false')}>❌</button>
                                </div>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No guesses found.</p>
            )}
        </div>
    );
};

export default CheckGuess;