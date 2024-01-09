import type { Mark, Move } from './move'

export type GameState = 'in-progress' | 'completed' | 'setup'

/**
 * A1 A2 A3
 * A4 A5 A6
 * A7 A8 A9
 */
/**
 * 1A 1B 1C
 * 1D 1E 1F
 * 1G 1H 1I
 */
export type BoardLayout = Record<string, Mark | null>
export interface Participant {
  playerId: string
  mark: Mark
}

export interface Computer extends Participant {
  playerId: 'computer'
}

export function isParticipant(input: Partial<Participant>): input is Participant {
  if (!input.playerId || !input.mark) {
    return false
  }
  return true
}

export interface Game {
  board: BoardLayout
  moveHistory: Move[]
  currentState: GameState
  participants: Participant[]
  // id of the player
  winner: string | null
  currentTurn: Mark
}
