const shapeBase = Object.create(Object.prototype, {
  area: {
    get() {
      throw new TypeError("The area must be defined for a specific shape");
    },
  },
});

const rectangle = Object.create(shapeBase, {
  length: { value: 5, configurable: true },
  width: { value: 4, configurable: true },
});

console.group("First pass");
try {
  console.log("Area:", rectangle.area);
} catch {
  console.error("There was an error accessing the area of the rectangle.");
}
console.log("The object is", rectangle);
console.log(`The object stringified is ${rectangle}`);
console.groupEnd();

console.group("With enumerable values");
Object.defineProperties(rectangle, {
  length: { value: 5, enumerable: true },
  width: { value: 4, enumerable: true },
});
rectangle.sides = 4;
console.log("The object is", rectangle);
console.groupEnd();

console.group("With an undefined property");
rectangle.sides = undefined;
console.log("The object is", rectangle);
console.groupEnd();

console.group("With a readonly property");
Object.defineProperty(rectangle, "sides", {
  value: 4,
  configurable: true,
  enumerable: true,
  writable: false,
});
try {
  rectangle.sides = undefined;
} catch {
  console.error("The write operation failed");
}
console.log("The object is", rectangle);
console.groupEnd();

console.group("After deleting a property");
delete rectangle.sides;
console.log("The object is", rectangle);
console.groupEnd();

console.group("After adding the area");
Object.defineProperty(rectangle, "area", {
  get() {
    return this.length * this.width;
  },
  enumerable: true,
});

console.log("The area is", rectangle.area);
console.log("The object is", rectangle);
console.groupEnd();

console.group("With a tag name");
console.group("Reminder, before adding it");
console.log("The object is", rectangle);
console.log(`And stringifies to ${rectangle}`);
console.groupEnd();

console.group("and after");

Object.defineProperty(rectangle, Symbol.toStringTag, { value: "Rectangle" });

console.log("The object is", rectangle);
console.log(`And stringifies to ${rectangle}`);
console.groupEnd();
console.groupEnd();

console.group("With a custom stringification");
Object.defineProperty(rectangle, "toString", {
  value() {
    return `a rectangle of length ${this.length} and width ${this.width}`;
  },
});
console.log(`The object stringifies to ${rectangle}`);
console.log("Like with a call, it's", rectangle.toString());
console.groupEnd();

console.group("And for JSON");
console.log("The default is", JSON.stringify(rectangle));

console.log(
  "Which can be controlled from outside, as",
  JSON.stringify(rectangle, ["length", "width"])
);

Object.defineProperty(rectangle, "toJSON", {
  value() {
    return { length: this.length, width: this.width };
  },
});

console.log("Or with custom logic it's", JSON.stringify(rectangle));
console.groupEnd();

console.group("And with custom primitive conversion");

Object.defineProperty(rectangle, "valueOf", {
  value() {
    return this.area;
  },
  configurable: true,
});
console.log(rectangle);
console.log("Values can be created", rectangle * 2);
console.log("Regardless of if they make sense", rectangle + 4);

delete rectangle.valueOf;
Object.defineProperty(rectangle, Symbol.toPrimitive, {
  value(hint) {
    switch (hint) {
      case "string":
        return this.toString();
      case "number":
        return Number.NaN;
      default:
        return this;
    }
  },
});
console.log(rectangle);
console.log("Calling toString we get", rectangle.toString());
console.log("Like when converting to String we get", String(rectangle));
console.log("Values can be created", rectangle * -1);

console.groupEnd();

const square = Object.create(rectangle, {
  width: {
    get() {
      return this.length;
    },
    enumerable: true,
  },
  [Symbol.toStringTag]: { value: "Square" },
  toString: {
    value() {
      return `a square of length ${this.length}`;
    },
  },
});

console.group("With a derived square");
console.log(square);
console.log(String(square));
console.log("The area is", square.area);
console.log(JSON.stringify(square));

console.groupEnd();
