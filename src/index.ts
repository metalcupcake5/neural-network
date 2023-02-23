// import { Generation } from "./network/Generation";

import { Taxi } from "./game/Taxi";

// let gen = new Generation(5);
// console.log(gen.members);

function move(move) {
    let act = game.act(move);
    game.print();
    console.log(`reward: ${act.reward}`);
}
/*  
        0: Move south (down)
        1: Move north (up)
        2: Move east (right)
        3: Move west (left)
        4: Pickup passenger
        5: Drop off passenger
    */

let game = new Taxi();
let done = false;
let score = 0;
let epochs = 0;
while (!done) {
    game.print();
    let act = game.act(Math.floor(Math.random() * 6));
    score += act.reward;
    done = act.done;
    epochs++;
    console.log(`score: ${score}`);
}
game.print();
console.log(`score: ${score}`);
console.log(`epochs: ${epochs}`);
