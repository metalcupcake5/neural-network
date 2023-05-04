import { Connection } from "./Connection";
import { Node } from "./Node";

export class Network {
    inputs: Node[] = [];
    outputs: Node[] = [];
    nodes: Node[] = [];
    connections: Connection[] = [];
    innovationCount: number = 0;
    layers: number = 0;

    constructor(
        blank: boolean,
        inputs?: number,
        outputs?: number,
        layers?: number,
        nodesPerLayer?: number
    ) {
        if (!blank) {
            this.layers = layers;
            for (let i = 0; i < outputs; i++) {
                this.outputs.push(new Node(this.innovationCount, 2));
                this.innovationCount++;
            }

            let nextLayer = this.outputs;

            for (let i = 0; i < layers; i++) {
                let curLayer = [];
                for (let j = 0; j < nodesPerLayer; j++) {
                    let node = new Node(this.innovationCount, 0);
                    this.innovationCount++;
                    curLayer.push(node);
                    this.nodes.push(node);
                }

                for (const input of curLayer) {
                    for (const output of nextLayer) {
                        this.connections.push(
                            new Connection(this.innovationCount, input, output)
                        );
                        this.innovationCount++;
                    }
                }
                nextLayer = curLayer;
            }

            for (let i = 0; i < inputs; i++) {
                this.inputs.push(new Node(this.innovationCount, 1));
                this.innovationCount++;
            }

            for (const input of this.inputs) {
                for (const output of nextLayer) {
                    this.connections.push(
                        new Connection(this.innovationCount, input, output)
                    );
                    this.innovationCount++;
                }
            }
        }
    }

    createNetwork() {
        this.disconnectNetwork();
        this.connectNetwork();
    }

    connectNetwork() {
        for (const conn of this.connections) {
            if (!conn.enabled) continue;
            conn.reset();
        }
    }

    disconnectNetwork() {
        for (const node of this.inputs) {
            node.reset();
        }
        for (const node of this.nodes) {
            node.reset();
        }
        for (const node of this.outputs) {
            node.reset();
        }
    }

    predict(inputs: number[]) {
        this.createNetwork();
        for (let i = 0; i < inputs.length; i++) {
            this.inputs[i].value = inputs[i];
        }
        for (const input of this.inputs) {
            input.activate();
        }
        return this.outputs.map((n) => n.value);
    }

    mutate(rate: number) {
        if (Math.random() < rate) {
            let a = 2;
            let conn =
                this.connections[
                    Math.floor(Math.random() * this.connections.length)
                ];
            switch (a) {
                case 0: // weight mutation
                    conn.mutate();
                    break;
                case 1: // connection disable
                    conn.enabled = !conn.enabled;
                    break;
                case 2: // add connection
                    let node =
                        this.nodes[
                            Math.floor(Math.random() * this.nodes.length)
                        ];
                    let disallowedNodes = [node.innovationNumber];
                    for (const conn of node.outputs) {
                        disallowedNodes.push(conn.output.innovationNumber);
                    }
                    let unconnectedNodes = this.nodes.filter(
                        (n) => !disallowedNodes.includes(n.innovationNumber)
                    );
                    console.log(unconnectedNodes.length);
                    if (unconnectedNodes.length <= 0) {
                        break;
                    }
                    let output =
                        unconnectedNodes[
                            Math.floor(Math.random() * unconnectedNodes.length)
                        ];
                    this.connections.push(
                        new Connection(this.innovationCount, node, output)
                    );
                    this.innovationCount++;
                    break;
                case 3: // add node
                    let newNode = new Node(this.innovationCount, 0);
                    this.nodes.push(newNode);
                    this.innovationCount++;
                    let newConnection = new Connection(
                        this.innovationCount,
                        conn.input,
                        newNode
                    );
                    this.connections.push(newConnection);
                    this.innovationCount++;
                    conn.input = newNode;
                    break;
            }
        }
    }

    findNode(innNum: number) {
        for (const input of this.inputs) {
            if (input.innovationNumber == innNum) return input;
        }

        for (const node of this.nodes) {
            if (node.innovationNumber == innNum) return node;
        }

        for (const output of this.outputs) {
            if (output.innovationNumber == innNum) return output;
        }
        return null;
    }

    clone() {
        let newNetwork = new Network(true);
        newNetwork.innovationCount = this.innovationCount;
        newNetwork.layers = this.layers;
        for (const output of this.outputs) {
            newNetwork.outputs.push(output.clone());
        }

        for (const input of this.inputs) {
            newNetwork.inputs.push(input.clone());
        }

        for (const connection of this.connections) {
            let node1 = newNetwork.findNode(connection.input.innovationNumber);
            if (!node1) {
                node1 = connection.input.clone();
                newNetwork.nodes.push(node1);
            }
            let node2 = newNetwork.findNode(connection.output.innovationNumber);
            if (!node2) {
                node2 = connection.output.clone();
                newNetwork.nodes.push(node2);
            }
            let newConnection = new Connection(
                connection.innovationNumber,
                node1,
                node2
            );
            newConnection.weight = connection.weight;
            newConnection.enabled = connection.enabled;
            newNetwork.connections.push(newConnection);
        }
        return newNetwork;
    }

    crossover(parent: Network) {}
}
