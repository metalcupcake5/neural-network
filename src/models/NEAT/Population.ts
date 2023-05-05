import { Snake } from "../../game/Snake";
import { Network } from "./Network";

export class Population {
    count: number;
    mutationRate: number;
    networks: Network[] = [];
    gen: number = 0;
    fitnesses = [];

    constructor(amount: number, mutationRate: number) {
        this.count = amount;
        this.mutationRate = mutationRate;
        for (let i = 0; i < amount; i++) {
            this.networks.push(new Network(false, 12, 4, 2, 3));
        }
    }

    async train() {
        let start = Date.now();
        let fitnesses = [];
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

            await Promise.all(training).then((values) => {
                values.forEach((val) => (total += val));
            });

            fitnesses.push({
                net: network,
                fitness: total / plays,
            });
        }

        this.fitnesses = fitnesses;
        console.log(`training took ${(Date.now() - start) / 1000}s`);
    }

    trainNetwork(network) {
        let game = new Snake();
        let done = false;
        let epochs = 0;
        while (!done) {
            let sample = Object.values(game.sample());
            let prediction = network.predict([...sample]);
            let act = game.act(prediction.indexOf(Math.max(...prediction)));
            done = act.done;
            epochs++;
        }
        return game.fitness();
    }

    evaluate() {
        this.fitnesses.sort((a, b) => b.fitness - a.fitness);
        let scores = [];
        this.fitnesses.slice(0, 10).forEach((net) => {
            scores.push(Math.floor(net.fitness));
        });
        let total = this.fitnesses.reduce(
            (total, net) => (total += net.fitness),
            0
        );
        console.log(scores.join(", ") + ` | average: ${total / this.count}`);
    }

    evolve() {
        this.fitnesses.sort((a, b) => b.fitness - a.fitness);
        let top = this.fitnesses.splice(0, 5);
        let newPop = [];
        top.forEach((net) => {
            newPop.push(net.net.clone());
        });
        while (newPop.length < this.count) {
            if (Math.random() < 0.5) {
                let parent1 = top[Math.floor(Math.random() * top.length)];
                let parent2 =
                    this.fitnesses[
                        Math.floor(Math.random() * this.fitnesses.length)
                    ];
                let child;

                if (parent1.fitness > parent2) {
                    child = parent2.net.crossover(parent1.net);
                } else {
                    child = parent1.net.crossover(parent2.net);
                }
                newPop.push(child);
            } else {
                newPop.push(
                    top[Math.floor(Math.random() * top.length)].net.clone()
                );
            }
        }

        let mutCount = 0;
        for (const network of newPop) {
            mutCount += network.mutate(this.mutationRate);
        }

        console.log(`${mutCount} networks mutated`);

        this.networks = newPop;
        this.fitnesses = [];
    }
}
