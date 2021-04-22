/**
 * Interface that declares the common operation to our classes
 */
interface Strategy {
  buy(price: number): number;
}

/**
 * Visa class to represent a buy with Visa
 */
export class Visa implements Strategy {
  private commission: number = 0.065;
  /**
   * Buy method that return the value of the object plus the commission
   * @param {number} price Price of the object we want to buy
   * @return {number} Final price of the object
   */
  buy(price: number): number {
    return price + price * this.commission;
  }
}

/**
 * MasterCard class to represent a buy with MasterCard
 */
export class MasterCard implements Strategy {
  private commission: number = 0.05;
  /**
   * Buy method that return the value of the object plus the commission
   * @param {number} price Price of the object we want to buy
   * @return {number} Final price of the object
   */
  buy(price: number): number {
    return price + price * this.commission;
  }
}

/**
 * PayPal class to represent a buy with PayPal
 */
export class PayPal implements Strategy {
  private commission: number = 0.03;
  /**
   * Buy method that return the value of the object plus the commission
   * @param {number} price Price of the object we want to buy
   * @return {number} Final price of the object
   */
  buy(price: number): number {
    return price + price * this.commission;
  }
}

/**
 * Class Context that defines the interface of interest to our customers
 */
export class Context {
  private strategy!: Strategy;

  /**
   * Set method to our Context class that defines the strategy
   * @param {Strategy} strategy Strategy that our customer decide to use
   */
  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }

  /**
   * Execute method that execute the common operation of our strategies
   * @param {number} a Initial price of the object we want to buy
   * @return {number} Final price of the object we want to buy (we add the commission)
   */
  executeStrategy(a: number): number {
    return this.strategy.buy(a);
  }
}

// MODO DE USO -- (STRATEGY PATTERN)

// const pay: Context = new Context();
// const price: number = 120;
// const type: string = 'Visa';

// if (type == 'Visa') {
//   pay.setStrategy(new Visa());
// }

// if (type == 'MasterCard') {
//   pay.setStrategy(new MasterCard());
// }

// if (type == 'PayPal') {
//   pay.setStrategy(new PayPal());
// }

// const result: number = pay.executeStrategy(price);
// console.log(result);
