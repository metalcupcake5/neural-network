import math = require("mathjs");
import nj = require("numjs");

export class Model {
    max_episodes: number;
    max_actions: number;
    learning_rate: number;
    discount: number;
    exploration_rate: number;
    exploration_decay: number;
    env;
    Q;
    constructor(environment) {
        this.max_episodes = 20000;
        this.max_actions = 99;
        this.learning_rate = 0.83;
        this.discount = 0.93;
        this.exploration_rate = 1.0;
        this.exploration_decay = 1.0 / this.max_episodes;

        this.env = environment;

        this.Q = nj.zeros([16, 4]);
    }

    policy(mode, state, e_rate) {
        if (mode == "train") {
            if (Math.random() > e_rate) {
                return nj.max(this.Q[state]);
            }
            return this.env.sample();
        } else if (mode == "test") {
            return nj.max(this.Q[state]);
        }
    }

    train() {}

    test(Q) {}

    display() {}
}
