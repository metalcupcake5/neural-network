import { Connection } from "./Connection";
import { Neuron } from "./Neuron";

export interface NetworkSchema {
    inputs: number;
    layers: number;
    neuronsPerLayer: number;
    outputs: number;
}

export class Network {
    schema: NetworkSchema;
    neurons: Neuron[][];
    connections: Connection[];
    done: boolean;
    score: number;

    constructor(schema: NetworkSchema, empty?: boolean) {
        this.schema = schema;
        this.neurons = [];
        this.connections = [];
        this.done = false;
        this.score = 0;

        if (!empty)
            this.setup(
                this.schema.inputs,
                this.schema.layers,
                this.schema.neuronsPerLayer,
                this.schema.outputs
            );
    }

    setup(inputs, layers, neuronsPerLayer, outputs) {
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

        for (let i = 1; i < this.neurons.length; i++) {
            for (const neuron of this.neurons[i]) {
                for (const input of this.neurons[i - 1]) {
                    let connection = new Connection(
                        input,
                        neuron,
                        Math.random() * 10 - 5
                    );
                    neuron.connections.push(connection);
                    this.connections.push(connection);
                }
            }
        }
    }

    predict(inputs: number[]): number {
        if (inputs.length != this.schema.inputs) {
            throw new Error("Input values not the same size as input neurons!");
        }
        for (let i = 0; i < this.neurons[0].length; i++) {
            this.neurons[0][i].value = inputs[i];
        }
        for (let i = 1; i < this.neurons.length; i++) {
            for (const neuron of this.neurons[i]) {
                neuron.process();
            }
        }
        let outputLayer = this.neurons[this.neurons.length - 1];
        let maxValue = outputLayer[0].value;
        let max = 0;
        for (let i = 1; i < outputLayer.length; i++) {
            if (outputLayer[i].value > maxValue) {
                maxValue = outputLayer[i].value;
                max = i;
            }
        }
        return max;
    }

    reproduce(learningFactor: number): Network {
        let newNetwork = new Network(this.schema, true);
        newNetwork.connections = this.connections.slice(
            0,
            this.connections.length
        );
        newNetwork.neurons = this.neurons.slice(0, this.neurons.length);
        for (const layer of newNetwork.neurons) {
            for (const neuron of layer) {
                neuron.mutate(learningFactor);
            }
        }

        for (const connection of newNetwork.connections) {
            connection.mutate(learningFactor);
        }
        /*for (const layer of this.neurons) {
            let newLayer = [];
            for (const neuron of layer) {
                let newNeuron = neuron.copy();
                newLayer.push(newNeuron);
            }
            newNetwork.neurons.push(newLayer);
        }

        for (const connection of this.connections) {
            connection.mutate(learningFactor);
            newNetwork.connections.push(connection);
        }*/

        return newNetwork;
    }
}
