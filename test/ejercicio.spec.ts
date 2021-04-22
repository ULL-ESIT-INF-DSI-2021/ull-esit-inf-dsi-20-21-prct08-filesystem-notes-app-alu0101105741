import 'mocha';
import {expect} from 'chai';

import {Visa, MasterCard, PayPal, Context} from '../src/ejercicio/ejercicio';

describe('Test block on exercise (Strategy Pattern)', () => {
  const pay1: Context = new Context();
  const pay2: Context = new Context();
  const pay3: Context = new Context();
  const price: number = 120;
  const type1: string = 'Visa';
  const type2: string = 'MasterCard';
  const type3: string = 'PayPal';

  // Normally we check in every type all the posibilities but we just
  // compare the ones we know they gonna be to save time
  if (type1 == 'Visa') {
    pay1.setStrategy(new Visa());
  }

  if (type2 == 'MasterCard') {
    pay2.setStrategy(new MasterCard());
  }

  if (type3 == 'PayPal') {
    pay3.setStrategy(new PayPal());
  }

  it('Buy method with Visa', () => {
    expect(pay1.executeStrategy(price)).to.be.equal(127.8);
  });

  it('Buy method with MasterCard', () => {
    expect(pay2.executeStrategy(price)).to.be.equal(126);
  });

  it('Buy method with PayPal', () => {
    expect(pay3.executeStrategy(price)).to.be.equal(123.6);
  });
});
