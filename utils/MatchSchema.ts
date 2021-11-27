import mongoose from "mongoose"

// Maybe create tables here if they dont already exists?
const MatchSchema = new mongoose.Schema({
    messageId: {
        type: String,
        required: true
    },
    playlist: {
        type: String,
        required: true
    },
    home_team: {
        type: String,
    },
    home_player_one_id: {
        type: String,
    },
    home_player_two_id: {
        type: String,
    },
    home_player_three_id: {
        type: String,
    },
    away_team: {
        type: String,
    },
    away_player_one_id: {
        type: String,
    },
    away_player_two_id: {
        type: String,
    },
    away_player_three_id: {
        type: String,
    },
    winning_team: {
        type: String
    }
})

// Second 'Players' String is required incase you dont want DB name to be plural
export default mongoose.model('matches', MatchSchema, 'matches');