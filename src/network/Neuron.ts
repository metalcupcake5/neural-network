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

    activationFunction: number;

    constructor(type, layer) {
        this.type = type;
        this.bias = Math.random() * 10 - 5;

        this.layer = layer;
        this.connections = [];

        this.value = 0;
        this.activationFunction = Math.floor(Math.random() * 3);
    }

    process(): void {
        let sum = this.bias;
        for (const connection of this.connections) {
            sum += connection.from.value * connection.weight;
        }
        this.value = this.activation(sum);
    }

    activation(input: number): number {
        if (this.type == 2) {
            return 1 / (1 + Math.exp(-input));
        }
        switch (this.activationFunction) {
            case 0:
                return Math.tanh(input); // tanh
            case 1:
                return 1 / (1 + Math.exp(-input)); // sigmoid
            default:
                return Math.max(0, input); // relu
        }
    }

    copy() {
        let newNeuron = new Neuron(this.type, this.layer);
        newNeuron.bias = this.bias;
        newNeuron.activationFunction = this.activationFunction;

        return newNeuron;
    }

    mutate(learningFactor: number) {
        this.bias += (Math.random() * 2 - 1) * learningFactor;
    }
}
