import math = require("mathjs");
import { Network } from "./network/Network";

let net = new Network({
    inputs: 2,
    layers: 3,
    neuronsPerLayer: 3,
    outputs: 2,
});

console.log(net.predict([1, 2]));
