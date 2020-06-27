import { GameBoard } from './gameboard';
import { Ship } from './ship';

describe('GameBoard factory and methods', () => {
  const testBoard = GameBoard(4);
  const testShip = Ship(2);

  describe('GameBoard()', () => {
    describe('Happy path', () => {
      test('takes an integer >= 1 as size', () => {
        expect(GameBoard(4)).toHaveProperty('size', 4);
      });
    });
    describe('Unhappy path', () => {
      test('floors decimal sizes >= 1', () => {
        expect(GameBoard(3.4)).toHaveProperty('size', 3);
      });
      test('returns null otherwise', () => {
        expect(GameBoard(-2)).toBeNull();
        expect(GameBoard()).toBeNull();
        expect(GameBoard('hello')).toBeNull();
      });
    });
  });

  describe('addShip()', () => {
    describe('Happy path', () => {
      test('adds vertically if last argument is true', () => {
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

      test('adds horizontally if last argument is false', () => {
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
    });

    describe('Unhappy path', () => {
      test("doesn't add without explicit last argument", () => {
        const boardUnspecifiedShip = testBoard.addShip(testShip, 0, 0);
        expect(boardUnspecifiedShip.placedShips).toEqual([]);
      });

      test("doesn't add if too low", () => {
        const boardRefusingOOB = testBoard.addShip(testShip, 3, 0, true);
        expect(boardRefusingOOB.placedShips).toEqual([]);
      });

      test("doesn't add if too far right", () => {
        const boardRefusingOOB = testBoard.addShip(testShip, 0, 3, false);
        expect(boardRefusingOOB.placedShips).toEqual([]);
      });

      test("doesn't add if it results in overlapping ships", () => {
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

      test("doesn't add the same ship twice", () => {
        const boardRefusingDupe = testBoard
          .addShip(testShip, 0, 0, true)
          .addShip(testShip, 2, 2, true);
        const deepCloneShip = {
          ship: testShip,
          coordinates: [
            [2, 2],
            [3, 2],
          ],
        };
        expect(boardRefusingDupe.placedShips).not.toContainEqual(deepCloneShip);
      });

      test('floors decimal coordinates if it fits', () => {
        const boardWithDecimals = testBoard.addShip(testShip, 0.4, 1.7, true);
        const flooredShip = {
          ship: testShip,
          coordinates: [
            [0, 1],
            [1, 1],
          ],
        };
        expect(boardWithDecimals.placedShips).toContainEqual(flooredShip);
      });

      test("doesn't add otherwise", () => {
        const boardInvalidPositionings = testBoard
          .addShip(testShip, -1, 0, false)
          .addShip(testShip, '1', 0, true)
          .addShip(testShip, 2, 0, 1);
        expect(boardInvalidPositionings.placedShips).toEqual([]);
      });
    });
  });

  describe('receiveAttack()', () => {
    describe('Happy path', () => {
      test('calls Ship.hit() if received on a ship', () => {
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

      test('records all attacks received', () => {
        const boardHitOnce = testBoard.receiveAttack(2, 3);
        const attackedCoordinates = [2, 3];
        expect(boardHitOnce.attackedAt).toContainEqual(attackedCoordinates);
      });
    });

    describe('Unhappy path', () => {
      test("doesn't attack a previously attacked spot", () => {
        const boardAfterFirstAttack = testBoard.receiveAttack(0, 0);
        const boardRefusingSameAttack = testBoard
          .receiveAttack(0, 0)
          .receiveAttack(0, 0);
        expect(boardRefusingSameAttack).toEqual(boardAfterFirstAttack);
      });

      test('ignores invalid coordinates', () => {
        const boardInvalidAttacks = testBoard
          .receiveAttack(-1, 0)
          .receiveAttack()
          .receiveAttack('there')
          .receiveAttack(99, 99);
        expect(boardInvalidAttacks.attackedAt).toEqual([]);
      });
    });
  });

  describe('isAllSunk()', () => {
    test("returns false if at least one ship hasn't sank", () => {
      const boardWithAliveShip = testBoard.addShip(testShip, 0, 0, true);
      expect(boardWithAliveShip.isAllSunk()).toBe(false);
    });

    test('returns true if all ships on the board sank', () => {
      const boardSunkAllShips = testBoard
        .addShip(testShip, 0, 0, true)
        .receiveAttack(0, 0)
        .receiveAttack(1, 0);
      expect(boardSunkAllShips.isAllSunk()).toBe(true);
    });
  });
});
