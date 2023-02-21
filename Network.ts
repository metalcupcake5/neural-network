import { Neuron } from "./Neuron";

export class Network {
    neurons: Neuron[][];

    constructor(inputs, layers, neuronsPerLayer, outputs) {
        this.neurons = [];

        // outputs
        let outputArray = [];
        for (let i = 0; i < outputs; i++)
            outputArray.push(new Neuron(2, layers + 1));

        let layerArray = [];

        // layers
        for (let i = layers - 1; i >= 0; i--) {
            let layer = [];
            let lastLayer = i == layers - 1;
            for (let j = 0; j < neuronsPerLayer; j++) {
                let neuron = new Neuron(1, i + 1);
                layer.push(neuron);
                if (lastLayer) {
                    outputArray.forEach((n) => {
                        n.connections.push({
                            neuron: neuron,
                            weight: Math.random() * 2 - 1,
                        });
                    });
                } else {
                    layerArray[layerArray.length - 1].forEach((n) => {
                        n.connections.push({
                            neuron: neuron,
                            weight: Math.random() * 2 - 1,
                        });
                    });
                }
            }
            layerArray.push(layer);
        }

        // input neurons
        let inputArray = [];
        for (let i = 0; i < inputs; i++) inputArray.push(new Neuron(0, 0));

        this.neurons.push(inputArray);
        for (let i = layers - 1; i >= 0; i--) this.neurons.push(layerArray[i]);
        this.neurons.push(outputArray);
    }
}
