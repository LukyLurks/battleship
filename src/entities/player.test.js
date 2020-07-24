import { Computer } from "./player";
import { GameBoard } from "./gameboard";
import utils from "../utils";

describe("Computer.attackRandom()", () => {
  let [testOwnBoard, testEnemyBoard] = [GameBoard(8), GameBoard(8)];
  const testComputer = Computer(testOwnBoard, testEnemyBoard);

  test("always finds a legal move to perform", () => {
    const attacks = [];
    for (let i = 0; i < 8 * 8; i++) {
      const coord = testComputer.attackRandom();
      testComputer.enemyBoard = testEnemyBoard.receiveAttack(...coord);
      if (!attacks.some((a) => utils.isSamePoint(a, coord))) {
        attacks.push(coord);
      }
    }
    expect(attacks).toHaveLength(64);
  });
});
