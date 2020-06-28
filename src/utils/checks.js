import helpers from './helpers';

function isValidSize(size) {
  return typeof size === 'number' && size >= 1;
}

function isValidPoint(board, ...point) {
  return point.every(
    (coordinate) =>
      typeof coordinate === 'number' &&
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
  return helpers
    .getNewShipCoordinates(ship, ...positioning)
    .every((newPoint) => isValidPoint(board, ...newPoint));
}

function isShipOverlapping(board, ship, ...positioning) {
  return helpers
    .getNewShipCoordinates(ship, ...positioning)
    .some((newPoint) =>
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

const module = {
  isValidSize,
  isValidPoint,
  isSamePoint,
  canAddShip,
  canReceiveAttack,
  wasAttackedAt,
};

export default module;
