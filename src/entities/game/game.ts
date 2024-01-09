import { isParticipant, type GameState, type Participant } from '@/types/game'
import type { Mark, Move } from '@/types/move'
import type { Board } from '../board/board'
import { findNextBestMove } from '@/util/computer'

export class Game {
  public board: Board
  public participants: Participant[]
  public state: GameState
  public moveHistory: Move[] | null
  public winner: Participant | null
  public currentTurn: Mark

  constructor(board: Board, participants: Participant[]) {
    this.board = board
    this.participants = participants
    this.moveHistory = []
    this.winner = null
    this.state = 'setup'
    this.currentTurn = 'X'
  }

  addPartipant(participant: Partial<Participant>): void {
    if (!participant.playerId) {
      throw new Error('need a name')
    }

    participant.mark = this.participants[this.participants.length - 1].mark === 'X' ? 'O' : 'X'

    if (!isParticipant(participant)) {
      throw new Error('failed check')
    }

    this.participants.push(participant)
  }

  startGame(): void {
    this.state = 'in-progress'
  }

  changeGameState(gameState: GameState): void {
    this.state = gameState
  }

  executeTurn(location: string, mark: Mark): void {
    this.board.markBoard(location, mark)
    this.recordTurn(mark)
    console.log('executing', mark)
    const winningMark = this.board.getWinningMark()
    if (winningMark) {
      const winner = this.getParticipantByMark(winningMark)

      this.setGameWinner(winner)
      this.changeGameState('completed')
      return
    }

    this.switchTurn(mark)

    if (this.getParticipantByMark(this.currentTurn).playerId === 'computer') {
      this.executeComputerTurn(this.currentTurn)
    }
  }

  executeComputerTurn(mark: Mark): void {
    const location = findNextBestMove(mark, { ...this.board.layout })
    if (!location) {
      throw new Error('Computer error. Could not find next best move.')
    }

    this.executeTurn(location, mark)
  }

  getParticipantByMark(mark: Mark): Participant {
    const player = this.participants.find((player) => player.mark === mark)

    if (!player) {
      throw new Error(`Error finding player for mark: ${mark}`)
    }

    return player
  }

  setGameWinner(participant: Participant): void {
    this.winner = participant
  }

  recordTurn(mark: Mark): void {
    const player = this.findPlayerByTurn(mark)
    if (!player) {
      throw new Error('invalid player')
    }

    this.moveHistory?.push({ playerId: player.playerId, mark })
  }

  switchTurn(mark: Mark): void {
    const nextPlayer = this.participants.find((player) => player.mark !== mark)

    if (!nextPlayer) {
      throw new Error('Error switching player')
    }

    this.currentTurn = nextPlayer.mark
  }

  findPlayerByTurn(mark: Mark): Participant | undefined {
    return this.participants.find((player) => player.mark === mark)
  }
}
