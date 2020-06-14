import factories from './factories';

describe('A ship', () => {
  test('has an integer >= 1 as length', () => {
    expect(factories.Ship(4)).toHaveProperty('length', 4);
    expect(factories.Ship(3.9)).toHaveProperty('length', 3);
  });

  test('has a length 1 if not given a number >= 1', () => {
    expect(factories.Ship()).toHaveProperty('length', 1);
    expect(factories.Ship('hi')).toHaveProperty('length', 1);
  });

  test('has a gotHitAt property', () => {
    expect(factories.Ship(2)).toHaveProperty('gotHitAt', [false, false]);
  });

  test('has hit() method to mark a position as hit', () => {
    const testShip = factories.Ship(2);
    testShip.hit(1);
    expect(testShip).toHaveProperty('gotHitAt', [false, true]);
  });

  test('has isSunk() method', () => {
    const shipToSink = factories.Ship(3);
    expect(shipToSink.isSunk()).toBe(false);
    shipToSink.hit(0);
    shipToSink.hit(1);
    shipToSink.hit(2);
    expect(shipToSink.isSunk()).toBe(true);
  });
});
