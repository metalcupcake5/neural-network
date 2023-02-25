// import { Generation } from "./network/Generation";

import { Snake } from "./game/Snake";
import { Taxi } from "./game/Taxi";
import { Population } from "./network/Population";

let game = new Snake();
game.print();
game.step(0);
game.print();
game.step(0);
game.print();
game.step(0);
game.print();
game.step(0);
game.print();
game.step(0);
game.print();

/*let pop = new Population(100, {
    inputs: 4,
    layers: 1,
    neuronsPerLayer: 3,
    outputs: 5,
});
pop.train();
for (let i = 0; i < 10000; i++) {
    // let values = [];
    // pop.members[0].neurons[2].forEach((n) => {
    //     values.push(n.value);
    // });
    // console.log(values);
    pop.evolve();
    pop.train();
    pop.evaluate();
}

pop.evaluate();
let network = pop.members[0];
console.log(`score: ${network.score}`);
*/
