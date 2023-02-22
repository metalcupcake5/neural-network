import { Network } from "./Network";
let network: Network = new Network({
    inputs: 2,
    layers: 3,
    neuronsPerLayer: 3,
    outputs: 3,
});
console.log(network.predict([100, 200]));
console.log(network.neurons[4][0].connections[0]);
// let newNetwork = network.reproduce(1);
// console.log(
//     newNetwork.predict([
//         100, 200, 100, 100, 200, 100, 100, 200, 100, 100, 200, 100, 100, 200,
//         100,
//     ])
// );
