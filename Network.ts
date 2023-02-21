import { Connection } from "./Connection";
import { Neuron } from "./Neuron";

export class Network {
    neurons: Neuron[][];

    constructor(inputs, layers, neuronsPerLayer, outputs) {
        this.neurons = [];

        // input neurons
        let inputArray = [];
        for (let i = 0; i < inputs; i++) inputArray.push(new Neuron(0, 0));
        this.neurons.push(inputArray);

        // layers
        for (let i = 0; i < layers; i++) {
            let layer = [];
            for (let j = 0; j < neuronsPerLayer; j++) {
                let neuron = new Neuron(1, i + 1);
                layer.push(neuron);
            }
            this.neurons.push(layer);
        }

        // outputs
        let outputArray = [];
        for (let i = 0; i < outputs; i++)
            outputArray.push(new Neuron(2, layers + 1));

        this.neurons.push(outputArray);

        for (let i = 0; i < this.neurons.length - 1; i++) {
            for (const neuron of this.neurons[i]) {
                for (const output of this.neurons[i + 1]) {
                    neuron.connections.push(new Connection(neuron, output, 0));
                }
            }
        }
    }
}
