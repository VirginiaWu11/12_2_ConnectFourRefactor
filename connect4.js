/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//game class
class Game {
	constructor(p1, p2, WIDTH = 7, HEIGHT = 6) {
		this.WIDTH = WIDTH;
		this.HEIGHT = HEIGHT;
		let board = [];
		let currPlayer = p1;
		console.log(p1.color);
		function makeBoard() {
			for (let y = 0; y < HEIGHT; y++) {
				board.push(Array.from({ length: WIDTH }));
			}
		}
		function makeHtmlBoard() {
			const board = document.getElementById('board');

			// make column tops (clickable area for adding a piece to that column)
			const top = document.createElement('tr');
			top.setAttribute('id', 'column-top');
			top.addEventListener('click', handleClick);

			for (let x = 0; x < WIDTH; x++) {
				const headCell = document.createElement('td');
				headCell.setAttribute('id', x);
				top.append(headCell);
			}

			board.append(top);

			// make main part of board
			for (let y = 0; y < HEIGHT; y++) {
				const row = document.createElement('tr');

				for (let x = 0; x < WIDTH; x++) {
					const cell = document.createElement('td');
					cell.setAttribute('id', `${y}-${x}`);
					row.append(cell);
				}

				board.append(row);
			}
		}

		function findSpotForCol(x) {
			for (let y = HEIGHT - 1; y >= 0; y--) {
				if (!board[y][x]) {
					return y;
				}
			}
			return null;
		}

		/** placeInTable: update DOM to place piece into HTML table of board */

		function placeInTable(y, x) {
			const piece = document.createElement('div');
			piece.classList.add('piece');
			// piece.classList.add(currPlayer);
			piece.style.top = -50 * (y + 2);
			piece.style.backgroundColor = currPlayer.color;
			console.log(currPlayer.color);

			const spot = document.getElementById(`${y}-${x}`);
			spot.append(piece);
		}

		/** endGame: announce game end */

		function endGame(msg) {
			alert(msg);
			location.reload();
		}

		/** handleClick: handle click of column top to play piece */

		function handleClick(evt) {
			// get x from ID of clicked cell
			const x = +evt.target.id;

			// get next spot in column (if none, ignore click)
			const y = findSpotForCol(x);
			if (y === null) {
				return;
			}

			// place piece in board and add to HTML table
			board[y][x] = currPlayer;
			placeInTable(y, x);

			// check for win
			if (checkForWin()) {
				return endGame(`Player ${currPlayer.color} won!`);
			}

			// check for tie
			if (board.every((row) => row.every((cell) => cell))) {
				return endGame('Tie!');
			}

			// switch players
			currPlayer = currPlayer === p1 ? p2 : p1;
		}

		/** checkForWin: check board cell-by-cell for "does a win start here?" */

		function checkForWin() {
			function _win(cells) {
				// Check four cells to see if they're all color of current player
				//  - cells: list of four (y, x) cells
				//  - returns true if all are legal coordinates & all match currPlayer

				return cells.every(
					([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
				);
			}

			for (let y = 0; y < HEIGHT; y++) {
				for (let x = 0; x < WIDTH; x++) {
					// get "check list" of 4 cells (starting here) for each of the different
					// ways to win
					const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
					const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
					const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
					const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

					// find winner (only checking each win-possibility as needed)
					if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
						return true;
					}
				}
			}
		}

		makeBoard();
		makeHtmlBoard();
	}
}
const button = document.querySelector('#start');
let start = false;
// button.addEventListener('click', function() {});

const form = document.querySelector('form');
form.addEventListener('submit', function(evt) {
	evt.preventDefault();
	const p1 = new Player(document.getElementById('p1').value);
	document.getElementById('p1').value = '';
	const p2 = new Player(document.getElementById('p2').value);
	document.getElementById('p2').value = '';

	if (start === false) {
		new Game(p1, p2);
		start = true;
		document.getElementById('p1').required = false;
		document.getElementById('p2').required = false;
		const labels = document.querySelectorAll('label');
		for (let label of labels) {
			label.classList.remove('required');
		}
	} else location.reload();
});
//player class
class Player {
	constructor(color) {
		this.color = color;
	}
}

// new Game(6,7);

// let currPlayer = 1; // active player: 1 or 2
// array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

// function makeBoard() {
//   for (let y = 0; y < HEIGHT; y++) {
//     board.push(Array.from({ length: WIDTH }));
//   }
// }

/** makeHtmlBoard: make HTML table and row of column tops. */

// function makeHtmlBoard() {
//   const board = document.getElementById('board');

//   // make column tops (clickable area for adding a piece to that column)
//   const top = document.createElement('tr');
//   top.setAttribute('id', 'column-top');
//   top.addEventListener('click', handleClick);

//   for (let x = 0; x < WIDTH; x++) {
//     const headCell = document.createElement('td');
//     headCell.setAttribute('id', x);
//     top.append(headCell);
//   }

//   board.append(top);

//   // make main part of board
//   for (let y = 0; y < HEIGHT; y++) {
//     const row = document.createElement('tr');

//     for (let x = 0; x < WIDTH; x++) {
//       const cell = document.createElement('td');
//       cell.setAttribute('id', `${y}-${x}`);
//       row.append(cell);
//     }

//     board.append(row);
//   }
// }

// /** findSpotForCol: given column x, return top empty y (null if filled) */

// function findSpotForCol(x) {
// 	for (let y = HEIGHT - 1; y >= 0; y--) {
// 		if (!board[y][x]) {
// 			return y;
// 		}
// 	}
// 	return null;
// }

// /** placeInTable: update DOM to place piece into HTML table of board */

// function placeInTable(y, x) {
// 	const piece = document.createElement('div');
// 	piece.classList.add('piece');
// 	piece.classList.add(`p${currPlayer}`);
// 	piece.style.top = -50 * (y + 2);

// 	const spot = document.getElementById(`${y}-${x}`);
// 	spot.append(piece);
// }

// // /** endGame: announce game end */

// function endGame(msg) {
// 	alert(msg);
// }

// /** handleClick: handle click of column top to play piece */

// function handleClick(evt) {
// 	// get x from ID of clicked cell
// 	const x = +evt.target.id;

// 	// get next spot in column (if none, ignore click)
// 	const y = findSpotForCol(x);
// 	if (y === null) {
// 		return;
// 	}

// 	// place piece in board and add to HTML table
// 	board[y][x] = currPlayer;
// 	placeInTable(y, x);

// 	// check for win
// 	if (checkForWin()) {
// 		return endGame(`Player ${currPlayer} won!`);
// 	}

// 	// check for tie
// 	if (board.every((row) => row.every((cell) => cell))) {
// 		return endGame('Tie!');
// 	}

// 	// switch players
// 	currPlayer = currPlayer === 1 ? 2 : 1;
// }

// /** checkForWin: check board cell-by-cell for "does a win start here?" */

// function checkForWin() {
// 	function _win(cells) {
// 		// Check four cells to see if they're all color of current player
// 		//  - cells: list of four (y, x) cells
// 		//  - returns true if all are legal coordinates & all match currPlayer

// 		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
// 	}
// }

// for (let y = 0; y < HEIGHT; y++) {
// 	for (let x = 0; x < WIDTH; x++) {
// 		// get "check list" of 4 cells (starting here) for each of the different
// 		// ways to win
// 		const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
// 		const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
// 		const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
// 		const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

// 		// find winner (only checking each win-possibility as needed)
// 		if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
// 			return true;
// 		}
// 	}
// }

// // makeBoard();
// // makeHtmlBoard();
