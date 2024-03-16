"use client"
import { Board } from "@/utils/Board"
import React, { useEffect, useState } from "react"
import Cell from "./Cell"
import GameEndOverlay from "./GameEndOverlay"
import TileView from "./TileView"

const BoardView: React.FC = () => {
  const [board, setBoard] = useState<Board>(new Board())
  let startX = 0
  let startY = 0

  const restartGame = () => {
    setBoard(new Board())
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (board.hasWon()) {
      return
    }
    if (event.keyCode >= 37 && event.keyCode <= 40) {
      event.preventDefault()
      const direction = event.keyCode - 37
      setBoard((prevBoard) => prevBoard.move(direction))
    }
  }

  const handleTouchStart = (event: TouchEvent) => {
    if (board.hasWon()) {
      return
    }
    if (event.touches.length !== 1) {
      return
    }
    startX = event.touches[0].screenX
    startY = event.touches[0].screenY
    event.preventDefault()
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (board.hasWon()) {
      return
    }
    if (event.changedTouches.length !== 1) {
      return
    }
    const deltaX = event.changedTouches[0].screenX - startX
    const deltaY = event.changedTouches[0].screenY - startY
    let direction = -1
    if (Math.abs(deltaX) > 3 * Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      direction = deltaX > 0 ? 2 : 0
    } else if (Math.abs(deltaY) > 3 * Math.abs(deltaX) && Math.abs(deltaY) > 30) {
      direction = deltaY > 0 ? 3 : 1
    }
    if (direction !== -1) {
      setBoard((prevBoard) => prevBoard.move(direction))
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const cells = board.cells.map((row, rowIndex) => (
    <div key={rowIndex}>
      {row.map((_, columnIndex) => (
        <Cell key={rowIndex * Board.size + columnIndex} />
      ))}
    </div>
  ))

  const tiles = board.tiles.filter((tile) => tile.value !== 0).map((tile) => <TileView tile={tile} key={tile.id} />)

  return (
    <div className="board" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} tabIndex={1}>
      {cells}
      {tiles}
      <GameEndOverlay board={board} onRestart={restartGame} />
    </div>
  )
}

export default BoardView
