const Ship = function (size, name) {
  if (!isSizeValid(size)) {
    return null;
  }
  const fields = {
    size: Math.floor(size),
    name: name,
    damagedAt: Array(Math.floor(size)).fill(false),
  };
  return Object.assign(Object.create(ShipProto), fields);
};

const ShipProto = {
  deepClone: function () {
    const fields = {
      size: this.size,
      name: this.name,
      damagedAt: Array.from(this.damagedAt),
    };
    return Object.assign(Object.create(ShipProto), fields);
  },
  hit: function (position) {
    if (!isPositionValid(position, this.size)) {
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

function isSizeValid(size) {
  return typeof size === "number" && size >= 1;
}

function isPositionValid(position, shipSize) {
  return typeof position === "number" && position >= 0 && position < shipSize;
}

export { Ship };
