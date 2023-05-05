import { Connection } from "./Connection";

export class Node {
    isInputNode: boolean;
    isOutputNode: boolean;
    inputs: number;
    outputs: Connection[] = [];
    value: number = 0;
    activationTimes: number = 0;
    innovationNumber: number = 0;

    /**
     * Create a new node
     * @param type 0 for normal, 1 for input, 2, for output
     */
    constructor(innNum: number, type: number) {
        this.innovationNumber = innNum;
        this.isInputNode = type == 1;
        this.isOutputNode = type == 2;
    }

    activate() {
        if (!this.isInputNode) {
            this.value = 1 / (1 + Math.exp(-this.value));
        }
        for (const conn of this.outputs) {
            conn.activate();
        }
    }

    reset() {
        this.inputs = 0;
        this.outputs = [];
        this.value = 0;
        this.activationTimes = 0;
    }

    clone() {
        let newNode = new Node(
            this.innovationNumber,
            this.isOutputNode ? 2 : this.isInputNode ? 1 : 0
        );
        return newNode;
    }

    export() {
        return {
            innovationNumber: this.innovationNumber,
        };
    }
}
