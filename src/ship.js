const Ship = function (length) {
  const validLength = normalizeLength(length);
  const fields = {
    length: validLength,
    damagedAt: Array(validLength).fill(false),
  };
  return Object.assign(Object.create(ShipProto), fields);
};

const ShipProto = {
  duplicate: function () {
    const fields = {
      length: this.length,
      damagedAt: Array.from(this.damagedAt),
    };
    return Object.assign(Object.create(ShipProto), fields);
  },
  hit: function (position) {
    const damagedShip = this.duplicate();
    damagedShip.damagedAt[position] = true;
    return damagedShip;
  },
  isSunk: function () {
    return this.damagedAt.every((position) => position === true);
  },
};

function normalizeLength(length) {
  if (typeof length === 'number' && length >= 1) {
    return Math.floor(length);
  }
  console.warn(`Normalizing ship length "${length}" to 1.`);
  return 1;
}

export { Ship };
