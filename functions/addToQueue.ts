export async function addToQueue(playlist: string, playerOne: string, playerTwo: string, playerThree: string) {
    if (playlist === '1s') {
        console.log(playlist, playerOne)
    }
    if (playlist === '2s' || playlist === 'Hoops') {
        console.log(playlist, playerOne, playerTwo)
    }
    else {
        console.log(playlist, playerOne, playerTwo, playerThree)
    }
}