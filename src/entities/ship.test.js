import { Ship } from './ship';

describe('Ship factory and methods', () => {
  const testShip = Ship(2);

  describe('Ship()', () => {
    describe('Happy path', () => {
      test('takes an integer >= 1 as size', () => {
        expect(Ship(2)).toHaveProperty('size', 2);
      });
    });

    describe('Unhappy path', () => {
      test('floors decimal sizes >= 1', () => {
        expect(Ship(3.9)).toHaveProperty('size', 3);
      });

      test('returns null otherwise', () => {
        expect(Ship(-2)).toBeNull();
        expect(Ship()).toBeNull();
        expect(Ship('hi')).toBeNull();
      });
    });
  });

  describe('hit()', () => {
    describe('Happy path', () => {
      test('sets the right damagedAt index to true', () => {
        const hitShip = testShip.hit(1);
        expect(hitShip.damagedAt).toEqual([false, true]);
      });
    });
    describe('Unhappy path', () => {
      test('floors decimal values', () => {
        const hitAtDecimal = testShip.hit(0.4);
        expect(hitAtDecimal.damagedAt).toEqual([true, false]);
      });
      test("doesn't change anything with otherwise invalid index", () => {
        const hitNegativeIndex = testShip.hit(-2);
        const hitNowhere = testShip.hit();
        const hitStrings = testShip.hit('hi');
        const hitOutOfRange = testShip.hit(42);
        const expected = [false, false];
        expect(hitNegativeIndex.damagedAt).toEqual(expected);
        expect(hitNowhere.damagedAt).toEqual(expected);
        expect(hitStrings.damagedAt).toEqual(expected);
        expect(hitOutOfRange.damagedAt).toEqual(expected);
      });
    });
  });

  describe('isSunk()', () => {
    test("returns false if the ship isn't hit everywhere", () => {
      expect(testShip.isSunk()).toBe(false);
    });

    test('returns true if the ship is hit everywhere', () => {
      let sunkShip = testShip.hit(0).hit(1);
      expect(sunkShip.isSunk()).toBe(true);
    });
  });
});
