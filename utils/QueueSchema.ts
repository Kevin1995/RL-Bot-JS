import mongoose from "mongoose"

// Maybe create tables here if they dont already exists?
const QueueSchema = new mongoose.Schema({
    messageId: {
        type: String,
        required: true
    },
    teamName: {
        type: String,
        required: true
    },
    playlist: {
        type: String,
        required: true
    },
    playerOne: {
        type: String,
        required: true
    },
    playerTwoId: String,
    playerThreeId: String,
})

// Second 'Players' String is required incase you dont want DB name to be plural
export default mongoose.model('queue', QueueSchema, 'queue');