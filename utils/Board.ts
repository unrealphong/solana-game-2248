import { rotateLeft } from './rotationUtils';
import { Tile } from './Tile';

export class Board {
  tiles: Tile[];
  cells: Tile[][];
  won: boolean;

  constructor() {
    this.tiles = [];
    this.cells = [];
    for (let i = 0; i < Board.size; ++i) {
      this.cells[i] = [this.addTile(), this.addTile(), this.addTile(), this.addTile()];
    }
    this.addRandomTile();
    this.setPositions();
    this.won = false;
  }

  addTile(value?: number, row?: number, column?: number): Tile {
    const res = new Tile(value, row, column);
    this.tiles.push(res);
    return res;
  }

  moveLeft(): boolean {
    let hasChanged = false;
    for (let row = 0; row < Board.size; ++row) {
      const currentRow = this.cells[row].filter(tile => tile.value !== 0);
      const resultRow: Tile[] = [];
      for (let target = 0; target < Board.size; ++target) {
        let targetTile = currentRow.length ? currentRow.shift()! : this.addTile();
        if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
          const tile1 = targetTile;
          targetTile = this.addTile(targetTile.value);
          tile1.mergedInto = targetTile;
          const tile2 = currentRow.shift()!;
          tile2.mergedInto = targetTile;
          targetTile.value += tile2.value;
        }
        resultRow[target] = targetTile;
        this.won |= (targetTile.value === 2048);
        hasChanged |= (targetTile.value !== this.cells[row][target].value);
      }
      this.cells[row] = resultRow;
    }
    return hasChanged;
  }

  setPositions(): void {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        tile.oldRow = tile.row;
        tile.oldColumn = tile.column;
        tile.row = rowIndex;
        tile.column = columnIndex;
        tile.markForDeletion = false;
      });
    });
  }

  addRandomTile(): void {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < Board.size; ++r) {
      for (let c = 0; c < Board.size; ++c) {
        if (this.cells[r][c].value === 0) {
          emptyCells.push({ r: r, c: c });
        }
      }
    }
    const index = ~~(Math.random() * emptyCells.length);
    const cell = emptyCells[index];
    const newValue = Math.random() < Board.fourProbability ? 4 : 2;
    this.cells[cell.r][cell.c] = this.addTile(newValue);
  }

  move(direction: number): Board {
    this.clearOldTiles();
    for (let i = 0; i < direction; ++i) {
      this.cells = rotateLeft(this.cells);
    }
    const hasChanged = this.moveLeft();
    for (let i = direction; i < 4; ++i) {
      this.cells = rotateLeft(this.cells);
    }
    if (hasChanged) {
      this.addRandomTile();
    }
    this.setPositions();
    return this;
  }

  clearOldTiles(): void {
    this.tiles = this.tiles.filter(tile => !tile.markForDeletion);
    this.tiles.forEach(tile => { tile.markForDeletion = true; });
  }

  hasWon(): boolean {
    return this.won;
  }

  hasLost(): boolean {
    let canMove = false;
    for (let row = 0; row < Board.size; ++row) {
      for (let column = 0; column < Board.size; ++column) {
        canMove |= (this.cells[row][column].value === 0);
        for (let dir = 0; dir < 4; ++dir) {
          const newRow = row + Board.deltaX[dir];
          const newColumn = column + Board.deltaY[dir];
          if (newRow < 0 || newRow >= Board.size || newColumn < 0 || newColumn >= Board.size) {
            continue;
          }
          canMove |= (this.cells[row][column].value === this.cells[newRow][newColumn].value);
        }
      }
    }
    return !canMove;
  }

  static size = 4;
  static fourProbability = 0.1;
  static deltaX = [-1, 0, 1, 0];
  static deltaY = [0, -1, 0, 1];
}
