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
        let game = new Taxi();
        let state = game.defaultState;
        for (let i = 0; i < this.members.length; i++) {
            let network = this.members[i];
            game.reset(state);
            let done = false;
            let score = 0;
            let epochs = 0;
            while (!done) {
                let act = game.act(
                    network.predict([...Object.values(game.sample())])
                );
                score += act.reward;
                done = act.done;
                epochs++;
            }
            network.score = score;
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
            for (let i = 0; i < this.total / 5; i++) {
                newPop.push(net.reproduce(0.99));
            }
        });
        this.members = newPop;
        this.generation++;
    }
}
