import helpers from '../utils/helpers';

const Player = function (ownBoard, enemyBoard) {
  const fields = {
    ownBoard,
    enemyBoard,
  };
  return Object.assign(Object.create(PlayerProto), fields);
};

const PlayerProto = {
  attack: function (x, y) {
    this.enemyBoard.receiveAttack(x, y);
    return this;
  },
};

function Computer(ownBoard, enemyBoard) {
  return Object.assign(
    Object.create(ComputerProto),
    Player(ownBoard, enemyBoard)
  );
}

const ComputerProto = {
  attackRandom: function () {
    const coordinates = helpers.findPointToAttack(this.enemyBoard);
    this.enemyBoard = this.enemyBoard.receiveAttack(...coordinates);
    return this;
  },
};

export { Player, Computer };
