import { Neuron } from "./Neuron";

export class Connection {
    weight: number;
    from: Neuron;
    to: Neuron;

    constructor(input: Neuron, output: Neuron, weight: number) {
        this.from = input;
        this.to = output;
        this.weight = weight;
    }
}