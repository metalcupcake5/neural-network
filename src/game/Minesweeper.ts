export class MineSweeper {
    size: number;
    mines: number[][];
    field: string[][];
    done: boolean;
    turns: number;
    score: number;

    constructor(size) {
        this.size = size;
        this.mines = [];
        this.field = [];
        this.done = false;
        this.turns = 0;
        this.score = 0;
        //this.printGame()
        for (let i = 0; i < this.size; i++) {
            this.field.push(" ".repeat(this.size).split(""));
        }
    }

    setup(startR, startC) {
        for (let y = 0; y < this.size; y++) {
            let row = [];
            for (let x = 0; x < this.size; x++) {
                row.push(0);
            }
            this.mines.push(row);
        }

        let mines = 0;
        while (mines < Math.floor((this.size * this.size) / 5)) {
            let row = Math.floor(Math.random() * this.size);
            let col = Math.floor(Math.random() * this.size);
            if (row != startR && col != startC && this.mines[row][col] != -1) {
                this.mines[row][col] = -1;
                mines++;
            }
        }

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.mines[y][x] == -1) {
                    // top
                    if (y != 0) {
                        // top left
                        if (x != 0) {
                            this.mines[y - 1][x - 1] +=
                                this.mines[y - 1][x - 1] == -1 ? 0 : 1;
                        }
                        // top right
                        if (x != this.size - 1) {
                            this.mines[y - 1][x + 1] +=
                                this.mines[y - 1][x + 1] == -1 ? 0 : 1;
                        }
                        // top
                        this.mines[y - 1][x] +=
                            this.mines[y - 1][x] == -1 ? 0 : 1;
                    }
                    // bottom
                    if (y != this.size - 1) {
                        // bottom left
                        if (x != 0) {
                            this.mines[y + 1][x - 1] +=
                                this.mines[y + 1][x - 1] == -1 ? 0 : 1;
                        }
                        // bottom right
                        if (x != this.size - 1) {
                            this.mines[y + 1][x + 1] +=
                                this.mines[y + 1][x + 1] == -1 ? 0 : 1;
                        }
                        // bottom
                        this.mines[y + 1][x] +=
                            this.mines[y + 1][x] == -1 ? 0 : 1;
                    }
                    // left
                    if (x != 0) {
                        this.mines[y][x - 1] +=
                            this.mines[y][x - 1] == -1 ? 0 : 1;
                    }
                    // right
                    if (x != this.size - 1) {
                        this.mines[y][x + 1] +=
                            this.mines[y][x + 1] == -1 ? 0 : 1;
                    }
                }
            }
        }
    }
    printGame(type = 0) {
        console.log("----".repeat(this.size) + "-");
        for (let row = 0; row < this.size; row++) {
            let line = "| ";
            for (let col = 0; col < this.size; col++) {
                let cell =
                    type == 0 ? this.field[row][col] : this.mines[row][col];
                line += cell == -1 ? "x" : cell;
                line += " | ";
            }
            console.log(line);
            console.log("----".repeat(this.size) + "-");
        }
    }

    empty(found, cell) {
        if (!includesArray(found, cell)) {
            found.push(cell);
            if (this.mines[cell[0]][cell[1]] == 0) {
                this.findNearbyEmpty(cell[0], cell[1], found);
            }
        }
    }

    findNearbyEmpty(row, col, found) {
        //top
        if (row != 0) {
            // top left
            if (col != 0) {
                const cell = [row - 1, col - 1];
                this.empty(found, cell);
            }

            // up
            const cell = [row - 1, col];
            this.empty(found, cell);

            // top right
            if (col != this.size - 1) {
                const cell = [row - 1, col + 1];
                this.empty(found, cell);
            }
        }

        // bottom
        if (row != this.size - 1) {
            // bottom left
            if (col != 0) {
                const cell = [row + 1, col - 1];
                this.empty(found, cell);
            }

            // down
            const cell = [row + 1, col];
            this.empty(found, cell);

            // bottom right
            if (col != this.size - 1) {
                const cell = [row + 1, col + 1];
                this.empty(found, cell);
            }
        }
        if (col != 0) {
            // left
            const cell = [row, col - 1];
            this.empty(found, cell);
        }
        if (col != this.size - 1) {
            // right
            const cell = [row, col + 1];
            this.empty(found, cell);
        }
    }

    win() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.mines[r][c] != -1) {
                    if (this.field[r][c].trim().length < 1) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    countUncovered() {
        let count = 0;
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.field[r][c].trim().length > 0) {
                    count++;
                }
            }
        }
        return count;
    }

    calcScore() {
        this.score = this.countUncovered();
        this.score *= this.turns;
    }

    act(row, col, action = 0) {
        if (this.mines.length <= 1) {
            this.setup(row, col);
        }
        let cell = this.mines[row][col]; // number of bombs next to cell

        this.field[row][col] = this.mines[row][col].toString();
        if (this.mines[row][col] == 0) {
            let found = [[row, col]];
            this.findNearbyEmpty(row, col, found);
            for (const cell of found) {
                this.field[cell[0]][cell[1]] =
                    this.mines[cell[0]][cell[1]].toString();
            }
        }
        this.calcScore();
        if (cell == -1) {
            console.log("explode");
            return {
                done: true,
            };
        }
        if (this.win()) {
            console.log("win");
            this.score += 100;
            return {
                done: true,
            };
        }
        this.turns++;
        return {
            done: false,
        };
    }

    sample() {
        let arr = [];
        this.field
            .flat()
            .forEach((c) => arr.push(c.trim().length < 1 ? -1 : parseInt(c)));
        return arr;
    }
}

const includesArray = (data, arr) => {
    return data.some(
        (e) => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o))
    );
};

// let game = new MineSweeper(8);
// game.printGame();
//console.log(game.mines)
