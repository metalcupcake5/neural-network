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
                              inputs: 1,
                              layers: 5,
                              neuronsPerLayer: 5,
                              outputs: 5,
                          }
                )
            );
        }
    }
}
