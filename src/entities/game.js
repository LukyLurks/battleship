import { Player, Computer } from "./player";
import { Ship } from "./ship";
import { GameBoard } from "./gameboard";

const boardSize = 10;

const makePlayerShips = function () {
  return {
    patrolBoat: Ship(2, "patrolBoat"),
    submarine: Ship(3, "submarine"),
    destroyer: Ship(3, "destroyer"),
    battleship: Ship(4, "battleship"),
    carrier: Ship(5, "carrier"),
  };
};

const startGame = function () {
  const playerBoard = GameBoard(boardSize);
  const cpuBoard = GameBoard(boardSize);
  const cpuShips = Object.values(makePlayerShips());

  const player = Player(playerBoard, cpuBoard, "Player");
  const cpu = Computer(cpuBoard, playerBoard, "CPU");
  cpuShips.forEach((ship) => {
    cpu.ownBoard = cpu.addShipRandom(ship);
  });
  return { player, cpu, playerShips: makePlayerShips() };
};

const startEmptyGame = function () {
  const player = Player(GameBoard(boardSize), GameBoard(boardSize), "");
  const cpu = Player(GameBoard(boardSize), GameBoard(boardSize), "");
  return { player, cpu };
};

export { startGame, startEmptyGame };
