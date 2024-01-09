import type { BoardLayout } from '@/types/game'
import type { Mark } from '@/types/move'

export function findNextBestMove(mark: Mark, board: BoardLayout): string {
  let bestScore = mark === 'X' ? -Infinity : Infinity
  let bestCoordinate: string = ''

  for (const spaceCoordinate in board) {
    if (!board[spaceCoordinate]) {
      board[spaceCoordinate] = mark
      const score = minimax(board, 0, mark === 'X' ? false : true)
      board[spaceCoordinate] = null

      if ((mark === 'X' && score > bestScore) || (mark === 'O' && score < bestScore)) {
        bestScore = score
        bestCoordinate = spaceCoordinate
      }
    }
  }

  return bestCoordinate
}

const scores = {
  X: 10,
  O: -10,
  tie: 0
}

function minimax(board: BoardLayout, depth: number, isMaxing: boolean): number {
  const winner = checkWinner(board)
  if (winner) {
    return scores[winner]
  }

  if (isMaxing) {
    let bestScore = -Infinity

    for (const spaceCoordinate in board) {
      if (!board[spaceCoordinate]) {
        board[spaceCoordinate] = 'X'
        const score = minimax(board, depth + 1, false)
        board[spaceCoordinate] = null
        bestScore = Math.max(bestScore, score)
      }
    }

    return bestScore
  } else {
    let bestScore = Infinity

    for (const spaceCoordinate in board) {
      if (!board[spaceCoordinate]) {
        board[spaceCoordinate] = 'O'
        const score = minimax(board, depth + 1, true)
        board[spaceCoordinate] = null
        bestScore = Math.min(bestScore, score)
      }
    }

    return bestScore
  }
}

function checkWinner(board: BoardLayout): Mark | null {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      board[`A${i * 3 + 1}`] &&
      board[`A${i * 3 + 1}`] === board[`A${i * 3 + 2}`] &&
      board[`A${i * 3 + 1}`] === board[`A${i * 3 + 3}`]
    ) {
      return board[`A${i * 3 + 1}`]
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      board[`A${i + 1}`] &&
      board[`A${i + 1}`] === board[`A${i + 4}`] &&
      board[`A${i + 1}`] === board[`A${i + 7}`]
    ) {
      return board[`A${i + 1}`]
    }
  }

  // Check diagonals
  if (board.A1 && board.A1 === board.A5 && board.A1 === board.A9) {
    return board.A1
  }

  if (board.A3 && board.A3 === board.A5 && board.A3 === board.A7) {
    return board.A3
  }

  // No winner
  return null
}
