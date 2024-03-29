import { Matrix } from "mathjs";
import math = require("mathjs");

export class Network {
    schema: NetworkSchema;
    inputLayer: Matrix;
    hiddenLayers: Matrix[];
    outputLayer: Matrix;
    weights: Matrix[];
    biases: Matrix[];
    fitness: number;

    /**
     * Create a new network
     * @param schema Schema of the network
     * @param empty If the network should be empty or not (all zeroes)
     */
    constructor(schema: NetworkSchema, empty?: boolean) {
        this.schema = schema;
        this.fitness = 0;
        this.create(empty);
    }

    create(empty: boolean) {
        this.weights = [];
        this.biases = [];

        this.inputLayer = math.matrix(math.zeros(this.schema.inputs));

        this.hiddenLayers = [];
        for (let i = 0; i < this.schema.layers; i++) {
            this.hiddenLayers.push(
                math.matrix(math.zeros(this.schema.neuronsPerLayer))
            );
        }

        this.outputLayer = math.matrix(math.zeros(this.schema.outputs));

        this.weights[0] = math.matrix(
            math.zeros(this.schema.neuronsPerLayer, this.schema.inputs)
        );
        for (let i = 1; i < this.schema.layers; i++) {
            this.weights[i] = math.matrix(
                math.zeros(
                    this.schema.neuronsPerLayer,
                    this.schema.neuronsPerLayer
                )
            );
        }
        this.weights[this.schema.layers] = math.matrix(
            math.zeros(this.schema.outputs, this.schema.neuronsPerLayer)
        );

        for (let i = 0; i < this.schema.layers; i++) {
            this.biases[i] = math.matrix(
                math.zeros(this.schema.neuronsPerLayer)
            );
        }

        if (!empty) {
            for (const matrix of this.weights) {
                math.forEach(matrix, (value, index, matrix) => {
                    matrix.set(index, math.random(-1, 1));
                });
            }

            for (const matrix of this.biases) {
                math.forEach(matrix, (value, index, matrix) => {
                    matrix.set(index, math.random(-1, 1));
                });
            }
        }
    }

    /**
     * Predict a value based on inputs
     * @param input Array of numbers as long as the number of inputs
     * @returns Index of the greatest output neuron
     */
    predict(input: number[]) {
        this.inputLayer = math.matrix(input);

        this.hiddenLayers[0] = math.add(
            math.multiply(this.weights[0], this.inputLayer),
            this.biases[0]
        );

        //activation
        math.forEach(this.hiddenLayers[0], (value, index, matrix) => {
            matrix.set(index, Math.max(0, value)); // relu
        });
        for (let i = 1; i < this.schema.layers; i++) {
            this.hiddenLayers[i] = math.add(
                math.multiply(this.weights[i], this.hiddenLayers[i - 1]),
                this.biases[i]
            );

            //activation
            math.forEach(this.hiddenLayers[i], (value, index, matrix) => {
                //matrix.set(index, Math.max(0, value)); // relu
                matrix.set(index, value >= 0 ? value : 0.01 * value); // leaky relu
            });
        }

        this.outputLayer = math.multiply(
            this.weights[this.schema.layers],
            this.hiddenLayers[this.schema.layers - 1]
        );

        math.forEach(this.outputLayer, (value, index, matrix) => {
            matrix.set(index, 1 / (1 + Math.exp(-value)));
        });

        let outputs = this.outputLayer.toArray();

        return outputs.indexOf(Math.max.apply(null, outputs));
    }

    /**
     * Create a copy of the network
     * @returns A new network
     */
    clone() {
        let newNet = new Network(this.schema, true);
        newNet.inputLayer = this.inputLayer.clone();
        newNet.outputLayer = this.outputLayer.clone();

        for (let i = 0; i < this.hiddenLayers.length; i++) {
            newNet.hiddenLayers[i] = this.hiddenLayers[i].clone();
        }

        for (let i = 0; i < this.weights.length; i++) {
            newNet.weights[i] = this.weights[i].clone();
        }

        for (let i = 0; i < this.biases.length; i++) {
            newNet.biases[i] = this.biases[i].clone();
        }

        return newNet;
    }

    /**
     * Create a new network based on the current network
     * @param learningFactor Factor of learning
     * @returns A new network
     */
    reproduce(learningFactor: number) {
        let newNet = new Network(this.schema, true);

        for (let i = 0; i < this.weights.length; i++) {
            let newWeights = this.weights[i].clone();
            math.forEach(newWeights, (value, index, matrix) => {
                let newValue = value + (Math.random() * 2 - 1) * learningFactor;
                matrix.set(
                    index,
                    newValue > 1 ? 1 : newValue < -1 ? -1 : newValue
                );
            });
            newNet.weights[i] = newWeights;
        }

        for (let i = 0; i < this.biases.length; i++) {
            let newBiases = this.biases[i].clone();
            math.forEach(newBiases, (value, index, matrix) => {
                let newValue = value + (Math.random() * 2 - 1) * learningFactor;
                matrix.set(
                    index,
                    newValue > 1 ? 1 : newValue < -1 ? -1 : newValue
                );
            });
            newNet.biases[i] = newBiases;
        }

        return newNet;
    }

    /**
     * Reproduce with another network
     * @param parent A different network
     * @param rate Rate at which values from the other parent are copied into this network
     * @returns A new network
     */
    crossover(parent: Network, rate: number) {
        let newNet = new Network(this.schema, true);

        for (let i = 0; i < this.weights.length; i++) {
            let newWeights = this.weights[i].clone();
            math.forEach(newWeights, (value, index, matrix) => {
                matrix.set(
                    index,
                    Math.random() > rate ? parent.weights[i].get(index) : value
                );
            });
            newNet.weights[i] = newWeights;
        }

        for (let i = 0; i < this.biases.length; i++) {
            let newBiases = this.biases[i].clone();
            math.forEach(newBiases, (value, index, matrix) => {
                matrix.set(
                    index,
                    Math.random() > rate ? parent.biases[i].get(index) : value
                );
            });
            newNet.biases[i] = newBiases;
        }

        return newNet;
    }

    /**
     * Export the network as a object to save to a JSON file
     * @returns Object containing network data
     */
    export(): ExportObject {
        let output = {
            schema: this.schema,
            weights: [],
            biases: [],
        };

        for (const layer of this.weights) {
            output.weights.push(JSON.stringify(layer, math.replacer));
        }
        for (const layer of this.biases) {
            output.biases.push(JSON.stringify(layer, math.replacer));
        }
        return output;
    }

    /**
     * Import network from an object
     * @param data Data to import from
     */
    importFromFile(data: ExportObject) {
        this.schema = data.schema;
        this.create(true);
        for (let i = 0; i < data.weights.length; i++) {
            this.weights[i] = JSON.parse(data.weights[i], math.reviver);
        }

        for (let i = 0; i < data.biases.length; i++) {
            this.biases[i] = JSON.parse(data.biases[i], math.reviver);
        }
    }
}

export interface NetworkSchema {
    inputs: number;
    layers: number;
    neuronsPerLayer: number;
    outputs: number;
}

export interface ExportObject {
    schema: NetworkSchema;
    weights: any[];
    biases: any[];
}
