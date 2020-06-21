import { Ship } from './ship';

describe('A ship', () => {
  test('has an integer >= 1 as length', () => {
    expect(Ship(4)).toHaveProperty('length', 4);
    expect(Ship(3.9)).toHaveProperty('length', 3);
  });

  test('has a length 1 if not given a number >= 1', () => {
    expect(Ship()).toHaveProperty('length', 1);
    expect(Ship('hi')).toHaveProperty('length', 1);
  });

  test('has a damagedAt property', () => {
    expect(Ship(2)).toHaveProperty('damagedAt', [false, false]);
  });

  test('has hit() method to mark a position as hit', () => {
    const testShip = Ship(2);
    expect(testShip.hit(1)).toHaveProperty('damagedAt', [false, true]);
  });

  test('has isSunk() method', () => {
    let shipToSink = Ship(3);
    expect(shipToSink.isSunk()).toBe(false);
    shipToSink = shipToSink.hit(0).hit(1).hit(2);
    expect(shipToSink.isSunk()).toBe(true);
  });
});
