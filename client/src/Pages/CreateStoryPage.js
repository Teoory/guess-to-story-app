import React from 'react'
import { Navigate } from 'react-router-dom';

const CreateStoryPage = () => {
    function handleCreateStory(ev) {
        ev.preventDefault();
        const cümle = document.getElementById('cümle').value;
        const hikaye = document.getElementById('hikaye').value;
        fetch('https://guess-to-story-api.vercel.app/addStory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ cümle, hikaye }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Story created successfully:', data);
                alert('Story created successfully');
            })
            .catch(error => console.error('Error creating story:', error));
    }

    return (
        <div>
            <h1>Create Story</h1>
            <form>
                <input type="text" placeholder="Cümle" id='cümle' required/>
                <textarea placeholder="Hikaye" id='hikaye' required></textarea>
                <button onClick={handleCreateStory}>Create Story</button>
            </form>
        </div>
    )
}

export default CreateStoryPage