import math = require("mathjs");
import { Snake } from "./game/Snake";
import { Network } from "./network/Network";
import { Population } from "./network/Population";

let game = new Snake();
game.food = [4, 5];
game.print();
console.log(game.act(0));
game.print();

console.log(game.act(3));
game.print();
game.food = [4, 2];
console.log(game.act(3));
game.print();
console.log(game.act(3));
game.print();
game.food = [5, 1];
console.log(game.act(3));
game.print();

console.log(game.act(3));
game.print();
console.log(game.act(3));
game.print();

// let pop = new Population(2000, {
//     inputs: 4,
//     layers: 1,
//     neuronsPerLayer: 3,
//     outputs: 5,
// });
// for (let i = 0; i < 1000; i++) {
//     console.log(`pop ${i + 1}`);
//     pop.train();
//     pop.evaluate();
//     pop.evolve();
// }

// pop.evaluate();
// let network = pop.members[0];
// console.log(`score: ${network.score}`);
