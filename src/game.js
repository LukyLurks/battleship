import { Player, Computer } from './player';
import { GameBoard } from './gameboard';
import { Ship } from './ship';

function init(size, cpu) {
  let [board1, board2] = [GameBoard(size), GameBoard(size)];
  let player1 = Player(board1, board2);
  let player2 = cpu ? Computer(board2, board1) : Player(board2, board1);
  board1 = placeShips(board1);
  board2 = placeShips(board2);
  return [player1, player2];
}

function placeShips(board) {
  return board
    .placeShip(Ship(5), 0, 0, true)
    .placeShip(Ship(4), 1, 2, true)
    .placeShip(Ship(3), 2, 4, true)
    .placeShip(Ship(3), 3, 6, true)
    .placeShip(Ship(2), 4, 8, true);
}

const boardSize = 10;
const vsComputer = true;
const [player1, player2] = init(boardSize, vsComputer);
