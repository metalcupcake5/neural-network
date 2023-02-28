import { Snake } from "../game/Snake";
import { Taxi } from "../game/Taxi";
import { Network, NetworkSchema } from "./Network";

export class Population {
    total: number;
    members: Network[];
    generation: 0;

    constructor(amount: number, networkSchema?: NetworkSchema) {
        this.total = amount;
        this.members = [];
        this.generation = 0;
        for (let i = 0; i < amount; i++) {
            this.members.push(
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
        for (let i = 0; i < this.members.length; i++) {
            let network = this.members[i];
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
            network.score = fitness;
        }
    }

    evaluate() {
        this.members.sort((a, b) => b.score - a.score);
        let scores = [];
        this.members.slice(0, 10).forEach((net) => {
            scores.push(net.score);
        });
        console.log(scores.join(", "));
    }

    evolve() {
        this.members.sort((a, b) => b.score - a.score);
        let newPop = [];
        this.members.slice(0, 5).forEach((net) => {
            newPop.push(net.clone());
        });
        while (newPop.length < this.total) {
            newPop.push(
                this.members[Math.floor(Math.random() * this.total)].reproduce(
                    0.1
                )
            );
        }
        this.members = newPop;
        this.generation++;
    }
}
