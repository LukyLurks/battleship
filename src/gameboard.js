const GameBoard = function (size) {
  if (!isValidSize(size)) {
    console.warn(`GameBoard() size "${size}" invalid`);
    return null;
  }
  const fields = {
    size: Math.floor(size),
    placedShips: [],
    attackedAt: [],
  };

  return Object.assign(Object.create(GameBoardProto), fields);
};

const GameBoardProto = {
  deepClone: function () {
    const fields = {
      size: this.size,
      placedShips: Array.from(this.placedShips),
      attackedAt: Array.from(this.attackedAt),
    };
    return Object.assign(Object.create(GameBoardProto), fields);
  },
  isValidPoint: function (...point) {
    return point.every(
      (coordinate) =>
        typeof coordinate === 'number' &&
        coordinate >= 0 &&
        coordinate < this.size
    );
  },
  canAddShip: function (newShip, row, col, vertical) {
    if (vertical !== true && vertical !== false) {
      console.warn(`canAddShip() invalid vertical argument "${vertical}"`);
      return false;
    }

    if (!this.isValidPoint(row, col)) {
      console.warn(
        `canAddShip() invalid coordinates [${row}, ${col}] (types [${typeof row}, ${typeof col}])`
      );
      return false;
    }

    const tooLow = vertical && row + newShip.length > this.size;
    const tooFarRight = !vertical && col + newShip.length > this.size;
    const outOfBounds = tooLow || tooFarRight;
    if (outOfBounds) {
      console.warn(`canAddShip() out of bounds with [${row}, ${col}]`);
      return false;
    }

    const isClone = this.placedShips.some(({ ship }) => newShip === ship);
    if (isClone) {
      console.warn(`canAddShip() ship already exists`);
      return false;
    }

    const newShipCoordinates = getAddShipCoordinates(...arguments);
    const overlaps = newShipCoordinates.some((newPoint) =>
      this.placedShips.some(({ coordinates }) =>
        coordinates.some((point) => isSamePoint(point, newPoint))
      )
    );
    if (overlaps) {
      console.warn(`canAddShip() overlaps with existing ship`);
      return false;
    }

    return true;
  },
  addShip: function (ship, ...positioning) {
    if (!this.canAddShip(...arguments)) return this;

    const board = this.deepClone();
    board.placedShips.push({
      ship,
      coordinates: getAddShipCoordinates(...arguments),
    });
    return board;
  },
  wasAttackedAt: function (...point) {
    return this.attackedAt.some((attacked) => isSamePoint(attacked, point));
  },
  canReceiveAttack: function (x, y) {
    if (this.wasAttackedAt(x, y)) {
      console.warn(`canReceiveAttack() already attacked`);
      return false;
    }

    if (!this.isValidPoint(x, y)) {
      console.warn(
        `canReceiveAttack() invalid coordinates [${x}, ${y}] (types [${typeof x}, ${typeof y}])`
      );
      return false;
    }

    return true;
  },
  receiveAttack: function (...target) {
    if (!this.canReceiveAttack(...target)) return this;

    const board = this.deepClone();
    const targetShip = board.placedShips.find(({ coordinates }) =>
      coordinates.find((point) => isSamePoint(point, target))
    );

    if (targetShip !== undefined) {
      targetShip.ship = targetShip.ship.hit(
        targetShip.coordinates.findIndex((point) => isSamePoint(point, target))
      );
    }
    board.attackedAt.push(target);
    return board;
  },
  isAllSunk: function () {
    return this.placedShips.every(({ ship }) => ship.isSunk());
  },
};

function getAddShipCoordinates(ship, row, col, vertical) {
  const [normalRow, normalCol] = [Math.floor(row), Math.floor(col)];
  const coordinates = [];
  for (let i = 0; i < ship.length; i++) {
    if (vertical) coordinates.push([normalRow + i, normalCol]);
    else coordinates.push([normalRow, normalCol + i]);
  }
  return coordinates;
}

function isValidSize(size) {
  return typeof size === 'number' && size >= 1;
}

function isSamePoint(a, b) {
  const [xa, ya] = a;
  const [xb, yb] = b;
  return xa === xb && ya === yb;
}
export { GameBoard };
