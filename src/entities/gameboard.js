import utils from "../utils";

const GameBoard = function (size) {
  if (!utils.isValidSize(size)) {
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

  addShip: function (ship, ...positioning) {
    if (!utils.canAddShip(this, ...arguments)) return this;

    const board = this.deepClone();
    board.placedShips.push({
      ship,
      coordinates: utils.getNewShipCoordinates(...arguments),
    });
    return board;
  },

  removeShip: function (name) {
    const board = this.deepClone();
    board.placedShips = board.placedShips.filter(
      ({ ship }) => ship.name !== name
    );
    return board;
  },

  receiveAttack: function (...coordinates) {
    if (!utils.canReceiveAttack(this, ...coordinates)) return this;

    const targetShip = utils.findTargetShip(this, ...coordinates);
    if (targetShip !== undefined) {
      targetShip.ship = utils.hitPosition(targetShip, ...coordinates);
    }

    return this.recordAttack(coordinates);
  },

  recordAttack: function (coordinates) {
    const board = this.deepClone();
    board.attackedAt.push(coordinates);
    return board;
  },

  isAllSunk: function () {
    return this.placedShips.every(({ ship }) => ship.isSunk());
  },
};

export { GameBoard };
