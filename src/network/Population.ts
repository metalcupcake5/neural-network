import { Snake } from "../game/Snake";
import { Taxi } from "../game/Taxi";
import { Network, NetworkSchema } from "./Network";

export class Population {
    count: number;
    networks: Network[];
    generation: 0;
    crossoverRate: number;
    mutationRate: number;

    constructor(
        amount: number,
        crossoverRate: number,
        mutationRate: number,
        networkSchema?: NetworkSchema
    ) {
        this.count = amount;
        this.networks = [];
        this.generation = 0;
        this.crossoverRate = crossoverRate;
        this.mutationRate = mutationRate;
        for (let i = 0; i < amount; i++) {
            this.networks.push(
                new Network(
                    networkSchema
                        ? networkSchema
                        : {
                              inputs: 1,
                              layers: 3,
                              neuronsPerLayer: 3,
                              outputs: 2,
                          }
                )
            );
        }
    }

    train() {
        // let game = new Taxi();
        // let state = game.defaultState;
        for (let i = 0; i < this.networks.length; i++) {
            let network = this.networks[i];
            // game.reset(state);
            let game = new Snake();
            let done = false;
            let fitness = 0;
            let epochs = 0;
            while (!done) {
                let sample = Object.values(game.sample());
                let act = game.act(network.predict([...sample]));
                done = act.done;
                fitness = act.fitness;
                epochs++;
            }
            network.fitness = fitness;
        }
    }

    evaluate() {
        this.networks.sort((a, b) => b.fitness - a.fitness);
        let scores = [];
        this.networks.slice(0, 10).forEach((net) => {
            scores.push(net.fitness);
        });
        let total = this.networks.reduce(
            (total, net) => (total += net.fitness),
            0
        );
        console.log(scores.join(", ") + ` | average: ${total / 10}`);
    }

    evolve() {
        this.networks.sort((a, b) => b.fitness - a.fitness);
        let newPop = [];
        this.networks.slice(0, 5).forEach((net) => {
            newPop.push(net.clone());
        });
        while (newPop.length < this.count) {
            let parent1 = this.networks[Math.floor(Math.random() * 5)];
            let newNet = parent1.clone();

            if (Math.random() < this.crossoverRate) {
                let parent2 = this.findParent();
                newNet = newNet.crossover(parent2, 0.75);
            }

            if (Math.random() < this.mutationRate) {
                newNet = newNet.reproduce(0.95);
            }

            newPop.push(newNet);
        }
        this.networks = newPop;
        this.generation++;
    }

    findParent() {
        let total = this.networks.reduce(
            (total, net) => (total += net.fitness),
            0
        );
        let target = Math.random() * total;
        let sum = 0;
        for (const net of this.networks) {
            sum += net.fitness;
            if (sum > total) return net;
        }
        return this.networks[Math.floor(Math.random() * this.count)];
    }
}
