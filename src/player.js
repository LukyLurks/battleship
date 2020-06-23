const Player = function (ownBoard, enemyBoard) {
  const fields = {
    ownBoard,
    enemyBoard,
  };
  return Object.assign(Object.create(PlayerProto), fields);
};

const PlayerProto = {
  attack: function () {
    let coordinates = null;
    while (!isAttackValid((coordinates = getAttackCoordinates())));
    return this.enemyBoard.receiveAttack(coordinates);
  },
};

function isAttackValid(x, y) {
  const { size, attackedAt } = this.enemyBoard;
  if (x < 0 || y < 0 || x >= size || y >= size) return false;

  const alreadyAttacked = attackedAt.some(
    ([xShot, yShot]) => x === xShot && y === yShot
  );
  if (alreadyAttacked) return false;

  return true;
}

function getAttackCoordinates() {
  let [x, y] = [null, null];
  x = Number(prompt('enter row number', 0));
  y = Number(prompt('enter column number', 0));
  return [x, y];
}

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
