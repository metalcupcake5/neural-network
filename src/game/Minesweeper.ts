class MineSweeper {
    size: number;
    mines: string[][];
    field: number[][];
    done: boolean;
    turn: number;

    constructor(size) {
        this.size = size;
        this.mines = [];
        this.field = Array(size).fill(Array(size).fill(" "));
        this.done = false;
        this.turn = 0;
        this.setup();
        //this.printGame()
    }

    setup() {
        for (let y = 0; y < this.size; y++) {
            let row = [];
            for (let x = 0; x < this.size; x++) {
                row.push(Math.random() < 0.155 ? "x" : 0);
            }
            this.mines.push(row);
        }

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.mines[y][x] == "x") {
                    // top
                    if (y != 0) {
                        // top left
                        if (x != 0) {
                            this.mines[y - 1][x - 1] +=
                                this.mines[y - 1][x - 1] == "x" ? "" : 1;
                        }
                        // top right
                        if (x != this.size - 1) {
                            this.mines[y - 1][x + 1] +=
                                this.mines[y - 1][x + 1] == "x" ? "" : 1;
                        }
                        // top
                        this.mines[y - 1][x] +=
                            this.mines[y - 1][x] == "x" ? "" : 1;
                    }
                    // bottom
                    if (y != this.size - 1) {
                        // bottom left
                        if (x != 0) {
                            this.mines[y + 1][x - 1] +=
                                this.mines[y + 1][x - 1] == "x" ? "" : 1;
                        }
                        // bottom right
                        if (x != this.size - 1) {
                            this.mines[y + 1][x + 1] +=
                                this.mines[y + 1][x + 1] == "x" ? "" : 1;
                        }
                        // bottom
                        this.mines[y + 1][x] +=
                            this.mines[y + 1][x] == "x" ? "" : 1;
                    }
                    // left
                    if (x != 0) {
                        this.mines[y][x - 1] +=
                            this.mines[y][x - 1] == "x" ? "" : 1;
                    }
                    // right
                    if (x != this.size - 1) {
                        this.mines[y][x + 1] +=
                            this.mines[y][x + 1] == "x" ? "" : 1;
                    }
                }
            }
        }
    }
    printGame() {
        console.log("----".repeat(this.size) + "-");
        for (let y = 0; y < this.size; y++) {
            let line = "| ";
            for (let x = 0; x < this.size; x++) {
                line += this.mines[y][x];
                line += " | ";
            }
            console.log(line);
            console.log("----".repeat(this.size) + "-");
        }
    }
}

let game = new MineSweeper(8);
game.printGame();
//console.log(game.mines)
