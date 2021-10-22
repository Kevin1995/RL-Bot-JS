import { connect, model, Schema, SchemaTypes } from "mongoose";

export const connectDatabase = async () => {
    let DB: string = process.env.MONGO_URI!
    await connect(DB);
    console.log("Database Connected!")
}
