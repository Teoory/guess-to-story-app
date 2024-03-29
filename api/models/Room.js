const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RoomSchema = new mongoose.Schema({
    userCount: {
        type: Number,
        default: 0
    },
    users: {
        type: [Schema.Types.Mixed],
        default: []
    },
    gameStarted: {
        type: Boolean,
        default: false
    },
    storyTellerCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    playerCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    story: {
        type: String,
        default: ''
    },
    guesses: {
        type: [Schema.Types.Mixed],
        default: []
    },
    roomId: {
        type: String,
        required: [true, 'Please provide a room id'],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 21600
    }
});

const RoomModel = model('Room', RoomSchema);

module.exports = RoomModel;