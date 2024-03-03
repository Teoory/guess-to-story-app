const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const GuessSchema = new mongoose.Schema({
    guess: {
        type: String,
        required: [true, 'Please provide a guess']
    },
    status: {
        type: [String],
        enum: ['pending', 'true', 'false'],
        default: ['pending']
    },
    roomId: {
        type: String,
        required: [true, 'Please provide a room id']
    }
});

const GuessModel = model('Guess', GuessSchema);

module.exports = GuessModel;