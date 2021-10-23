import mongoose from "mongoose"

// Maybe create tables here if they dont already exists?
const PlayerSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true
    },
    epicUsername: {
        type: String,
        required: true
    },
    mmr: Number,
})

// Second 'Players' String is required incase you dont want DB name to be plural
export default mongoose.model('players', PlayerSchema, 'players');