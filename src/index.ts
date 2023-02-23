// import { Generation } from "./network/Generation";

import { Population } from "./network/Population";

let pop = new Population(100, {
    inputs: 1,
    layers: 1,
    neuronsPerLayer: 20,
    outputs: 5,
});

for (let i = 0; i < 100; i++) {
    pop.train();
    pop.evaluate();
    pop.evolve();
}
console.log(pop.members[0].neurons[0][0].value);
console.log("outputs");
console.log(pop.members[0].neurons[2].forEach((n) => console.log(n.value)));
