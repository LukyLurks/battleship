import utils from "../utils";

const Player = function (ownBoard, enemyBoard, name) {
  const fields = {
    ownBoard,
    enemyBoard,
    name,
  };
  return Object.assign(Object.create(PlayerProto), fields);
};

const PlayerProto = {
  attack: function (x, y) {
    this.enemyBoard.receiveAttack(x, y);
    return this;
  },
};

function Computer(ownBoard, enemyBoard, name) {
  return Object.assign(
    Object.create(ComputerProto),
    Player(ownBoard, enemyBoard, name)
  );
}

const ComputerProto = {
  attackRandom: function () {
    return utils.findPointToAttack(this.enemyBoard);
  },

  addShipRandom: function (ship) {
    const positioning = utils.findSpotForShip(ship, this.ownBoard);
    return this.ownBoard.addShip(ship, ...positioning);
  },
};

export { Player, Computer };
