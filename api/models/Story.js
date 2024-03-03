const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const storySchema = new Schema({
    cümle: String,
    hikaye: String,
});

const Story = model('Story', storySchema);

module.exports = Story;