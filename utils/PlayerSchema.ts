import { Schema, SchemaTypes, model } from "mongoose";

// Maybe create tables here if they dont already exists?
const PlayerSchema = new Schema({
    discordId: {
        type: SchemaTypes.String,
        required: true
    }
})

export default model('Players', PlayerSchema);