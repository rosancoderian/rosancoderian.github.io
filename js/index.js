// On document ready
$(init)

// Constants
const X = 'X'
const O = 'O'

// Board
function createBoard(size) {
  return new Array(size).fill(null).map(() => new Array(size).fill(null))
}

function getHorizontal(board, y) {
  return board[y]
}

function getVertical(board, x) {
  return board.map((row) => row[x])
}

function getDiagonal(board, x, y, dir = 1, arr = []) {
  if (y >= board.length || y < 0) return arr
  if (x >= board.length || x < 0) return arr

  arr.push(board[y][x])

  return getDiagonal(board, x + dir, y + 1, dir, arr)
}

function mark(board, player, x, y) {
  if (!board[y][x]) board[y][x] = player
  return board
}

function nextPlayer(player) {
  return player == X ? O : X
}

// Main
let board = []
let player = X
let winMarks = { [O]: '', [X]: '' }
let winner = null

function onClickCell(ev) {
  if (!$(ev.target).hasClass('cell')) return
  if (winner) return drawMessage(`${winner} has won the game!`)

  const { x, y } = $(ev.target).data()

  board = mark(board, player, x, y)

  if (!drawCell(player, x, y)) return

  winner = checkWin(board, player, winMarks[player])

  if (winner) return drawMessage(`${winner} has won the game!`)

  player = nextPlayer(player)

  drawTurn(player)
}

function checkStraightWin(board, winMark, dir = 1) {
  let win = false

  for (let i = 0; i < board.length; i++) {
    win ||= (dir > 0 ? getHorizontal(board, i) : getVertical(board, i)).join('').includes(winMark)
    if (win) break;
  }

  return win
}

function checkDiagonalWin(board, winMark, dir = 1) {
  let win = false
  let startX = dir > 0 ? 0 : board.length - 1
  let stopX = x => dir > 0 ? x < board.length : x >= 0
  
  for (let x = startX; stopX(x); x += dir) {
    win ||= getDiagonal(board, x, 0, dir).join('').includes(winMark)
    if (win) break;
  }

  for (let y = 1; y < board.length; y++) {
    win ||= getDiagonal(board, startX, y, dir).join('').includes(winMark)
    if (win) break;
  }

  return win
}

function checkWin(board, player, winMark) {
  if (checkStraightWin(board, winMark)) return player
  if (checkStraightWin(board, winMark, -1)) return player
  if (checkDiagonalWin(board, winMark)) return player
  if (checkDiagonalWin(board, winMark, -1)) return player
  return false
}

function drawCell(player, x, y) {
  $cell = $(`.cell[data-x="${x}"][data-y="${y}"]`)

  if ($cell.html()) return false

  $cell.html(player)

  return true
}

function drawTurn(text) {
  $('#turn').html(text)
}

function drawMessage(text) {
  $('#message').html(text)
}

function initBoardDom(boardSize) {
  const boardDom = new Array(boardSize)
    .fill(null)
    .map((_, y) => {
      return `<div class="row">
        ${new Array(boardSize)
          .fill(null)
          .map((_, x) => `<div class="cell" data-x="${x}" data-y="${y}"></div>`)
          .join('')}
      </div>`
    })
    .join('')

  $('.board').empty()
  $('.board').append(boardDom)
}

function initBoardEvents() {
  $('.board').off('click', onClickCell)
  $('.board').on('click', onClickCell)
}

function startGame(boardSize, markCount) {
  board = createBoard(boardSize)
  player = X
  winMarks = {
    [O]: new Array(markCount).fill(O).join(''),
    [X]: new Array(markCount).fill(X).join(''),
  }
  winner = null

  drawMessage(null)
  drawTurn(X)
}

function init() {
  $('.reset').on('click', () => {
    const boardSize = Number($('input[name=boardSize]').first().val())
    const markCount = Number($('input[name=markCount]').first().val())

    initBoardDom(boardSize)
    initBoardEvents()

    startGame(boardSize, markCount)
  })
}
