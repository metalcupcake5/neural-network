export class Snake {
    body: [number, number][];
    tail: [number, number][];
    //direction: number; // 0: up, 1: right, 2: down, 3: left
    score: number;
    food: [number, number];
    ateFood: boolean;
    ateFoodPos: [number, number];
    life: number;
    turns: number;
    crashed: boolean;

    /**
     * Create a new game of snake
     */
    constructor() {
        this.body = [[5, 5]];
        this.food = [5, 5];
        while (includesArray(this.body, this.food)) {
            this.food = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ];
        }
        this.life = 100;
        this.score = 0;
        this.turns = 0;
        this.crashed = false;
        //this.direction = 3;
    }

    /**
     * Move one frame forward
     * @param direction Direction to move
     * @returns Object with game info
     */
    act(direction: number) {
        let newPos;
        let headR = this.body[0][0];
        let headC = this.body[0][1];

        // 0: up, 1: right, 2: down, 3: left
        switch (direction) {
            case 0: //up
                newPos = [headR - 1, headC];
                break;
            case 1:
                newPos = [headR, headC + 1];
                break;
            case 2:
                newPos = [headR + 1, headC];
                break;
            case 3:
                newPos = [headR, headC - 1];
                break;
        }

        if (newPos.includes(-1) || newPos.includes(10)) {
            this.crashed = true;
            return { done: true, score: this.score };
        }

        if (includesArray(this.body, newPos)) {
            this.crashed = true;
            return { done: true, score: this.score };
        }

        if (this.food[0] == headR && this.food[1] == headC) {
            this.ateFood = true;
            this.life = 100;
            this.score++;
            this.food = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ];
            while (includesArray(this.body, this.food)) {
                this.food = [
                    Math.floor(Math.random() * 10),
                    Math.floor(Math.random() * 10),
                ];
            }
        }

        if (!this.ateFood) {
            this.body = this.body.splice(0, this.body.length - 1);
        }
        this.ateFood = false;
        this.body = [newPos, ...this.body];

        this.life--;
        this.turns++;

        if (this.life <= 0) return { done: true, score: this.score };

        return {
            done: false,
            score: this.score,
        };
    }

    /**
     * Print the state of the game
     */
    print() {
        let arr = [...Array(10)].map((e) => Array(10).fill(" "));
        let output = [Array(32).fill("-").join("")];
        for (let r = 0; r < 10; r++) {
            let str = "|";
            for (let c = 0; c < 10; c++) {
                str += " ";
                arr[this.food[0]][this.food[1]] = ".";
                if (includesArray(this.body, [r, c])) {
                    arr[r][c] = "o";
                }
                str += arr[r][c];
                str += " ";
            }
            str += "|";
            output.push(str);
        }
        output.push(Array(32).fill("-").join(""));
        console.log(output.join("\n"));
    }

    /**
     * Get a sample of the distances to the wall and food in each direction
     * @returns Object of distances
     */
    sample() {
        let field = Array.from(Array(10), () => new Array(10).fill(0));
        // 0 = empty, 1 = snake, 2 = food
        for (let r = 0; r < field.length; r++) {
            for (let c = 0; c < field[r].length; c++) {
                if (this.food[0] == r && this.food[1] == c) {
                    field[r][c] = 2;
                }
                if (includesArray(this.body, [r, c])) {
                    field[r][c] = 1;
                }
            }
        }

        // let arr = [];
        // field.forEach((array) => {
        //     arr = arr.concat(array);
        // });
        // return arr;

        let head = this.body[0];
        const obj = {
            wall_up: head[0] + 1,
            food_up:
                head[1] == this.food[1]
                    ? this.food[0] >= head[0]
                        ? -1
                        : head[0] - this.food[0]
                    : -1,
            tail_up: (() => {
                let min = 10;
                for (const segment of this.body) {
                    if (segment[1] == head[1] && segment[0] > head[0]) {
                        min = Math.min(head[0] - segment[0], min);
                    }
                }
                return min < 10 ? min : -1;
            })(),
            wall_down: 10 - head[0],
            food_down:
                head[1] == this.food[1]
                    ? this.food[0] <= head[0]
                        ? -1
                        : this.food[0] - head[0]
                    : -1,
            tail_down: (() => {
                let min = 10;
                for (const segment of this.body) {
                    if (segment[1] == head[1] && segment[0] > head[0]) {
                        min = Math.min(segment[0] - head[0], min);
                    }
                }
                return min < 10 ? min : -1;
            })(),
            wall_left: head[1] + 1,
            food_left:
                head[0] == this.food[0]
                    ? this.food[1] >= head[1]
                        ? -1
                        : head[1] - this.food[1]
                    : -1,
            tail_left: (() => {
                let min = 10;
                for (const segment of this.body) {
                    if (segment[0] == head[0] && head[1] > segment[1]) {
                        min = Math.min(head[1] - segment[1], min);
                    }
                }
                return min < 10 ? min : -1;
            })(),
            wall_right: 10 - head[1],
            food_right:
                head[0] == this.food[0]
                    ? this.food[1] <= head[1]
                        ? -1
                        : this.food[1] - head[1]
                    : -1,
            tail_right: (() => {
                let min = 10;
                for (const segment of this.body) {
                    if (segment[0] == head[0] && segment[1] > head[1]) {
                        min = Math.min(segment[1] - head[1], min);
                    }
                }
                return min < 10 ? min : -1;
            })(),
        };
        return Object.values(obj);
    }

    /**
     * Returns current fitness of the game
     * @returns Fitness value
     */
    fitness() {
        if (this.score < 10) {
            return (
                Math.floor(this.turns * this.turns) * Math.pow(2, this.score)
            );
        }
        return (
            Math.floor(this.turns * this.turns) *
            Math.pow(2, 10) *
            (this.score - 9)
        );
    }
}

/**
 * Check if an array contains another array
 * @param data Source array
 * @param arr Array to search for
 * @returns If `arr` was found in `data`
 */
const includesArray = (data, arr) => {
    return data.some(
        (e) => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o))
    );
};
