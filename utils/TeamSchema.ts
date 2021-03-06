import mongoose from "mongoose"

// Maybe create tables here if they dont already exists?
const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    playlist: {
        type: String,
        required: true
    },
    region: String,
    mmr: Number,
    rank: String,
    captainsId: {
        type: String,
        required: true
    },
    viceCaptainsId: String,
    playerThreeId: String,
    playerFourId: String,
})

// Second 'Players' String is required incase you dont want DB name to be plural
export default mongoose.model('teams', TeamSchema, 'teams');