const Player = function (ownBoard, enemyBoard) {
  const fields = {
    ownBoard,
    enemyBoard,
  };
  return Object.assign(Object.create(PlayerProto), fields);
};

const PlayerProto = {
  attack: function (x, y) {
    return this.enemyBoard.receiveAttack(x, y);
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
    const coordinates = getRandomValidCoordinates(this.enemyBoard);
    this.enemyBoard = this.enemyBoard.receiveAttack(...coordinates);
    return this;
  },
};

function getRandomValidCoordinates(board) {
  // Checks all possible moves
  const attackable = [];
  for (let i = 0; i < board.size; i++) {
    for (let j = 0; j < board.size; j++) {
      if (!board.wasAttackedAt(i, j)) {
        attackable.push([i, j]);
      }
    }
  }
  // Picks a random move among the possible ones
  return attackable[getRandomNaturalInt(attackable.length)];
}

function getRandomNaturalInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export { Player, Computer };
