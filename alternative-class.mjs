class BritishPerson {
  #age;
  #firstName;
  #middleName;
  #lastName;

  constructor(firstName, middleName = null, lastName, age, hasPassport) {
    this.#firstName = firstName;
    this.#middleName = middleName;
    this.#lastName = lastName;
    this.#age = age;
    this.hasPassport = hasPassport;
  }

  get [Symbol.toStringTag]() {
    return "BritishPerson";
  }

  get name() {
    if (this.#middleName === null) {
      return this.#firstName + " " + this.#lastName;
    } else {
      return [this.#firstName, this.#middleName, this.#lastName].join(" ");
    }
  }

  get age() {
    return this.#age;
  }

  get canBuyLotteryTickets() {
    return this.#age >= 16;
  }

  get canBuyBeerTickets() {
    return this.#age >= 18;
  }

  toString() {
    return `${this.name}, aged ${this.age}`;
  }

  toJSON() {
    return {
      name: this.name,
      age: this.age,
      hasPassport: this.hasPassport,
    };
  }
}

const me = new BritishPerson("Daniel", "Arthur", "Gallagher", 30, true);
console.log(me);
console.log(me.toString());
console.log(JSON.stringify(me));
