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
    roomId: {
        type: String,
        required: [true, 'Please provide a room id'],
        unique: true
    }
});

const RoomModel = model('Room', RoomSchema);

module.exports = RoomModel;