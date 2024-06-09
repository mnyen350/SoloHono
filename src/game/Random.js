//
// reference:
// https://stackoverflow.com/questions/4768180/rand-implementation
// reason:
// we need a seeded random for easier testing which cannot be accomplished with Math.random()
//

const INT32_MAX = 0x7FFFFFFF;

export default class Random {
    _next;

    constructor(seed) {
        this._next = seed ? seed : 1;
    }

    nextFloat() {
        const next = (Math.imul(this._next, 1103515245) + 12345) & INT32_MAX;
        this._next = next;
        return next / INT32_MAX;
    }

    nextInt(min, max) {
        return Math.floor((max - min) * this.nextFloat()) + min;
    }
}