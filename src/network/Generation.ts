import { Network, NetworkSchema } from "./Network";

export class Generation {
    total: number;
    members: Network[];

    constructor(amount: number, networkSchema?: NetworkSchema) {
        this.total = amount;
        this.members = [];
        for (let i = 0; i < amount; i++) {
            this.members.push(
                new Network(
                    networkSchema
                        ? networkSchema
                        : {
                              inputs: 2,
                              layers: 3,
                              neuronsPerLayer: 3,
                              outputs: 3,
                          }
                )
            );
        }
    }
}
