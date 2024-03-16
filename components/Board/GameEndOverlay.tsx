"use client"
import { Board } from "@/utils/Board"
import React from "react"

interface GameEndOverlayProps {
  board: Board
  onRestart: () => void
}

const GameEndOverlay: React.FC<GameEndOverlayProps> = ({ board, onRestart }) => {
  let contents = ""
  if (board.hasWon()) {
    contents = "Good Job!"
  } else if (board.hasLost()) {
    contents = "Game Over"
  }
  if (!contents) {
    return null
  }
  return (
    <div className="overlay">
      <p className="message">{contents}</p>
      <button className="tryAgain" onClick={onRestart} onTouchEnd={onRestart}>
        Try again
      </button>
    </div>
  )
}

export default GameEndOverlay
