import { Maze } from "../game/Maze";
import { Snake } from "../game/Snake";
import { Taxi } from "../game/Taxi";
import { Network, NetworkSchema } from "./Network";

export class Population {
    count: number;
    networks: Network[];
    generation: 0;
    crossoverRate: number;
    mutationRate: number;

    /**
     * Create a population of networks
     * @param amount The total number of networks within this population
     * @param crossoverRate Chance of a crossover occuring between networks of a generation
     * @param mutationRate Chance for a network to mutate
     * @param networkSchema Schema for every network
     */
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

    /**
     * Train a population of networks
     */
    async train() {
        let start = Date.now();
        // let game = new Taxi();
        // let state = game.defaultState;
        for (let i = 0; i < this.networks.length; i++) {
            let plays = 10;
            let total = 0;
            let network = this.networks[i];

            let training = [];
            for (let i = 0; i < plays; i++) {
                training.push(
                    new Promise((resolve, reject) => {
                        let fitness = this.trainNetwork(network);
                        resolve(fitness);
                    })
                );
            }

            //console.log("training");
            //console.log(training);

            await Promise.all(training).then((values) => {
                values.forEach((val) => (total += val));
            });

            network.fitness = total / plays;
        }

        console.log(`took ${(Date.now() - start) / 1000}s`);
    }

    /**
     * Evaluate all networks and print the scores of the top 10
     */
    evaluate() {
        this.networks.sort((a, b) => b.fitness - a.fitness);
        let scores = [];
        this.networks.slice(0, 10).forEach((net) => {
            scores.push(Math.floor(net.fitness));
        });
        let total = this.networks.reduce(
            (total, net) => (total += net.fitness),
            0
        );
        console.log(scores.join(", ") + ` | average: ${total / this.count}`);
    }

    /**
     * Create a new generation of networks
     */
    evolve() {
        this.networks.sort((a, b) => b.fitness - a.fitness);
        let newPop = [];
        this.networks.slice(0, 5).forEach((net) => {
            newPop.push(net.clone());
        });
        let stats = {
            crossedover: 0,
            mutated: 0,
        };
        while (newPop.length < this.count) {
            let parent1 = this.networks[Math.floor(Math.random() * 5)];
            let newNet = parent1.clone();

            if (Math.random() < this.crossoverRate) {
                let parent2 = this.findParent();
                newNet = newNet.crossover(parent2, 0.75);
                stats.crossedover++;
            }

            if (Math.random() < this.mutationRate) {
                newNet = newNet.reproduce(0.95);
                stats.mutated++;
            }

            newPop.push(newNet);
        }
        this.networks = newPop;
        this.generation++;
        console.log(
            `${stats.crossedover} crossed over, ${stats.mutated} mutated`
        );
    }

    /**
     * Finds a random parent weighted by a network's fitness
     * @returns A random network
     */
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

    trainNetwork(network) {
        // game.reset(state);
        let game = new Maze();
        let done = false;
        let epochs = 0;
        while (!done) {
            let sample = Object.values(game.sample());
            let act = game.act(network.predict([...sample]));
            done = act.done;
            epochs++;
        }
        return game.fitness();
    }
}
