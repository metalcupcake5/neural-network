import { Node } from "./Node";

export class Connection {
    input: Node;
    output: Node;
    weight: number = Math.random();
    value: number = 0;
    enabled: boolean = true;
    innovationNumber: number = 0;

    constructor(innNum: number, input: Node, output: Node) {
        this.innovationNumber = innNum;
        this.input = input;
        this.output = output;
    }

    activate() {
        this.value = this.input.value * this.weight;
        this.output.value += this.value;
        this.output.activationTimes++;
        if (this.output.activationTimes >= this.output.inputs) {
            this.output.activate();
        }
    }

    mutate() {
        this.value += gaussian() / 10;
        if (this.value > 1) this.value = 1;
        if (this.value < -1) this.value = -1;
    }

    reset() {
        this.value = 0;
        this.input.outputs.push(this);
        this.output.inputs++;
    }

    export() {
        return {
            weight: this.weight,
            enabled: this.enabled,
            innovationNumber: this.innovationNumber,
            input: this.input.innovationNumber,
            output: this.output.innovationNumber,
        };
    }
}

// random gaussian modified from https://github.com/processing/p5.js/blob/v1.6.0/src/math/random.js
function gaussian() {
    let y1, x1, x2, w;
    do {
        x1 = Math.random() * 2 - 1;
        x2 = Math.random() * 2 - 1;
        w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt((-2 * Math.log(w)) / w);
    y1 = x1 * w;
    return y1;
}
