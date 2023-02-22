import { Connection } from "./Connection";

export class Neuron {
    // input values
    inputs: number[];
    // value of the neuron
    value: number;
    // type of the neuron; 0: input, 1: layer, 2: output
    type: number;
    // input neurons
    connections: Connection[];
    bias: number;

    layer: number;

    constructor(type, layer) {
        this.type = type;
        this.bias = Math.random() * 10 - 5;

        this.layer = layer;
        this.connections = [];

        this.value = 0;
    }

    process(): void {
        let sum = this.bias;
        for (const connection of this.connections) {
            sum += connection.from.value * connection.weight;
        }
        this.value = this.activation(sum);
    }

    activation(input: number): number {
        switch (this.type) {
            case 2:
                return Math.tanh(input);
            default:
                return Math.max(0, input);
        }
    }

    mutate(learningFactor: number) {
        this.bias += (Math.random() * 2 - 1) * learningFactor;
    }
}
