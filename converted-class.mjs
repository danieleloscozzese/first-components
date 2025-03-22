class Quadrangle {
  /** @type {Number} */
  #length;
  /** @type {Number} */
  #width;

  /**
   * @param {Number} length
   * @param {Number} [width] The width, if different from the length.
   */
  constructor(length, width = length) {
    this.#length = length;
    this.#width = width;
  }

  get length() {
    return this.#length;
  }

  get width() {
    return this.#width;
  }

  get area() {
    return this.#length * this.#width;
  }

  get [Symbol.toStringTag]() {
    return "Quadrangle";
  }

  /**
   * @param {String} [key] The key of the object being serialized
   */
  toJSON() {
    return {
      length: this.#length,
      width: this.#width,
    };
  }

  toString() {
    if (this.#length === this.#width) {
      return `A square of length ${this.#length}`;
    } else {
      return `A rectangle of length ${this.#length} and width ${this.#width}`;
    }
  }

  // Custom inspect method for Node.js console
  [Symbol.for("nodejs.util.inspect.custom")](depth, options) {
    return (
      options.stylize(`${this[Symbol.toStringTag]} `, "class") +
      `{ length: ${options.stylize(this.length, "number")}, width: ${options.stylize(this.width, "number")} }`
    );
  }
}

const q = new Quadrangle(2, 3);
console.log(q);
console.log(String(q));
console.log(JSON.stringify(q));
