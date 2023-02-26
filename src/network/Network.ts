import { Matrix } from "mathjs";
import math = require("mathjs");

export interface NetworkSchema {
    inputs: number;
    layers: number;
    neuronsPerLayer: number;
    outputs: number;
}

export class Network {
    schema: NetworkSchema;
    inputLayer: Matrix;
    hiddenLayers: Matrix;
    outputLayer: Matrix;
    weights: Matrix[];
    biases: Matrix[];
    score: number;

    constructor(schema: NetworkSchema, empty?: boolean) {
        this.schema = schema;
        this.weights = [];
        this.biases = [];
        this.score = 0;

        this.inputLayer = math.matrix(math.zeros(schema.inputs));
        this.hiddenLayers = math.matrix(
            math.zeros(schema.layers, schema.neuronsPerLayer)
        );
        this.outputLayer = math.matrix(math.zeros(schema.outputs));

        this.weights[0] = math.matrix(
            math.zeros(schema.neuronsPerLayer, schema.inputs)
        );
        for (let i = 1; i < schema.layers; i++) {
            this.weights[i] = math.matrix(
                math.zeros(schema.neuronsPerLayer, schema.neuronsPerLayer)
            );
        }
        this.weights[schema.layers] = math.matrix(
            math.zeros(schema.outputs, schema.neuronsPerLayer)
        );

        for (let i = 0; i < schema.layers; i++) {
            this.biases[i] = math.matrix(math.zeros(schema.neuronsPerLayer));
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

    predict(input: number[]) {
        this.inputLayer = math.matrix(input);
        //console.log(math.squeeze(math.row(this.hiddenLayers, 0)));

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
                math.multiply(
                    this.weights[i],
                    math.squeeze(math.row(this.hiddenLayers, i - 1))
                ),
                this.biases[i]
            );

            //activation
            math.forEach(this.hiddenLayers[i], (value, index, matrix) => {
                matrix.set(index, Math.max(0, value)); // relu
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

    reproduce(learningFactor: number) {
        let newNet = new Network(this.schema, true);
        newNet.inputLayer = this.inputLayer.clone();
        newNet.hiddenLayers = this.hiddenLayers.clone();
        newNet.outputLayer = this.outputLayer.clone();

        for (let i = 0; i < this.weights.length; i++) {
            let newWeights = this.weights[i].clone();
            math.forEach(newWeights, (value, index, matrix) => {
                matrix.set(
                    index,
                    value + (Math.random() * 2 - 1) * learningFactor
                );
            });
            newNet.weights[i] = newWeights;
        }

        for (let i = 0; i < this.biases.length; i++) {
            let newBiases = this.biases[i].clone();
            math.forEach(newBiases, (value, index, matrix) => {
                matrix.set(
                    index,
                    value + (Math.random() * 2 - 1) * learningFactor
                );
            });
            newNet.biases[i] = newBiases;
        }

        return newNet;
    }
}
