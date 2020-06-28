import checks from './checks';

function getNewShipCoordinates(ship, x0, y0, vertical) {
  const [x, y] = [Math.floor(x0), Math.floor(y0)];
  const coordinates = [];
  for (let i = 0; i < ship.size; i++) {
    if (vertical) coordinates.push([x + i, y]);
    else coordinates.push([x, y + i]);
  }
  return coordinates;
}

function findTargetShip(board, ...targetPosition) {
  return board.placedShips.find(({ coordinates }) =>
    coordinates.find((point) => checks.isSamePoint(point, targetPosition))
  );
}

function hitPosition(placedShip, ...targetPoint) {
  const positionToHit = placedShip.coordinates.findIndex((point) =>
    checks.isSamePoint(point, targetPoint)
  );
  return placedShip.ship.hit(positionToHit);
}

function findPointToAttack(board) {
  const attackable = [];
  for (let i = 0; i < board.size; i++) {
    for (let j = 0; j < board.size; j++) {
      if (!checks.wasAttackedAt(board, i, j)) {
        attackable.push([i, j]);
      }
    }
  }

  return attackable[getRandomNaturalInt(attackable.length)];
}

function getRandomNaturalInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const module = {
  getNewShipCoordinates,
  findTargetShip,
  hitPosition,
  findPointToAttack,
};

export default module;
