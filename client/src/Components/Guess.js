import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const Guess = () => {
    const { id } = useParams();
    const [guess, setGuess] = useState('');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch (`https://guess-to-story-api.vercel.app/room/${id}/addGuess`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({guess, roomId: id}),
            });
            const data = await response.json();
            setGuess('');
        } catch (e) {
            console.error (e);
        }
    };
    
  return (
    <div>
        <h1>Add Guess</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Guess:
                <input type="text" value={guess} onChange={(e) => setGuess(e.target.value)} />
            </label>
            <button type="submit">Submit</button>
        </form>
        <h2>Guesses</h2>
        {guesses && guesses.length > 0 ? (
            <ul>
                {guesses
                .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(guess => (
                    <li key={guess._id}>
                    <p className='guessArea selectable'>
                        <span className='guessList'>{guess.guess}</span>
                        <span className='guessStatus'>
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
                    </p>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No guesses found.</p>
        )}
    </div>
  )
}

export default Guess