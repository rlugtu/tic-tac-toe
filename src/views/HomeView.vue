<template>
  <main>
    <div class="flex flex-col justify-center items-center mt-8">
      <h1 class="text-blue-500 text-2xl mt-6">Tic Tac Toe</h1>
      <template v-if="game">
        <div
          v-if="game.state === 'in-progress' || game.state === 'completed'"
          class="flex flex-col justify-center items-center gap-4"
        >
          <p>{{ participants[0].playerId }} vs {{ participants[1].playerId }}</p>
          <p class="text-2xl">
            Current Turn: {{ game.findPlayerByTurn(game.currentTurn)?.playerId }}
          </p>
          <p class="text-2xl min-h-[32px]">{{ winner && 'Winner: ' + winner?.playerId }}</p>
          <div class="grid grid-cols-3 w-[600px] max-h-[600px]">
            <div
              class="border border-gray-500 w-full h-[200px] cursor-pointer relative"
              :class="isBoardSquareMarked(square) && 'select-none'"
              v-for="(mark, square) of game.board.layout"
              :key="square"
              @click="!isBoardSquareMarked(square) && executeTurn(square, game.currentTurn)"
            >
              <div
                v-if="!isBoardSquareMarked(square)"
                class="flex justify-center items-center h-full w-full text-[100px] absolute bg-gray-900 hover:opacity-40"
                :class="game.state !== 'completed' && ' hover:bg-gray-800'"
              ></div>
              <div class="flex justify-center items-center h-full w-full text-[100px]">
                {{ isBoardSquareMarked(square) ? mark : game.currentTurn }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="game.state === 'setup'">
          <h1>Choose your opponent</h1>
          <button class="p-2 bg-blue-500 rounded-md mt-2" @click="startGame('computer')">
            Computer
          </button>
        </div>
      </template>
      <template v-else>
        <div class="mt-4">
          <form action="" class="mt-2 grid gap-4" @submit.prevent @submit="createGame(firstPlayer)">
            <h1 class="text-xl">Player Name</h1>
            <input
              type="text"
              class="p-2 text-xl outline-none rounded-md"
              v-model="firstPlayer.playerId"
            />
            <select
              v-if="firstPlayer.playerId"
              name=""
              id=""
              class="outline-none p-2 rounded-md"
              v-model="firstPlayer.mark"
            >
              <option selected disabled>Choose your mark</option>
              <option value="X">X</option>
              <option value="O">O</option>
            </select>

            <button type="submit" class="bg-blue-500 rounded-md p-2">Start</button>
          </form>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Game } from '@/entities/game/game'
import { Board, boardTypes } from '@/entities/board/board'
import { computed, onMounted, ref } from 'vue'
import { isParticipant, type Participant } from '@/types/game'
import type { Mark } from '@/types/move'

const game = ref<Game | null>(null)
const participants = computed(() => {
  return game.value?.participants ?? []
})

const winner = computed(() => {
  return game.value?.winner
})

const firstPlayer = ref<Partial<Participant>>({})

function createGame(player: Partial<Participant>): Game | void {
  if (!isParticipant(player)) {
    throw new Error('Invalid Player')
  }

  const board = new Board(boardTypes['3x3'])
  game.value = new Game(board, [player])
}

function startGame(playerId: string): void {
  if (!game.value) return

  game.value.addPartipant({ playerId })
  game.value.startGame()
}

function startGameAgainstComputer(): void {
  if (!game.value) return

  game.value.addPartipant({ playerId: 'computer' })
  game.value.startGame()
}
function isBoardSquareMarked(location: string): boolean {
  if (!game.value) return true

  return !!game.value.board.layout[location]
}

function executeTurn(location: string, mark: Mark): void {
  if (!game.value || game.value.state === 'completed') return

  try {
    game.value.executeTurn(location, mark)
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if (!game.value) {
    createGame({
      playerId: 'Ryan',
      mark: 'X'
    })

    startGameAgainstComputer()
  }
})
</script>
