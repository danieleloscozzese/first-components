// let k = {
//   length: 10,
//   width: 10,
//   get area() {
//     return this.length * this.width;
//   },
// };

// console.log(JSON.stringify(k));
// console.log(JSON.stringify(k, ["length", "width"]));
// console.log(k.hasOwnProperty("area"));

class Quadrangle {
  /** @type {Number} */
  length;
  /** @type {Number} */
  width;

  /**
   * @param {Number} length
   * @param {Number} [width] The width, if different from the length.
   */
  constructor(length, width = length) {
    this.length = length;
    this.width = width;
  }

  get area() {
    return this.length * this.width;
  }

  // get [Symbol.toStringTag]() {
  //   return "Quadrangle";
  // }

  // toString() {
  //   if (this.length === this.width) {
  //     return `a square of length ${this.length}`;
  //   } else {
  //     return `a rectangle of length ${this.length} and width ${this.width}`;
  //   }
  // }

  /**
   * @param {String} s
   * @returns {Quadrangle}
   */
  static fromJSON(s) {
    const { length, width } = JSON.parse(s);

    return new Quadrangle(length, width);
  }

  // /**
  //  * @param {String} [key] The key of the object being serialized
  //  */
  // toJSON() {
  //   return {
  //     type: this[Symbol.toStringTag],
  //     length: this.length,
  //     width: this.width,
  //     area: this.area,
  //   };
  // }
}

const four = new Quadrangle(4);
// console.log(four.toString());
// console.log(JSON.stringify(new Quadrangle(5, 10)));
console.log(four.toString());
