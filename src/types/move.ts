export type Mark = 'X' | 'O'

export interface Move {
  playerId: string
  mark: Mark
}
