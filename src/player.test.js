import { Computer } from './player';
import { GameBoard } from './gameboard';

describe('The computer', () => {
  const [testOwnBoard, testEnemyBoard] = [GameBoard(2), GameBoard(2)];
  const testComputer = Computer(testOwnBoard, testEnemyBoard);

  test('always finds a legal move to perform', () => {
    const attackingAll = testComputer
      .attackRandom()
      .attackRandom()
      .attackRandom()
      .attackRandom();
    expect(attackingAll.enemyBoard.attackedAt).toHaveLength(4);
  });
});
