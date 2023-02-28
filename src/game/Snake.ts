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

    constructor() {
        this.body = [[5, 5]];
        this.food = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
        ];
        this.life = 50;
        this.score = 0;
        this.turns = 0;
        //this.direction = 3;
    }

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
            return { done: true, score: this.score, fitness: this.fitness() };
        }

        if (includesArray(this.body, newPos)) {
            return { done: true, score: this.score, fitness: this.fitness() };
        }

        if (this.food[0] == headR && this.food[1] == headC) {
            this.ateFood = true;
            this.life = 50;
            this.score++;
            this.food = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ];
        }

        if (!this.ateFood) {
            this.body = this.body.splice(0, this.body.length - 1);
        }
        this.ateFood = false;
        this.body = [newPos, ...this.body];

        this.life--;
        this.turns++;

        if (this.life <= 0)
            return { done: true, score: this.score, fitness: this.fitness() };

        return {
            up: {
                wall: newPos[0] + 1,
                food:
                    newPos[1] == this.food[1]
                        ? this.food[0] >= newPos[0]
                            ? -1
                            : newPos[0] - this.food[0]
                        : -1,
            },
            down: {
                wall: 10 - newPos[0],
                food:
                    newPos[1] == this.food[1]
                        ? this.food[0] <= newPos[0]
                            ? -1
                            : this.food[0] - newPos[0]
                        : -1,
            },
            left: {
                wall: newPos[1] + 1,
                food:
                    newPos[0] == this.food[0]
                        ? this.food[1] >= newPos[1]
                            ? -1
                            : newPos[1] - this.food[1]
                        : -1,
            },
            right: {
                wall: 10 - newPos[1],
                food:
                    newPos[0] == this.food[0]
                        ? this.food[1] <= newPos[1]
                            ? -1
                            : this.food[1] - newPos[1]
                        : -1,
            },
            done: false,
            score: this.score,
            fitness: this.fitness(),
        };
    }

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

    sample(): {
        wall_up: number;
        food_up: number;
        wall_down: number;
        food_down: number;
        wall_left: number;
        food_left: number;
        wall_right: number;
        food_right: number;
    } {
        let head = this.body[0];
        return {
            wall_up: head[0] + 1,
            food_up:
                head[1] == this.food[1]
                    ? this.food[0] >= head[0]
                        ? -1
                        : head[0] - this.food[0]
                    : -1,
            wall_down: 10 - head[0],
            food_down:
                head[1] == this.food[1]
                    ? this.food[0] <= head[0]
                        ? -1
                        : this.food[0] - head[0]
                    : -1,
            wall_left: head[1] + 1,
            food_left:
                head[0] == this.food[0]
                    ? this.food[1] >= head[1]
                        ? -1
                        : head[1] - this.food[1]
                    : -1,
            wall_right: 10 - head[1],
            food_right:
                head[0] == this.food[0]
                    ? this.food[1] <= head[1]
                        ? -1
                        : this.food[1] - head[1]
                    : -1,
        };
    }

    fitness() {
        return 10 * this.score + this.turns;
    }
}

const includesArray = (data, arr) => {
    return data.some(
        (e) => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o))
    );
};
