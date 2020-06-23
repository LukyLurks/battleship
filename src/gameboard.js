const GameBoard = function (size) {
  const fields = {
    size,
    placedShips: [],
    attackedAt: [],
  };

  return Object.assign(Object.create(GameBoardProto), fields);
};

const GameBoardProto = {
  duplicate: function () {
    const fields = {
      size: this.size,
      placedShips: Array.from(this.placedShips),
      attackedAt: Array.from(this.attackedAt),
    };
    return Object.assign(Object.create(GameBoardProto), fields);
  },
  canAddShip: function (newShip, row, col, vertical) {
    const tooLow = vertical && row + newShip.length > this.size;
    const tooFarRight = !vertical && col + newShip.length > this.size;
    const outOfBounds = tooLow || tooFarRight;
    if (outOfBounds) return false;

    const isClone = this.placedShips.some(({ ship }) => newShip === ship);
    if (isClone) return false;

    const newShipCoordinates = getAddShipCoordinates(...arguments);
    const overlaps = newShipCoordinates.some(([xNew, yNew]) =>
      this.placedShips.some(({ coordinates }) =>
        coordinates.some(
          ([xOccupied, yOccupied]) => xOccupied === xNew && yOccupied === yNew
        )
      )
    );
    if (overlaps) return false;

    return true;
  },
  addShip: function (ship, ...positioning) {
    if (!this.canAddShip(...arguments)) {
      console.warn('Cannot place ship here');
      return this;
    }
    const board = this.duplicate();
    board.placedShips.push({
      ship,
      coordinates: getAddShipCoordinates(...arguments),
    });
    return board;
  },
  wasAttackedAt: function (x, y) {
    return this.attackedAt.some(
      ([xAttacked, yAttacked]) => x === xAttacked && y === yAttacked
    );
  },
  receiveAttack: function (xTarget, yTarget) {
    if (this.wasAttackedAt(xTarget, yTarget)) {
      console.warn('This cell was already attacked');
      return this;
    }

    const board = this.duplicate();
    const targetShip = board.placedShips.find(({ coordinates }) =>
      coordinates.find(([x, y]) => x === xTarget && y === yTarget)
    );
    if (targetShip !== undefined) {
      targetShip.ship = targetShip.ship.hit(
        targetShip.coordinates.findIndex(
          ([x, y]) => x === xTarget && y === yTarget
        )
      );
    }
    board.attackedAt.push([xTarget, yTarget]);
    return board;
  },
  isAllSunk: function () {
    return this.placedShips.every(({ ship }) => ship.isSunk());
  },
};

function getAddShipCoordinates(ship, row, col, vertical) {
  const coordinates = [];
  for (let i = 0; i < ship.length; i++) {
    if (vertical) coordinates.push([row + i, col]);
    else coordinates.push([row, col + i]);
  }
  return coordinates;
}

export { GameBoard };
