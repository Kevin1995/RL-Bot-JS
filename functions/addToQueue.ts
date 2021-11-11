import { TextChannel } from "discord.js";
import QueueSchema from "./../utils/QueueSchema"

export async function addToQueue(playlist: string, playerOne: string, playerTwo: string, playerThree: string, messageChannel: TextChannel) {

    if (playlist === '1s') {
        console.log(playlist, playerOne)


        await QueueSchema.create({

        })
    }
    if (playlist === '2s' || playlist === 'Hoops') {
        console.log(playlist, playerOne, playerTwo)
    }
    else {
        console.log(playlist, playerOne, playerTwo, playerThree)
    }
}