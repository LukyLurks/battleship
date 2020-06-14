const normalizeLength = function (length) {
  if (typeof length === 'number' && length >= 1) {
    return Math.floor(length);
  }
  console.warn(`Normalizing ship length "${length}" to 1.`);
  return 1;
};

const ShipProto = {
  hit: function (position) {
    const damagedShip = Ship(this.length);
    damagedShip.gotHitAt = this.gotHitAt;
    damagedShip.gotHitAt[position] = true;
    return damagedShip;
  },
  isSunk: function () {
    return this.gotHitAt.every((position) => position === true);
  },
};

const module = {
  Ship: function (length) {
    const validLength = normalizeLength(length);
    const fields = {
      length: validLength,
      gotHitAt: Array(validLength).fill(false),
    };
    return Object.assign(Object.create(ShipProto), fields);
  },
};

export default module;
