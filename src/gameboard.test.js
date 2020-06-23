import { GameBoard } from './gameboard';
import { Ship } from './ship';

describe('A GameBoard', () => {
  const testBoard = GameBoard(4);
  const testShip = Ship(2);

  test('has a size', () => {
    expect(testBoard).toHaveProperty('size', 4);
  });

  test('can addShip() vertically', () => {
    const boardVerticalShip = testBoard.addShip(testShip, 0, 0, true);
    const verticalShip = {
      ship: testShip,
      coordinates: [
        [0, 0],
        [1, 0],
      ],
    };
    expect(boardVerticalShip.placedShips).toContainEqual(verticalShip);
  });

  test('can addShip() horizontally', () => {
    const boardHorizontalShip = testBoard.addShip(testShip, 0, 0, false);
    const horizontalShip = {
      ship: testShip,
      coordinates: [
        [0, 0],
        [0, 1],
      ],
    };
    expect(boardHorizontalShip.placedShips).toContainEqual(horizontalShip);
  });

  test("doesn't add a ship if too low", () => {
    const boardRefusingOOB = testBoard.addShip(testShip, 3, 0, true);
    const outOfLowerBounds = {
      ship: testShip,
      coordinates: [
        [3, 0],
        [4, 0],
      ],
    };
    expect(boardRefusingOOB.placedShips).not.toContainEqual(outOfLowerBounds);
  });

  test("doesn't add a ship if too far right", () => {
    const boardRefusingOOB = testBoard.addShip(testShip, 0, 3, false);
    const outOfRightBounds = {
      ship: testShip,
      coordinates: [
        [0, 3],
        [0, 4],
      ],
    };
    expect(boardRefusingOOB.placedShips).not.toContainEqual(outOfRightBounds);
  });

  test("doesn't add a ship overlapping an existing one", () => {
    const otherShip = Ship(2);
    const boardRefusingOverlap = testBoard
      .addShip(testShip, 0, 0, false)
      .addShip(otherShip, 0, 0, true);
    const overlappingShip = {
      ship: otherShip,
      coordinates: [
        [0, 0],
        [1, 0],
      ],
    };
    expect(boardRefusingOverlap.placedShips).not.toContainEqual(
      overlappingShip
    );
  });

  test("Doesn't add the same ship twice", () => {
    const boardRefusingDupe = testBoard
      .addShip(testShip, 0, 0, true)
      .addShip(testShip, 2, 2, true);
    const duplicateShip = {
      ship: testShip,
      coordinates: [
        [2, 2],
        [3, 2],
      ],
    };
    expect(boardRefusingDupe.placedShips).not.toContainEqual(duplicateShip);
  });

  test('calls Ship.hit() if receiveAttack() on one', () => {
    const boardAttackedShip = testBoard
      .addShip(testShip, 0, 0, true)
      .receiveAttack(0, 0);
    const attackedShip = {
      ship: testShip.hit(0),
      coordinates: [
        [0, 0],
        [1, 0],
      ],
    };
    expect(boardAttackedShip.placedShips).toContainEqual(attackedShip);
  });

  test('keeps track of all attacks received', () => {
    const boardHitOnce = testBoard.receiveAttack(2, 3);
    const attackedCoordinates = [2, 3];
    expect(boardHitOnce.attackedAt).toContainEqual(attackedCoordinates);
  });

  test("doesn't attack a previously attacked spot", () => {
    const boardAfterFirstAttack = testBoard.receiveAttack(0, 0);
    const boardRefusingSameAttack = testBoard
      .receiveAttack(0, 0)
      .receiveAttack(0, 0);
    expect(boardRefusingSameAttack).toEqual(boardAfterFirstAttack);
  });

  test('Tells if all the placedShips have sunk', () => {
    const boardSunkAllShips = testBoard
      .addShip(testShip, 0, 0, true)
      .receiveAttack(0, 0)
      .receiveAttack(1, 0);
    expect(boardSunkAllShips.isAllSunk()).toBe(true);
  });
});
