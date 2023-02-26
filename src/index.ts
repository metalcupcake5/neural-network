import math = require("mathjs");
import { Network } from "./network/Network";
import { Population } from "./network/Population";

let pop = new Population(2000, {
    inputs: 4,
    layers: 1,
    neuronsPerLayer: 3,
    outputs: 5,
});
for (let i = 0; i < 1000; i++) {
    console.log(`pop ${i + 1}`);
    pop.train();
    pop.evaluate();
    pop.evolve();
}

pop.evaluate();
let network = pop.members[0];
console.log(`score: ${network.score}`);
