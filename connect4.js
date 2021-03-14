/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//game class
class Game {
	constructor(p1, p2, WIDTH = 7, HEIGHT = 6) {
		this.p1 = p1;
		this.p2 = p2;

		this.WIDTH = WIDTH;
		this.HEIGHT = HEIGHT;
		this.board = [];
		this.currPlayer = p1;
		this.makeBoard();
		this.makeHtmlBoard();

		console.log(p1);
	}
	makeBoard() {
		for (let y = 0; y < this.HEIGHT; y++) {
			this.board.push(Array.from({ length: this.WIDTH }));
		}
	}

	makeHtmlBoard() {
		const board = document.getElementById('board');

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');
		this.handleClicks = this.handleClick.bind(this);

		top.addEventListener('click', this.handleClicks);

		for (let x = 0; x < this.WIDTH; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}

		board.append(top);

		// make main part of board
		for (let y = 0; y < this.HEIGHT; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.WIDTH; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}

	findSpotForCol(x) {
		for (let y = this.HEIGHT - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** placeInTable: update DOM to place piece into HTML table of board */

	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.style.top = -50 * (y + 2);
		piece.style.backgroundColor = this.currPlayer.color;

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	/** endGame: announce game end */

	endGame(msg) {
		alert(msg);
		location.reload();
	}

	/** handleClick: handle click of column top to play piece */

	handleClick(evt) {
		// get x from ID of clicked cell
		const x = +evt.target.id;
		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		// check for win
		if (this.checkForWin()) {
			return this.endGame(`Player ${this.currPlayer.color} won!`);
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			return this.endGame('Tie!');
		}

		// switch players
		console.log(this.currPlayer);
		console.log(this.p1);

		this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;

		console.log('handle');

		console.log(this.currPlayer);
	}

	/** checkForWin: check board cell-by-cell for "does a win start here?" */

	checkForWin() {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		const _win = (cells) => {
			return cells.every(
				([ y, x ]) =>
					y >= 0 && y < this.HEIGHT && x >= 0 && x < this.WIDTH && this.board[y][x] === this.currPlayer
			);
		};

		for (let y = 0; y < this.HEIGHT; y++) {
			for (let x = 0; x < this.WIDTH; x++) {
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
}
const button = document.querySelector('#start');
let start = false;
// button.addEventListener('click', function() {});

const form = document.querySelector('form');
form.addEventListener('submit', function(evt) {
	evt.preventDefault();
	const p1 = new Player(document.getElementById('pl1').value);
	document.getElementById('pl1').value = '';
	const p2 = new Player(document.getElementById('pl2').value);
	document.getElementById('pl2').value = '';
	if (start === false) {
		new Game(p1, p2);
		start = true;
		document.getElementById('pl1').required = false;
		document.getElementById('pl2').required = false;
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
