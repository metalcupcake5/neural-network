// import { Generation } from "./network/Generation";

import { Taxi } from "./game/Taxi";
import { Network } from "./network/Network";

// let gen = new Generation(5);
// console.log(gen.members);
let net = new Network({
    inputs: 1,
    layers: 5,
    neuronsPerLayer: 5,
    outputs: 5,
});

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
}
game.print();
console.log(`score: ${score}`);
console.log(`epochs: ${epochs}`);
// let game = new Taxi();
// game.column = 0;
// game.row = 0;
// game.destination = 2;
// game.passengerLocation = 0;
// game.print();
// move(4);
// move(0);
// move(0);
// move(0);
// move(0);
// move(5);
// console.log(`took ${game.turns} turns`);
