import math = require("mathjs");
import { Snake } from "./game/Snake";
import * as readline from "readline";
import * as fs from "fs";
import { Maze } from "./game/Maze";

import nj = require("numjs");
import { Network } from "./models/NEAT/Network";
import { Population } from "./models/NEAT/Population";

/*const pop = new Population(2000, 0.3);
console.log("starting");
const a = async () => {
    await pop.train();
    pop.evaluate();
    pop.evolve();
};
a();*/
main();

// {
//     wall_up: number;
//     food_up: number;
//     wall_down: number;
//     food_down: number;
//     wall_left: number;
//     food_left: number;
//     wall_right: number;
//     food_right: number;
// }

async function main() {
    console.log("clearing saved networks");
    for (const file of await fs.promises.readdir("./build/networks")) {
        await fs.promises.unlink(`./build/networks/${file}`);
    }

    console.log("training");
    let pop = new Population(2000, 0.7);

    await pop.train();
    for (let i = 0; i < 5000; i++) {
        console.log(`pop ${i + 1}`);
        pop.evaluate();
        if ((i + 1) % 1 == 0) {
            fs.writeFileSync(
                `./build/networks/${i}.json`,
                JSON.stringify(pop.fitnesses[0].net.export())
            );
        }
        pop.evolve();
        await pop.train();
    }

    pop.evaluate();
    let network = pop.fitnesses[0];
    console.log(`score: ${network.fitness}`);
}
/*
async function testing(num) {
    let pop = new Population(500, 0.75, 0.2, {
        inputs: 8,
        layers: 3,
        neuronsPerLayer: 8,
        outputs: 4,
    });

    pop.train();
    pop.findParent();
}*/

async function replay(num) {
    let file = await fs.promises.readFile(
        `./build/networks/${num}.json`,
        "utf-8"
    );
    let data = JSON.parse(file);
    let net = new Network(true);
    net.import(data);
    let game = new Snake();
    let done = false;
    game.print();
    run();

    function run() {
        setTimeout(() => {
            let sample = Object.values(game.sample());
            let prediction = net.predict([...sample]);
            let act = game.act(prediction.indexOf(Math.max(...prediction)));
            done = act.done;

            game.print();
            if (!done) {
                run();
            }
        }, 250);
    }
}
/*
async function player() {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const util = require("util");
    const question = util.promisify(rl.question).bind(rl);

    let game = new Maze();
    let done = false;
    game.print();
    while (!done) {
        console.log("0: up, 1: right, 2: down, 3: left");
        let move = await question("Move: ");
        const { done: d } = game.act(parseInt(move));
        game.print();
        game.sample();
        done = d;
    }
    console.log(`Score: ${game.score}`);
    console.log(`Fitness: ${game.fitness()}`);
    rl.close();
}

async function cloneTest() {
    let net = new Network({
        inputs: 2,
        layers: 3,
        neuronsPerLayer: 8,
        outputs: 4,
    });

    console.log(net.predict([0, 1]));

    let test = net.clone();

    console.log(net.hiddenLayers[0]);
    console.log(net.hiddenLayers[0]);
}
*/
