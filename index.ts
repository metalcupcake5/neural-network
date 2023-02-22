import { Network } from "./Network";
let network: Network = new Network(2, 10, 3, 2);
network.predict([93.33, 4.98]);
console.log(network.neurons);