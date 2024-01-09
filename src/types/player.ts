export interface Player {
  id: string
  name: string
}

export interface HumanPlayer extends Player {}

export interface ComputerPlayer extends Player {
  name: 'computer'
}
