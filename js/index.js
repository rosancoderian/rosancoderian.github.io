const STATE_X = 'X'
const STATE_O = 'O'

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

let currentPlayer = STATE_X

let boardStates = [
  null, null, null, 
  null, null, null, 
  null, null, null, 
]

function updateBoardState(cell, state) {
  if (cell.innerHTML) return
  cellId = Number(cell.getAttribute('data-cell-id'))
  boardStates[cellId] = state
  cell.innerHTML = state
  return true
}

function endPlayerTurn() {
  currentPlayer = currentPlayer == STATE_X ? STATE_O : STATE_X
}

function endGame(message) {
  document.getElementById('message').innerHTML = message
}

function resetGame() {
  boardStates = boardStates.map(() => null)
  currentPlayer = STATE_X
  document.getElementById('message').innerHTML = null
  document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = null)
}

function checkWinCondition() {
  const playerStates = boardStates.filter(boardState => boardState == currentPlayer)
  const hasWon = winConditions.map(winCond => {
    const [winA, winB, winC] = winCond
    const a = boardStates[winA]
    const b = boardStates[winB]
    const c = boardStates[winC]
    if (!a || !b || !c) return false
    if (a == b && b == c) return true
    return false
  }).reduce((hasWon, isWinCond) => (isWinCond || hasWon), false)
  return hasWon
}

function checkDrawCondition() {
  return boardStates.filter(boardState => !!boardState).length == 9
}

function onClickCell(event) {
  if (document.getElementById('message').innerHTML) return
  if (updateBoardState(event.target, currentPlayer)) {
    if (checkWinCondition()) {
      endGame(`${currentPlayer} won the game!`)
    } else if (checkDrawCondition()) {
      endGame(`It's draw!`)
    } else {
      endPlayerTurn()
    }
  }
}

function onClickReset(event) {
  resetGame()
}

document.querySelectorAll('.cell')
  .forEach(cell => cell.addEventListener('click', onClickCell))

document.querySelectorAll('.reset')
  .forEach(reset => reset.addEventListener('click', onClickReset))
