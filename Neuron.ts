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
    weight: number;
    layer: number;

    constructor(type, layer) {
        this.type = type;
        this.bias = 0;
        this.weight = Math.random() * 2 - 1;
        //this.activationFunction = Math.random() * 5;
        this.layer = layer;
        this.connections = [];
        /*this.connections.push({
            neuron: new Neuron(0, 0),
            weight: 0
        });*/
    }

    process(): void {
        let sum = 0;
        for (const connection of this.connections) {
            sum += connection.from.value * connection.weight;
        }
        this.value = this.activation(sum);
    }

    activation(input: number): number {
        return Math.max(0, input); // RELU function
    }
}