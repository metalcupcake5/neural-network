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
    defaultState: {
        row: number;
        column: number;
        destination: number;
        passengerLocation: number;
    };

    constructor(state?) {
        if (!state) {
            this.row = Math.floor(Math.random() * 5);
            this.column = Math.floor(Math.random() * 5);
            this.destination = Math.floor(Math.random() * 4);
            this.passengerLocation = Math.floor(Math.random() * 4);
            this.state =
                ((this.row * 5 + this.column) * 5 + this.passengerLocation) *
                    4 +
                this.destination;
            this.turns = 0;
            this.defaultState = state || {
                row: this.row,
                column: this.column,
                destination: this.destination,
                passengerLocation: this.passengerLocation,
            };
        } else {
            this.row = state.row;
            this.column = state.column;
            this.destination = state.destination;
            this.passengerLocation = state.passengerLocation;
            this.state =
                ((this.row * 5 + this.column) * 5 + this.passengerLocation) *
                    4 +
                this.destination;
            this.turns = 0;
            this.defaultState = state;
        }
    }

    reset(shape: {
        row: number;
        column: number;
        destination: number;
        passengerLocation: number;
    }) {
        this.row = shape.row;
        this.column = shape.column;
        this.destination = shape.destination;
        this.passengerLocation = shape.passengerLocation;
        this.state =
            ((this.row * 5 + this.column) * 5 + this.passengerLocation) * 4 +
            this.destination;
        this.turns = 0;
    }

    // ((taxi_row * 5 + taxi_col) * 5 + passenger_location) * 4 + destination
    sample(): {
        row: number;
        column: number;
        passengerLocation: number;
        destination: number;
    } {
        return {
            row: this.row,
            column: this.column,
            passengerLocation: this.passengerLocation,
            destination: this.destination,
        };
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
        state?: {
            row: number;
            column: number;
            passengerLocation: number;
            destination: number;
        };
        done: boolean;
    } {
        this.turns++;
        let pos = this.getCurrentPosition();
        switch (action) {
            case 0: // down
                if (this.row == 4) {
                    break;
                }
                this.row += 1;
                break;
            case 1: // up
                if (this.row == 0) {
                    break;
                }
                this.row -= 1;
                break;
            case 2: // right
                if (this.column == 4 || includesArray(conflicts[2], pos.pos)) {
                    break;
                }
                this.column += 1;
                break;
            case 3: // left
                if (this.column == 0 || includesArray(conflicts[3], pos.pos)) {
                    break;
                }
                this.column -= 1;
                break;
            case 4: // pickup
                if (
                    pos.destination != this.passengerLocation ||
                    this.passengerLocation == 4 ||
                    !includesArray(destinations, pos.pos)
                )
                    return {
                        reward: -10,
                        state: this.sample(),
                        done: this.turns >= 500,
                    };
                this.passengerLocation = 4;
                return {
                    reward: 20,
                    state: this.sample(),
                    done: this.turns >= 500,
                };
            case 5: // dropoff
                if (
                    pos.destination == -1 ||
                    this.passengerLocation != 4 ||
                    !includesArray(destinations, pos.pos)
                )
                    return {
                        reward: -10,
                        state: this.sample(),
                        done: this.turns >= 500,
                    };
                if (pos.destination == this.destination)
                    return { reward: 20, done: true };
                break;
        }
        this.state =
            ((this.row * 5 + this.column) * 5 + this.passengerLocation) * 4 +
            this.destination;
        return { reward: -1, state: this.sample(), done: this.turns >= 500 };
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

        let dests = {
            0: {
                row: 0,
                column: 1,
            },
            1: {
                row: 0,
                column: 9,
            },
            2: {
                row: 4,
                column: 1,
            },
            3: {
                row: 4,
                column: 7,
            },
        };
        // default
        ("+---------+\n|R: | : :\x1b[35mG\x1b[0m|\n| : | : : |\n| : : : : |\n| | : | : |\n|Y| : |\x1b[34;1m\x1b[43mB\x1b[0m\x1b[0m: |\n+---------+\n\n");
        // after picking up
        ("+---------+\n|R: | : :\x1b[35mG\x1b[0m|\n| : | : : |\n| : : : : |\n| | : |\x1b[42m_\x1b[0m: |\n|Y| : |B: |\n+---------+\n  (North)\n");
        let taxi =
            (this.passengerLocation == 4
                ? "\x1b[42m_"
                : `\x1B[43m${field[this.row][this.column * 2 + 1]}`) + "\x1B[m";
        field[this.row][this.column * 2 + 1] = taxi;

        let destination = dests[this.destination];

        field[destination.row][destination.column] = `\x1b[35m${
            field[destination.row][destination.column]
        }\x1b[0m`;

        let passenger = dests[this.passengerLocation];
        if (passenger) {
            field[passenger.row][passenger.column] = `\x1b[1;34m${
                field[passenger.row][passenger.column]
            }\x1b[0m`;
        }

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
