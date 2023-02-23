/*
https://gymnasium.farama.org/environments/toy_text/taxi/
*/

export class Taxi {
    passengerLocation: number; //0: Red, 1: Green, 2: Yellow, 3: Blue, 4: In taxi
    destination: number; //0: Red, 1: Green, 2: Yellow, 3: Blue
    row: number;
    column: number;
    state: number;
    turns: number;

    constructor() {
        this.row = Math.floor(Math.random() * 5);
        this.column = Math.floor(Math.random() * 5);
        this.destination = Math.floor(Math.random() * 4);
        this.passengerLocation = Math.floor(Math.random() * 5);
        this.state =
            ((this.row * 5 + this.column) * 5 + this.passengerLocation) * 4 +
            this.destination;
        this.turns = 0;
    }

    // ((taxi_row * 5 + taxi_col) * 5 + passenger_location) * 4 + destination
    sample(): number {
        return this.state;
    }

    /*  
        0: Move south (down)
        1: Move north (up)
        2: Move east (right)
        3: Move west (left)
        4: Pickup passenger
        5: Drop off passenger
    */
    act(action: number): {
        reward: number;
        state?: number;
        done: boolean;
    } {
        this.turns++;
        let pos = this.getCurrentPosition();
        switch (action) {
            case 0: // down
                if (this.row == 4) break;
                this.row += 1;
                break;
            case 1: // up
                if (this.row == 0) break;
                this.row -= 1;
                break;
            case 2: // right
                if (this.column == 4 || includesArray(conflicts[2], pos.pos))
                    break;
                this.column += 1;
                break;
            case 3: // left
                if (this.column == 0 || includesArray(conflicts[3], pos.pos))
                    break;
                this.column -= 1;
                break;
            case 4: // pickup
                if (
                    pos.destination != this.passengerLocation ||
                    this.passengerLocation == 4 ||
                    !includesArray(destinations, pos.pos)
                )
                    return { reward: -10, state: this.sample(), done: false };
                this.passengerLocation = 4;
                break;
            case 5: // dropoff
                if (
                    pos.destination == -1 ||
                    this.passengerLocation != 4 ||
                    !includesArray(destinations, pos.pos)
                )
                    return { reward: -10, state: this.sample(), done: false };
                if (pos.destination == this.destination)
                    return { reward: 20, done: true };
                break;
        }
        this.state =
            ((this.row * 5 + this.column) * 5 + this.passengerLocation) * 4 +
            this.destination;
        return { reward: -1, state: this.sample(), done: false };
    }

    getCurrentPosition() {
        //0: Red, 1: Green, 2: Yellow, 3: Blue
        let destination = -1;
        if (this.row == 0) {
            if (this.column == 0) destination = 0;
            if (this.column == 4) destination = 1;
        }
        if (this.row == 4) {
            if (this.column == 0) destination = 2;
            if (this.column == 4) destination = 3;
        }
        return {
            pos: [this.row, this.column],
            destination: destination,
        };
    }

    print() {
        let field = [
            ["|", "R", ":", " ", "|", " ", ":", " ", ":", "G", "|"],
            ["|", " ", ":", " ", "|", " ", ":", " ", ":", " ", "|"],
            ["|", " ", ":", " ", ":", " ", ":", " ", ":", " ", "|"],
            ["|", " ", "|", " ", ":", " ", "|", " ", ":", " ", "|"],
            ["|", "Y", "|", " ", ":", " ", "|", "B", ":", " ", "|"],
        ];
        let taxi =
            (this.passengerLocation == 4
                ? "\x1B[46mP"
                : `\x1B[107m${field[this.row][this.column * 2 + 1]}`) +
            "\x1B[m";
        field[this.row][this.column * 2 + 1] = taxi;

        field[0][1] = `\x1B[41m${
            this.passengerLocation == 0 ? "P" : field[0][1]
        }\x1B[m`;
        field[0][9] = `\x1B[42m${
            this.passengerLocation == 1 ? "P" : field[0][9]
        }\x1B[m`;
        field[4][1] = `\x1B[43m${
            this.passengerLocation == 2 ? "P" : field[4][1]
        }\x1B[m`;
        field[4][7] = `\x1B[44m${
            this.passengerLocation == 3 ? "P" : field[4][7]
        }\x1B[m`;

        let base = "+---------+\n";
        for (const line of field) base += line.join("") + "\n";
        base += "+---------+";
        console.log(base);
    }
}

const destinations = [
    [0, 0],
    [0, 4],
    [4, 0],
    [4, 3],
];

const conflicts = {
    2: [
        [0, 1],
        [1, 1],
        [3, 0],
        [4, 0],
        [3, 2],
        [4, 2],
    ],
    3: [
        [0, 2],
        [1, 2],
        [3, 1],
        [4, 1],
        [3, 3],
        [4, 3],
    ],
};

const includesArray = (data, arr) => {
    return data.some(
        (e) => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o))
    );
};
