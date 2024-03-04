const express = require ('express');
const cors = require ('cors');
const mongoose = require ('mongoose');
const User = require ('./models/User');
const Room = require ('./models/Room');
const Story = require ('./models/Story');
const Guess = require ('./models/Guess');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const cookieParser = require ('cookie-parser');
const multer = require ('multer');
const path = require ('path');
const fs = require ('fs');
const sesion = require ('express-session');
const ws = require ('ws');
const app = express ();
require ('dotenv').config ();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3030', 'https://guess-to-story-api.vercel.app', 'https://guess-to-story-app.vercel.app'],
    credentials: true,
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
};

app.use (cors (corsOptions));
app.use (express.json ());
app.use (cookieParser ());

app.use (sesion ({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

mongoose.connect (process.env.MONGODB_URL);

//? Register & Login
app.post ('/register', async (req, res) => {
    const {username, password, email} = req.body;
    try {
        const userDoc = await User.create({
            username,
            email,
            password:bcrypt.hashSync(password, salt),
            tags: ['user'],
        })
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post ('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    if (!userDoc) {
        return res.redirect('/login');
    }
    const  passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        jwt.sign({username, profilePhoto:userDoc.profilePhoto , email:userDoc.email, tags:userDoc.tags, id:userDoc._id}, secret, {} , (err, token) => {
            if (err) {
                console.error('Token oluşturulamadı:', err);
                return res.status(500).json({ error: 'Token oluşturulamadı' });
            }

            res.cookie('token', token,{sameSite: "none", maxAge: 24 * 60 * 60 * 1000, httpOnly: false, secure: true}).json({
                id:userDoc._id,
                username,
                email:userDoc.email,
                tags:userDoc.tags,
                profilePhoto: userDoc.profilePhoto,
            });
            console.log('Logged in, Token olusturuldu.', token);
        });
    }else{
        res.status(400).json({message: 'Wrong password'});
    }
});

app.get ('/logout', (req, res) => {
    res.clearCookie('token').json({message: 'Logged out'});
});


//? Room System
app.post ('/createRoom', async (req, res) => {
    const {roomId, username} = req.body;
    const room = await Room.findOne ({roomId});
    if (room) {
        return res.status (400).json ({error: 'Room already exists'});
    }

    const token = jwt.sign({username}, secret);
    const newRoom = await Room.create ({roomId, users: [{ username, token }] });
    res.json({ roomId: newRoom.roomId });
});

app.get ('/room/:roomId', async (req, res) => {
    const roomId = req.params.roomId;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }

    await room.save ();
    res.json ({room});
});

app.get('/room/:roomID/userCount', async (req, res) => {
    const roomID = req.params.roomID;
    const room = await Room.findOne({ roomId: roomID });
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ userCount: room.users.length });
});

app.post ('/joinRoom', async (req, res) => {
    const {roomId, username} = req.body;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    room.users.push (username);
    await room.save ();
    res.json (room);
});

app.post ('/leaveRoom', async (req, res) => {
    const {roomId, username} = req.body;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    room.users = room.users.filter ((user) => user !== username);
    await room.save ();
    res.json (room);
});

app.delete ('/deleteRoom', async (req, res) => {
    const {roomId} = req.body;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    await room.deleteOne ();
    res.json ({message: 'Room deleted'});
});

app.post ('/room/:roomId/gameStarted', async (req, res) => {
    const {roomId} = req.body;
    const room = await Room.findOne ({ roomId });
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    room.gameStarted = true;
    await room.save();
    res.json (room);
});

app.get ('/room/:roomId/gameStarted', async (req, res) => {
    const roomId = req.params.roomId;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    res.json ({gameStarted: room.gameStarted});
});

app.post ('/room/:roomId/storyTellerCountAdd', async (req, res) => {
    const {roomId} = req.body;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    room.storyTellerCount++;
    await room.save ();
    res.json (room);
});

app.post ('/room/:roomId/storyTellerCountDel', async (req, res) => {
    const {roomId} = req.body;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    room.storyTellerCount--;
    await room.save ();
    res.json (room);
});

app.get ('/room/:roomId/storyTellerCount', async (req, res) => {
    const roomId = req.params.roomId;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    res.json ({storyTellerCount: room.storyTellerCount});
});

app.post ('/room/:roomId/playerCountAdd', async (req, res) => {
    const {roomId} = req.body;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    room.playerCount++;
    await room.save ();
    res.json (room);
});

app.post ('/room/:roomId/playerCountDell', async (req, res) => {
    const {roomId} = req.body;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    room.playerCount--;
    await room.save ();
    res.json (room);
});

app.get ('/room/:roomId/playerCount', async (req, res) => {
    const roomId = req.params.roomId;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    res.json ({playerCount: room.playerCount});
});

app.post ('/room/:roomId/story', async (req, res) => {
    const {roomId, story} = req.body;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    room.story = story;
    await room.save ();
    res.json (room);
});

app.get ('/room/:roomId/story', async (req, res) => {
    const roomId = req.params.roomId;
    const room = await Room.findOne ({roomId});
    if (!room) {
        return res.status (404).json ({error: 'Room not found'});
    }
    res.json ({story: room.story});
});

//? Add new Story
app.post ('/addStory', async (req, res) => {
    const {cümle, hikaye} = req.body;
    try {
        const storyDoc = await Story.create ({cümle, hikaye});
        res.json (storyDoc);
    } catch (e) {
        res.status (400).json (e);
    }
});

app.get ('/story', async (req, res) => {
    const story = await Story.find ();
    res.json (story);
});

//? Room Guess System
app.post ('/room/:roomId/addGuess', async (req, res) => {
    try {
        const {guess, roomId} = req.body;
        const guessDoc = await Guess.create ({guess, roomId});
        const room = await Room.findOne ({ roomId });
        room.guesses.push (guessDoc);
        await room.save ();
        res.json (room);
    } catch (e) {
        res.status (400).json (e);
    }
});

app.get ('/room/:roomId/guesses', async (req, res) => {
    const roomId = req.params.roomId;
    const guesses = await Guess.find ({roomId});
    res.json (guesses);
});

app.put ('/room/:roomId/guesses/:guessId', async (req, res) => {
    try {
        const {status} = req.body;
        const guessId = req.params.guessId;
        const guessDoc = await Guess.findByIdAndUpdate (guessId, {status}, {new: true});
        res.json (guessDoc);
    } catch (e) {
        res.status (400).json (e);
    }
});

app.get ('/room/:roomId/guesses/:guessId', async (req, res) => {
    const guessId = req.params.guessId;
    const guessDoc = await Guess.findById (guessId);
    res.json (guessDoc);
});


//! Listen to port 3030
app.listen(3030, () => {
    console.log('Server listening on port 3030 || nodemon index.js')
});