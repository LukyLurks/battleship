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

  test('has a damagedAt property', () => {
    expect(factories.Ship(2)).toHaveProperty('damagedAt', [false, false]);
  });

  test('has hit() method to mark a position as hit', () => {
    const testShip = factories.Ship(2);
    expect(testShip.hit(1)).toHaveProperty('damagedAt', [false, true]);
  });

  test('has isSunk() method', () => {
    let shipToSink = factories.Ship(3);
    expect(shipToSink.isSunk()).toBe(false);
    shipToSink = shipToSink.hit(0);
    shipToSink = shipToSink.hit(1);
    shipToSink = shipToSink.hit(2);
    expect(shipToSink.isSunk()).toBe(true);
  });
});

describe('A GameBoard', () => {
  const boardBefore = factories.GameBoard(4);
  beforeEach(() => {
    boardBefore.reset();
  });
  const Cell = factories.Cell;
  const testShip = factories.Ship(2);
  const cell0 = { shipIndex: 0, hitIndex: 0, wasAttacked: false };
  const cell1 = { shipIndex: 0, hitIndex: 1, wasAttacked: false };
  const emptyBoard = [
    [Cell(), Cell(), Cell(), Cell()],
    [Cell(), Cell(), Cell(), Cell()],
    [Cell(), Cell(), Cell(), Cell()],
    [Cell(), Cell(), Cell(), Cell()],
  ];
  test('has cells that refer to ship positions', () => {
    expect(boardBefore).toHaveProperty('cells', emptyBoard);
  });

  test('can addShip() vertically', () => {
    const boardAfterVertical = [
      [Cell(), Cell(), Cell(), Cell()],
      [Cell(), Cell(), cell0, Cell()],
      [Cell(), Cell(), cell1, Cell()],
      [Cell(), Cell(), Cell(), Cell()],
    ];
    expect(boardBefore.addShip(testShip, 1, 2, true)).toHaveProperty(
      'cells',
      boardAfterVertical
    );
  });

  test('can addShip() horizontally', () => {
    const boardAfterHorizontal = [
      [Cell(), Cell(), Cell(), Cell()],
      [Cell(), Cell(), cell0, cell1],
      [Cell(), Cell(), Cell(), Cell()],
      [Cell(), Cell(), Cell(), Cell()],
    ];
    expect(boardBefore.addShip(testShip, 1, 2, false)).toHaveProperty(
      'cells',
      boardAfterHorizontal
    );
  });

  test("doesn't add a ship if too low", () => {
    expect(boardBefore.addShip(testShip, 3, 0, true)).toHaveProperty(
      'cells',
      emptyBoard
    );
  });

  test("doesn't add a ship if too far right", () => {
    expect(boardBefore.addShip(testShip, 0, 3, false)).toHaveProperty(
      'cells',
      emptyBoard
    );
  });

  test("doesn't add a ship overlapping an existing one", () => {
    const otherShip = factories.Ship(3);
    const withOverlap = boardBefore
      .addShip(testShip, 0, 0, true)
      .addShip(otherShip, 1, 0, false);
    // We expect to get the ship we placed first,
    // not the 2nd one to overlap it
    expect(withOverlap.ships[0]).not.toEqual(otherShip);
  });

  test("Doesn't add the same ship twice", () => {
    const attemptedDuplicate = boardBefore
      .addShip(testShip, 0, 0, true)
      .addShip(testShip, 1, 1, true);
    expect(attemptedDuplicate.ships[1]).toBeUndefined();
  });

  test('calls Ship.hit() if receiveAttack() on one', () => {
    const attacked = boardBefore.addShip(testShip, 0, 0, false);
    expect(attacked.receiveAttack(0, 0).ships[0]).toEqual(testShip.hit(0));
  });

  test('Tells if all the ships have sunk', () => {
    const shipwreck = boardBefore
      .addShip(testShip, 0, 0, true)
      .receiveAttack(0, 0)
      .receiveAttack(1, 0);
    expect(shipwreck.isAllSunk()).toBe(true);
  });
});
