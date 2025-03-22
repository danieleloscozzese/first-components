class BritishPerson {
  #age;
  #firstName;
  #middleName;
  #lastName;

  /** @type {boolean | undefined} */
  hasPassport;

  constructor(firstName, middleName = null, lastName, age, hasPassport) {
    this.#firstName = firstName;
    this.#middleName = middleName;
    this.#lastName = lastName;
    this.#age = age;
    this.hasPassport = hasPassport;
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
}

const me = new BritishPerson("Daniel", "Arthur", "Gallagher", 30, true);
setTimeout(() => {
  me.hasPassport = false;
}, 1_814_400_000);
