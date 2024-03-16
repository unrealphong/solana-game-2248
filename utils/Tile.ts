export class Tile {
  value: number;
  row: number;
  column: number;
  oldRow: number;
  oldColumn: number;
  markForDeletion: boolean;
  mergedInto: Tile | null;
  id: number;
  static id = 0;

  constructor(value = 0, row = -1, column = -1) {
    this.value = value;
    this.row = row;
    this.column = column;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markForDeletion = false;
    this.mergedInto = null;
    this.id = Tile.id++;
  }

  moveTo(row: number, column: number): void {
    this.oldRow = this.row;
    this.oldColumn = this.column;
    this.row = row;
    this.column = column;
  }

  isNew(): boolean {
    return this.oldRow === -1 && !this.mergedInto;
  }

  hasMoved(): boolean {
    return (
      (this.fromRow() !== -1 &&
        (this.fromRow() !== this.toRow() ||
          this.fromColumn() !== this.toColumn())) ||
      this.mergedInto
    );
  }

  fromRow(): number {
    return this.mergedInto ? this.row : this.oldRow;
  }

  fromColumn(): number {
    return this.mergedInto ? this.column : this.oldColumn;
  }

  toRow(): number {
    return this.mergedInto ? this.mergedInto.row : this.row;
  }

  toColumn(): number {
    return this.mergedInto ? this.mergedInto.column : this.column;
  }
}
