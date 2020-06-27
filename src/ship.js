const Ship = function (length) {
  if (!isLengthValid(length)) {
    console.warn(`Ship() length "${length}" invalid`);
    return null;
  }
  const fields = {
    length: Math.floor(length),
    damagedAt: Array(Math.floor(length)).fill(false),
  };
  return Object.assign(Object.create(ShipProto), fields);
};

const ShipProto = {
  deepClone: function () {
    const fields = {
      length: this.length,
      damagedAt: Array.from(this.damagedAt),
    };
    return Object.assign(Object.create(ShipProto), fields);
  },
  hit: function (position) {
    if (!isPositionValid(position, this.length)) {
      console.warn(`hit() position "${position}" invalid`);
      return this;
    }
    const damagedShip = this.deepClone();
    damagedShip.damagedAt[Math.floor(position)] = true;
    return damagedShip;
  },
  isSunk: function () {
    return this.damagedAt.every((position) => position === true);
  },
};

function isLengthValid(length) {
  return typeof length === 'number' && length >= 1;
}

function isPositionValid(position, shipLength) {
  return typeof position === 'number' && position >= 0 && position < shipLength;
}

export { Ship };
