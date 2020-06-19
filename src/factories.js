function normalizeLength(length) {
  if (typeof length === 'number' && length >= 1) {
    return Math.floor(length);
  }
  console.warn(`Normalizing ship length "${length}" to 1.`);
  return 1;
}

const ShipProto = {
  hit: function (position) {
    const damagedShip = copyShip(this);
    damagedShip.damagedAt[position] = true;
    return damagedShip;
  },
  isSunk: function () {
    return this.damagedAt.every((position) => position === true);
  },
};

const Ship = function (length) {
  const validLength = normalizeLength(length);
  const fields = {
    length: validLength,
    damagedAt: Array(validLength).fill(false),
  };
  return Object.assign(Object.create(ShipProto), fields);
};

const copyShip = function (ship) {
  const fields = {
    length: ship.length,
    damagedAt: Array.from(ship.damagedAt),
  };
  return Object.assign(Object.create(ShipProto), fields);
};

const Cell = function () {
  return {
    shipIndex: null,
    hitIndex: null,
    wasAttacked: false,
  };
};

const copyCell = function (cell) {
  return {
    shipIndex: cell.shipIndex,
    hitIndex: cell.hitIndex,
    wasAttacked: cell.wasAttacked,
  };
};

function canAddShip(board, ship, row, col, vertical) {
  const tooLow = vertical && row + ship.length > board.size;
  const tooFarRight = !vertical && col + ship.length > board.size;
  const outOfBounds = tooLow || tooFarRight;
  if (outOfBounds) return false;

  const alreadyExists = board.cells.some((row) =>
    row.some((cell) => board.ships[cell.shipIndex] === ship)
  );
  if (alreadyExists) return false;

  const coordinates = getAddShipCoordinates(...[...arguments].slice(1));
  const overlaps = coordinates.some(
    ([x, y]) => board.cells[x][y].shipIndex !== null
  );
  if (overlaps) return false;

  return true;
}

function getAddShipCoordinates(ship, row, col, vertical) {
  const coordinates = [];
  for (let i = 0; i < ship.length; i++) {
    if (vertical) coordinates.push([row + i, col]);
    else coordinates.push([row, col + i]);
  }
  return coordinates;
}

const GameBoardProto = {
  reset: function () {
    this.cells = GameBoard(this.size).cells;
  },
  addShip: function (ship, ...positioning) {
    if (!canAddShip(this, ...arguments)) {
      console.warn('Cannot place ship here');
      return this;
    }
    const newBoard = copyGameBoard(this);
    newBoard.ships.push(ship);
    getAddShipCoordinates(...arguments).forEach(
      ([x, y], i) =>
        (newBoard.cells[x][y] = Object.assign(newBoard.cells[x][y], {
          shipIndex: newBoard.ships.indexOf(ship),
          hitIndex: i,
        }))
    );
    return newBoard;
  },
  receiveAttack: function (row, col) {
    if (this.cells[row][col].wasAttacked) {
      console.warn('This cell was already attacked');
      return this;
    }

    const newBoard = copyGameBoard(this);
    const targetCell = newBoard.cells[row][col];
    targetCell.wasAttacked = true;
    let targetShip = newBoard.ships[targetCell.shipIndex];
    if (targetCell.shipIndex !== null) {
      newBoard.ships[targetCell.shipIndex] = targetShip.hit(
        targetCell.hitIndex
      );
      return newBoard;
    }
  },
  isAllSunk: function () {
    return this.ships.every((ship) => ship.isSunk());
  },
};

const GameBoard = function (size) {
  const cells = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(Cell());
    }
    cells.push(row);
  }

  const fields = {
    size,
    cells,
    ships: [],
  };

  return Object.assign(Object.create(GameBoardProto), fields);
};

const copyGameBoard = function (board) {
  const rows = board.cells;
  const newCells = rows.map((row) => row.map((cell) => copyCell(cell)));
  const fields = {
    size: board.size,
    cells: newCells,
    ships: Array.from(board.ships),
  };
  return Object.assign(Object.create(GameBoardProto), fields);
};

const module = {
  Ship,
  GameBoard,
  Cell,
};

export default module;
