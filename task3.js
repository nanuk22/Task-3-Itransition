const crypto = require("crypto");
const randomBytes = crypto.randomBytes;
const hash = crypto.createHash('sha3-256');
const readline = require("readline-sync");
var AsciiTable = require('ascii-table')



const args = process.argv;
const moves = args.slice(2);

const randomComputerMove = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const gameOptions = (options) => {
    console.log(`Available moves: `);
    for (let i = 0; i < options.length; i++) {
        console.log(`${i + 1} - ${options[i]}`)
    }
    console.log(`0 - exit`);
    console.log(`? - help`);
};

const key = randomBytes(32).toString('hex');

const checkDuplicateInArray = (inputArray) => {
    let forCheck = [...inputArray];
    forCheck = forCheck.sort();
    for (let index in forCheck) {
        if (forCheck[index] ===
            forCheck[index - 1]) {
            return true
        }
    }
}

const calculateResult = (options, a, b) => {
    const n = options.length;
    const p = Math.floor(n / 2);
    const results = Math.sign((a - b + p + n) % n - p);
    return results;
}

function rows(moves) {
    const content = [];
    let a = 0;
    let resultString = '';
    moves.forEach((move) => {
        let x = [];
        x.push(move);
        for (let i = 0; i < moves.length; i++) {
            const computerMove = calculateResult(moves, i, a);
            if (computerMove === 0) {
                resultString = 'Draw';
            } else if (computerMove === 1) {
                resultString = "Win";
            } else if (computerMove === -1) {
                resultString = "Lose";
            }
            x.push(resultString);
        }
        content.push(x);
        a++;
    });
    return content;
}

function help() {
    var table = AsciiTable.factory('title');
    const heading = ['v PC\\User >'].concat(moves);
    const tableContent = rows(moves);
    var table = AsciiTable.factory({
        title: 'RULES',
        heading: heading,
        rows: tableContent
    });
    console.log(table.toString());

    const exit = readline.question(`\nTo return to the main menu, press "0" \n\nTo exit the game, press any other button\n`);
    if (exit === "0") {
        main(moves);
    }
}

const main = (options) => {
    console.log(key);
    gameOptions(options);
    const move = readline.question("Enter your move: ");
    if (move === "0") {
        return;
    } else if (move === "?") {
        help();
    } else {
        console.log(`Your move: ${options[move - 1]}`);
        const compMove = randomComputerMove(0, options.length - 1);
        console.log(`Computer move: ${options[compMove]}`);
        const result = calculateResult(moves, (move - 1), compMove);
        if (result === -1) {
            console.log("You lose :(");
        } else if (result === 1) {
            console.log("You win!");
        } else if (result === 0) {
            console.log("It's a draw")
        }
        const hmac = hash.update(key + compMove).digest("hex").toString()
        console.log(hmac);
    }
}

if (moves.length < 3) {
    console.log("The game should consist of at least three options for moves. Please, try again.");
} else if (moves.length % 2 === 0) {
    console.log("You can play only with an odd number of options for moves. Please, try again.");
} else if (checkDuplicateInArray(moves)) {
    console.log("Repetition! The options for moves should be unique. Try again!")
} else {
    main(moves)
}




