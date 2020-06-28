import checks from '../utils/checks';
import helpers from '../utils/helpers';

const GameBoard = function (size) {
  if (!checks.isValidSize(size)) {
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
    if (!checks.canAddShip(this, ...arguments)) return this;

    const board = this.deepClone();
    board.placedShips.push({
      ship,
      coordinates: helpers.getNewShipCoordinates(...arguments),
    });
    return board;
  },

  receiveAttack: function (...coordinates) {
    if (!checks.canReceiveAttack(this, ...coordinates)) return this;

    const targetShip = helpers.findTargetShip(this, ...coordinates);
    if (targetShip !== undefined) {
      targetShip.ship = helpers.hitPosition(targetShip, ...coordinates);
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
