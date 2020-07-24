function getNewShipCoordinates(ship, x0, y0, vertical) {
  // I need my function to work with just the size and it's
  // simpler to do that than change all my function calls
  // throughout the project
  const size = typeof ship === "object" ? ship.size : ship;
  const [x, y] = [Math.floor(x0), Math.floor(y0)];
  const coordinates = [];
  for (let i = 0; i < size; i++) {
    if (vertical) coordinates.push([x + i, y]);
    else coordinates.push([x, y + i]);
  }
  return coordinates;
}

function findTargetShip(board, ...targetPosition) {
  return board.placedShips.find(({ coordinates }) =>
    coordinates.find((point) => isSamePoint(point, targetPosition))
  );
}

function hitPosition(placedShip, ...targetPoint) {
  const positionToHit = placedShip.coordinates.findIndex((point) =>
    isSamePoint(point, targetPoint)
  );
  return placedShip.ship.hit(positionToHit);
}

function findPointToAttack(board) {
  const attackable = [];
  for (let i = 0; i < board.size; i++) {
    for (let j = 0; j < board.size; j++) {
      if (!wasAttackedAt(board, i, j)) {
        attackable.push([i, j]);
      }
    }
  }

  return attackable[getRandomNaturalInt(attackable.length)];
}

function getRandomNaturalInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function isValidSize(size) {
  return typeof size === "number" && size >= 1;
}

function isValidPoint(board, ...point) {
  return point.every(
    (coordinate) =>
      typeof coordinate === "number" &&
      coordinate >= 0 &&
      coordinate < board.size
  );
}

function isSamePoint(a, b) {
  const [xa, ya] = a;
  const [xb, yb] = b;
  return xa === xb && ya === yb;
}

function isAlignmentSpecified(vertical) {
  return vertical === true || vertical === false;
}

function isShipAlreadyThere(board, newShip) {
  return board.placedShips.some(({ ship }) => newShip === ship);
}

function isEveryPointValid(board, ship, ...positioning) {
  return getNewShipCoordinates(ship, ...positioning).every((newPoint) =>
    isValidPoint(board, ...newPoint)
  );
}

function isShipOverlapping(board, ship, ...positioning) {
  return getNewShipCoordinates(ship, ...positioning).some((newPoint) =>
    board.placedShips.some(({ coordinates }) =>
      coordinates.some((point) => isSamePoint(point, newPoint))
    )
  );
}

function canAddShip(board, newShip, x0, y0, vertical) {
  if (!isAlignmentSpecified(vertical)) return false;
  if (isShipAlreadyThere(board, newShip)) return false;
  if (!isEveryPointValid(...arguments)) return false;
  if (isShipOverlapping(...arguments)) return false;
  return true;
}

function canReceiveAttack(board, ...targetPoint) {
  if (targetPoint.length !== 2) return false;
  if (wasAttackedAt(board, ...targetPoint)) return false;
  if (!isValidPoint(board, ...targetPoint)) return false;
  return true;
}

function wasAttackedAt(board, ...targetPoint) {
  return board.attackedAt.some((attackedPoint) =>
    isSamePoint(attackedPoint, targetPoint)
  );
}

function findSpotForShip(ship, board) {
  let found = false;
  let vertical = true;
  let [x, y] = [0, 0];
  while (!found) {
    vertical = Math.random() < 0.5;
    [x, y] = [getRandomNaturalInt(board.size), getRandomNaturalInt(board.size)];
    if (canAddShip(board, ship, x, y, vertical)) {
      found = true;
    }
  }
  return [x, y, vertical];
}

export default {
  isValidSize,
  isValidPoint,
  isSamePoint,
  canAddShip,
  canReceiveAttack,
  wasAttackedAt,
  getNewShipCoordinates,
  findTargetShip,
  hitPosition,
  findPointToAttack,
  findSpotForShip,
};
