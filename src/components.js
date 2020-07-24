import React from "react";
import utils from "./utils";
import "./components.css";

function PlayerArea(props) {
  return (
    <div className={`${props.className} PlayerArea`}>
      <p>{props.name}</p>
      <Board
        board={props.board}
        onClick={props.onClick}
        onDragOver={props.dragOverCell}
        onDrop={props.dropOnCell}
        onDoubleClick={props.rotateShip}
        onDragLeave={props.leaveCell}
      />
      <Ships
        board={props.board}
        ships={props.ships}
        ready={props.ready}
        onDragStart={props.dragShips}
        onDoubleClick={props.removeShip}
      />
    </div>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.size = this.props.board.size;
  }

  getShipName(coords) {
    const placedShips = this.props.board.placedShips;
    const coordsLists = placedShips.map((ship) => ship.coordinates);
    const shipIndex = coordsLists.findIndex((list) =>
      list.some((point) => utils.isSamePoint(point, coords))
    );
    if (shipIndex < 0) return null;
    return placedShips[shipIndex].ship.name;
  }

  makeCells() {
    const withShip = this.props.board.placedShips
      .map((ship) => ship.coordinates)
      .flat();
    const withSunk = this.props.board.placedShips
      .filter(({ ship }) => ship.isSunk())
      .map((ship) => ship.coordinates)
      .flat();
    const cells = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const cell = { row: i, col: j, key: `${i}${j}` };
        cell.ship = withShip.some((point) => utils.isSamePoint(point, [i, j]));
        cell.attacked = utils.wasAttackedAt(this.props.board, i, j);
        cell.sunk = withSunk.some((point) => utils.isSamePoint(point, [i, j]));
        cell.shipName = this.getShipName([i, j]);
        cells.push(cell);
      }
    }
    return cells;
  }

  render() {
    return (
      <div
        className="board"
        onClick={this.props.onClick}
        onDragOver={this.props.onDragOver}
        onDrop={this.props.onDrop}
        onDoubleClick={this.props.onDoubleClick}
        onDragLeave={this.props.onDragLeave}
      >
        {this.makeCells().map((cell) => {
          let classes = "cell";
          classes += cell.ship ? " cellWithShip" : "";
          classes += cell.attacked ? " attacked" : "";
          classes += cell.sunk ? " sunk" : "";
          return (
            <div
              key={cell.key}
              row={cell.row}
              col={cell.col}
              name={cell.shipName}
              className={classes}
            ></div>
          );
        })}
      </div>
    );
  }
}

class Ships extends React.PureComponent {
  render() {
    if (!this.props.ships) return null;
    if (Object.entries(this.props.ships).length === 0) return null;
    if (this.props.ready) return null;
    return (
      <div
        className="playerShips"
        onDragStart={this.props.onDragStart}
        onDoubleClick={this.props.onDoubleClick}
      >
        {Object.entries(this.props.ships).map(([name, ship]) => {
          return (
            <DraggableShip
              key={name}
              name={name}
              board={this.props.board}
              ship={ship}
            />
          );
        })}
      </div>
    );
  }
}

function DraggableShip(props) {
  const isPlaced = props.board.placedShips.some(
    ({ ship }) => ship.name === props.name
  );
  const classes = "ship" + (isPlaced ? " placed" : "");
  return (
    <div name={props.name} className={classes} draggable={true}>
      {Array(props.ship.size)
        .fill(1)
        .map((cell, i) => {
          let classes = "cell cellWithShip";
          classes += isPlaced ? " placed" : "";
          return <div key={props.name + i} className={classes}></div>;
        })}
    </div>
  );
}

class GameStatus extends React.PureComponent {
  render() {
    const currentTurn = this.props.turn ? "Player" : "CPU";
    const lastPlayer = this.props.turn ? "CPU" : "Player";

    const turn = `Turn: ${currentTurn}`;
    return (
      <div className="GameStatus">
        <h1>Battleship</h1>
        <LastMove board={this.props.board} player={lastPlayer} />
        <p>{!this.props.ready || this.props.board.isAllSunk() ? "" : turn}</p>
        <Winner board={this.props.board} player={lastPlayer} />
        <RestartButton
          onClick={this.props.restart}
          board={this.props.board}
          ships={this.props.ships}
        />
        <Instructions ships={this.props.ships} ready={this.props.ready} />
        <ReadyButton
          board={this.props.board}
          ships={this.props.ships}
          ready={this.props.ready}
          onClick={this.props.setReady}
        />
      </div>
    );
  }
}

class LastMove extends React.PureComponent {
  constructor(props) {
    super(props);
    this.cols = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    this.rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  formatCoords(rowNumber, colNumber) {
    return `${this.cols[colNumber]}${this.rows[rowNumber]}`;
  }

  formatDamage(move) {
    const attackedShip = utils.findTargetShip(this.props.board, ...move);
    if (attackedShip) {
      return attackedShip.ship.isSunk() ? "and sunk a ship" : "and hit a ship";
    }
    return "";
  }

  render() {
    const coords = this.props.board.attackedAt.slice(-1).flat();
    const move = `${this.props.player} attacked ${this.formatCoords(
      ...coords
    )}`;
    const damage = this.formatDamage(coords);
    return <p>{`${coords.length > 0 ? move : ""} ${damage ? damage : ""}`}</p>;
  }
}

function Winner(props) {
  if (props.board.isAllSunk() && props.board.placedShips.length > 0) {
    return <p>{`${props.player} wins!`}</p>;
  }
  return null;
}

function RestartButton(props) {
  const emptyBoard = props.board.placedShips.length === 0;
  const gameover = props.board.isAllSunk();
  const beforeFirstGame = Object.values(props.ships).length === 0;
  if (beforeFirstGame || (!emptyBoard && gameover)) {
    return <button onClick={props.onClick}>New Game</button>;
  }
  return null;
}

function ReadyButton(props) {
  const ships = document.querySelectorAll(".playerShips .ship");
  const emptyBoard = ships.length === 0;
  const allShipsPlaced = Object.values(props.ships).every((playerShip) =>
    props.board.placedShips.some(({ ship }) => playerShip === ship)
  );
  if (!props.ready && !emptyBoard && allShipsPlaced) {
    return <button onClick={props.onClick}>Start</button>;
  }
  return null;
}

function Instructions(props) {
  if (Object.values(props.ships).length === 0 || props.ready) return null;
  return (
    <ul>
      <li key="placement">Drag and drop the ships below onto your board.</li>
      <li key="rotation">
        Double-click a ship you placed to rotate it (if it fits).
      </li>
      <li key="removal">Double click a ship in the zone below to remove it.</li>
    </ul>
  );
}

export { PlayerArea, GameStatus, Board };
