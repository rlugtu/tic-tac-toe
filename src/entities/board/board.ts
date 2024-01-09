import type { BoardLayout } from '@/types/game'
import type { Mark } from '@/types/move'

export type BoardType = '3x3'
export const boardTypes: Record<BoardType, BoardLayout> = {
  '3x3': {
    A1: null,
    A2: null,
    A3: null,
    A4: null,
    A5: null,
    A6: null,
    A7: null,
    A8: null,
    A9: null
  }
}

export class Board {
  public layout: BoardLayout
  public winner: Mark | null

  constructor(layout: BoardLayout) {
    this.layout = layout
    this.winner = null
  }

  markBoard(location: keyof typeof this.layout, mark: Mark): void {
    try {
      this.layout[location] = mark
    } catch (error) {
      alert('no!')
    }
  }

  getWinningMark(): Mark | null {
    const spaces = Object.keys(this.layout)
    //horizontal
    for (let i = 1; i < spaces.length; i += 3) {
      const isMarked = this.layout[`A${i}`]?.length
      if (!isMarked) {
        continue
      }

      const currMark = this.layout[`A${i}`]
      let winCount = 1
      for (let j = i + 1; j < i + 3; j++) {
        if (this.layout[`A${j}`] !== currMark) {
          break
        }
        winCount++
        if (winCount >= 3 && currMark !== undefined) {
          return currMark
        }
      }
    }

    //vertical
    for (let i = 1; i < 4; i++) {
      const isMarked = this.layout[`A${i}`] !== null
      if (!isMarked) {
        continue
      }

      const currMark = this.layout[`A${i}`]
      let winCount = 1
      for (let j = i + 3; j < j + 6; j += 3) {
        if (this.layout[`A${j}`] !== currMark) {
          break
        }
        winCount++
        if (winCount >= 3 && currMark !== undefined) {
          return currMark
        }
      }
    }

    //diagonal
    const currMark = this.layout[`A${5}`]
    if (currMark) {
      if (
        (currMark === this.layout[`A${1}`] && currMark === this.layout[`A${9}`]) ||
        (currMark === this.layout[`A${3}`] && currMark === this.layout[`A${7}`])
      ) {
        return currMark
      }
    }
    return null
  }
}

export function createBoard(boardType: BoardType): Board {
  return new Board(boardTypes[boardType])
}
