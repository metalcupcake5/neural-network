export class Maze {
    goal: [number, number];
    holes: [number, number][];
    turns: number;
    position: [number, number];
    score: number;

    constructor() {
        this.position = [0, 0];
        this.holes = [];
        this.score = 0;
        this.turns = 0;
        for (let i = 0; i < 4; i++) {
            let newHole: [number, number] = [
                Math.floor(Math.random() * 4),
                Math.floor(Math.random() * 4),
            ];
            while (
                includesArray(this.holes, newHole) ||
                (newHole[0] == 4 && newHole[1] == 4) ||
                (newHole[0] == 0 && newHole[1] == 0)
            ) {
                newHole = [
                    Math.floor(Math.random() * 4),
                    Math.floor(Math.random() * 4),
                ];
            }
            this.holes.push(newHole);
        }
    }

    act(direction: number) {
        let newPos;
        let row = this.position[0];
        let column = this.position[1];

        // 0: up, 1: right, 2: down, 3: left
        switch (direction) {
            case 0: //up
                newPos = [row - 1, column];
                break;
            case 1:
                newPos = [row, column + 1];
                break;
            case 2:
                newPos = [row + 1, column];
                break;
            case 3:
                newPos = [row, column - 1];
                break;
        }
        this.turns++;
        this.score -= 1;

        if (this.turns >= 50) {
            return { done: true, fitness: this.fitness() };
        }

        if (newPos.includes(-1) || newPos.includes(5)) {
            return { done: false, fitness: this.fitness() };
        }

        if (includesArray(this.holes, newPos)) {
            this.score -= 50;
            return { done: true, fitness: this.fitness() };
        }

        if (newPos[0] == 4 && newPos[1] == 4) {
            this.score += 100;
            return { done: true, fitness: this.fitness() };
        }

        this.position = newPos;

        return { done: false, fitness: this.fitness() };
    }

    sample() {
        const output = [this.position[0], this.position[1]];
        for (const hole of this.holes) {
            output.push(hole[0]);
            output.push(hole[1]);
        }
        return output;
    }

    fitness() {
        return this.score;
    }

    print() {
        let arr = [...Array(5)].map((e) => Array(5).fill(" "));
        let output = [Array(17).fill("-").join("")];
        arr[this.position[0]][this.position[1]] = "x";
        for (let r = 0; r < 5; r++) {
            let str = "|";
            for (let c = 0; c < 5; c++) {
                str += " ";
                if (includesArray(this.holes, [r, c])) {
                    arr[r][c] = "o";
                }
                str += arr[r][c];
                str += " ";
            }
            str += "|";
            output.push(str);
        }

        output.push(Array(17).fill("-").join(""));
        console.log(output.join("\n"));
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
