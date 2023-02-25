export class Snake {
    body: [number, number][];
    tail: [number, number][];
    //direction: number; // 0: up, 1: right, 2: down, 3: left
    score: number;
    done: boolean;
    food: [number, number];
    ateFood: boolean;
    ateFoodPos: [number, number];
    life: number;

    constructor() {
        this.body = [[5, 5]];
        this.food = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
        ];
        //this.direction = 3;
    }

    step(direction: number) {
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

        if (this.food[0] == headR && this.food[1] == headC) {
            this.ateFood = true;
            this.food = [
                Math.floor(Math.random() * 10),
                Math.floor(Math.random() * 10),
            ];
        }

        if (this.ateFood) {
            this.body.push(this.ateFoodPos);
            this.ateFood = false;
        }
        this.body = [newPos, ...this.body.slice(0, this.body.length - 1)];
        return {
            up: {
                wall: headR,
                food: headC == this.food[1] ? 3 : -1,
            },
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
}

const includesArray = (data, arr) => {
    return data.some(
        (e) => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o))
    );
};
