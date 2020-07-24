import React from "react";
import { PlayerArea, GameStatus } from "./components";
import { startGame, startEmptyGame } from "./entities/game.js";
import utils from "./utils.js";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.game = startEmptyGame();
    this.state = {
      playerBoard: this.game.player.ownBoard,
      playerShips: {},
      selectedShipName: "",
      cpuBoard: this.game.cpu.ownBoard,
      playerTurn: true,
      playerReady: false,
    };
    this.handleAttack = this.handleAttack.bind(this);
    this.makeCpuAttack = this.makeCpuAttack.bind(this);
    this.restart = this.restart.bind(this);
    this.setReady = this.setReady.bind(this);
    this.dragShips = this.dragShips.bind(this);
    this.dragOverCell = this.dragOverCell.bind(this);
    this.leaveCell = this.leaveCell.bind(this);
    this.dropOnCell = this.dropOnCell.bind(this);
    this.removeShip = this.removeShip.bind(this);
    this.rotateShip = this.rotateShip.bind(this);
  }

  restart() {
    this.game = startGame();
    this.setState({
      playerBoard: this.game.player.ownBoard,
      playerShips: this.game.playerShips,
      cpuBoard: this.game.cpu.ownBoard,
      playerTurn: true,
      playerReady: false,
    });
  }

  setReady() {
    this.setState({ playerReady: true });
  }

  handleAttack({ target, type }) {
    if (!this.shouldAcceptAttack(type)) return;
    const receiving = this.state.playerTurn
      ? { board: this.state.cpuBoard, boardName: "cpuBoard" }
      : { board: this.state.playerBoard, boardName: "playerBoard" };
    const coords = [+target.getAttribute("row"), +target.getAttribute("col")];
    const newBoard = receiving.board.receiveAttack(...coords);
    if (newBoard === receiving.board) return;
    this.setState(
      {
        [receiving.boardName]: newBoard,
        playerTurn: !this.state.playerTurn,
      },
      () => {
        if (!newBoard.isAllSunk() && !this.state.playerTurn) {
          setTimeout(this.makeCpuAttack, 1500);
        }
      }
    );
  }

  shouldAcceptAttack(type) {
    if (!this.state.playerReady) return false;
    if (!this.state.playerTurn && type === "click") return false;
    if (this.state.cpuBoard.isAllSunk()) return false;
    if (this.state.playerBoard.isAllSunk()) return false;
    return true;
  }

  makeCpuAttack() {
    this.game.cpu.enemyBoard = this.state.playerBoard;
    const [x, y] = this.game.cpu.attackRandom();
    const cell = document.querySelector(
      `.playerOneArea .cell[row="${x}"][col="${y}"]`
    );
    this.handleAttack({
      target: cell,
      getAttribute: (axis) => (axis === "row" ? x : y),
    });
  }

  dragShips({ target }) {
    if (!target.classList.contains("ship")) return;
    this.setState({ selectedShipName: target.getAttribute("name") });
  }

  dragOverCell(event) {
    const { target } = event;
    if (!target.classList.contains("cell")) return;
    const selected = this.state.playerShips[this.state.selectedShipName];
    const board = this.state.playerBoard;
    const coords = [+target.getAttribute("row"), +target.getAttribute("col")];
    const verticalOk = utils.canAddShip(board, selected, ...coords, true);
    const horizontOk = utils.canAddShip(board, selected, ...coords, false);
    const align = verticalOk ? true : horizontOk ? false : null;
    if (align === null) return;
    const shipCoords = utils.getNewShipCoordinates(selected, ...coords, align);
    const cells = shipCoords.map(([x, y]) =>
      document.querySelector(`.playerOneArea .cell[row="${x}"][col="${y}"]`)
    );
    cells.forEach((cell) => cell.classList.add("canBePlaced"));
    event.preventDefault();
  }

  leaveCell({ target }) {
    const cells = document.querySelectorAll(".playerOneArea .cell");
    [...cells].forEach((cell) => cell.classList.remove("canBePlaced"));
  }

  dropOnCell(event) {
    const { target } = event;
    if (!target.classList.contains("canBePlaced")) return;
    const ship = this.state.playerShips[this.state.selectedShipName];
    const coords = [+target.getAttribute("row"), +target.getAttribute("col")];
    const board = this.state.playerBoard;
    const verticalOk = utils.canAddShip(board, ship, ...coords, true);
    const horizontOk = utils.canAddShip(board, ship, ...coords, false);
    const align = verticalOk ? true : horizontOk ? false : null;
    this.setState({
      playerBoard: this.state.playerBoard.addShip(ship, ...coords, align),
    });
  }

  removeShip({ target }) {
    const name = target.parentNode.getAttribute("name");
    this.setState({ playerBoard: this.state.playerBoard.removeShip(name) });
  }

  rotateShip({ target }) {
    if (!target.classList.contains("cellWithShip")) return;
    let board = this.state.playerBoard.deepClone();
    const placedShip = this.state.playerBoard.placedShips.find(
      ({ ship }) => ship.name === target.getAttribute("name")
    );
    const origin = placedShip.coordinates[0];
    const vertical = placedShip.coordinates.every(([x, y]) => y === origin[1]);
    board = board.removeShip(placedShip.ship.name);
    if (utils.canAddShip(board, placedShip.ship, ...origin, !vertical)) {
      board = board.addShip(placedShip.ship, ...origin, !vertical);
      this.setState({ playerBoard: board });
    }
  }

  render() {
    return (
      <div className="App">
        <GameStatus
          turn={this.state.playerTurn}
          setReady={this.setReady}
          ready={this.state.playerReady}
          board={
            this.state.playerTurn ? this.state.playerBoard : this.state.cpuBoard
          }
          ships={this.state.playerShips}
          restart={this.restart}
        />
        <div className="players">
          <PlayerArea
            className="playerOneArea"
            name={this.game.player.name}
            board={this.state.playerBoard}
            ships={this.state.playerShips}
            ready={this.state.playerReady}
            dragShips={this.dragShips}
            dragOverCell={this.dragOverCell}
            leaveCell={this.leaveCell}
            dropOnCell={this.dropOnCell}
            removeShip={this.removeShip}
            rotateShip={this.rotateShip}
          />
          <PlayerArea
            className="playerTwoArea"
            name={this.game.cpu.name}
            board={this.state.cpuBoard}
            onClick={this.handleAttack}
          />
        </div>
      </div>
    );
  }
}

export default App;
