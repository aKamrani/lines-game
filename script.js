const N = 4;
const M = 4;

let turn = "R";
let selectedLines = [];

const hoverClasses = { R: "hover-red", B: "hover-blue" };
const bgClasses = { R: "bg-red", B: "bg-blue" };

const playersTurnText = (turn) =>
	`It's ${turn === "R" ? "Red" : "Blue"}'s turn`;

const isLineSelected = (line) =>
	line.classList.contains(bgClasses.R) || line.classList.contains(bgClasses.B);

const createGameGrid = () => {
	const gameGridContainer = document.getElementsByClassName(
		"game-grid-container"
	)[0];

	const rows = Array(N)
		.fill(0)
		.map((_, i) => i);
	const cols = Array(M)
		.fill(0)
		.map((_, i) => i);

	rows.forEach((row) => {
		cols.forEach((col) => {
			const dot = document.createElement("div");
			dot.setAttribute("class", "dot");

			const hLine = document.createElement("div");
			hLine.setAttribute("class", `line-horizontal ${hoverClasses[turn]}`);
			hLine.setAttribute("id", `h-${row}-${col}`);
			hLine.addEventListener("click", handleLineClick);

			gameGridContainer.appendChild(dot);
			if (col < M - 1) gameGridContainer.appendChild(hLine);
		});

		if (row < N - 1) {
			cols.forEach((col) => {
				const vLine = document.createElement("div");
				vLine.setAttribute("class", `line-vertical ${hoverClasses[turn]}`);
				vLine.setAttribute("id", `v-${row}-${col}`);
				vLine.addEventListener("click", handleLineClick);

				const box = document.createElement("div");
				box.setAttribute("class", "box");
				box.setAttribute("id", `box-${row}-${col}`);

				gameGridContainer.appendChild(vLine);
				if (col < M - 1) gameGridContainer.appendChild(box);
			});
		}
	});

	document.getElementById("game-status").innerHTML = playersTurnText(turn);
};



const isBoxSelected = (box) =>
	box.classList.contains(bgClasses.R) || box.classList.contains(bgClasses.B);

let blue_score = 0
let red_score = 0

let isGameFinished = false
const changeTurn = () => {
	const nextTurn = turn === "R" ? "B" : "R";

	const lines = document.querySelectorAll(".line-vertical, .line-horizontal");

	lines.forEach((l) => {
		//if line was not already selected, change it's hover color according to the next turn
		if (!isLineSelected(l)) {
			l.classList.replace(hoverClasses[turn], hoverClasses[nextTurn]);
		}
	});
	turn = nextTurn;
	document.getElementById("game-status").innerHTML = playersTurnText(turn);
};

const handleLineClick = (e) => {
	if (!isGameFinished) {
		const lineId = e.target.id;
		const selectedLine = document.getElementById(lineId);

		if (isLineSelected(selectedLine)) {
			//if line was already selected, return
			return;
		}

		selectedLines = [...selectedLines, lineId];

		colorLine(selectedLine);
		checkFillSquare();
		changeTurn();
		checkGameEnd();
	}
};

const colorLine = (selectedLine) => {
	selectedLine.classList.remove(hoverClasses[turn]);
	selectedLine.classList.add(bgClasses[turn]);
};

const checkFillSquare = () => {
	const boxes = document.querySelectorAll('.box');
	boxes.forEach((b) => {
		const i = parseInt(b.id.split('box-')[1].split('-')[0]);
		const j = parseInt(b.id.split('box-')[1].split('-')[1]);
		const left_line = document.querySelector(`#v-${i}-${j}`)
		const up_line = document.querySelector(`#h-${i}-${j}`)
		const right_line = document.querySelector(`#v-${i}-${j + 1}`)
		const bottom_line = document.querySelector(`#h-${i + 1}-${j}`)
		if (isLineSelected(left_line) && isLineSelected(up_line) && isLineSelected(right_line) && isLineSelected(bottom_line)) {
			if (!isBoxSelected(b)) {
				b.classList.add(bgClasses[turn]);
				if (turn == 'R') {
					red_score += 1;
				}
				else {
					blue_score += 1;
				}
				console.log('Red: ', red_score)
				console.log('Blue: ', blue_score)
			}
		}
	});
};

const checkGameEnd = () => {
	let isEnd = true
	for (let i = 0; i < N; i++) {
		for (let j = 0; j < M; j++) {
			try {
				const h_line = document.querySelector(`#h-${i}-${j}`)
				const v_line = document.querySelector(`#v-${i}-${j}`)
				if (!isLineSelected(h_line)) {
					isEnd = false
				}
				if (!isLineSelected(v_line)) {
					isEnd = false
				}
			} catch (error) {
				continue;
			}
		}
	}
	if (isEnd) {
		isGameFinished = true
		const winner = result = Math.max(red_score, blue_score)
		document.getElementById("game-status").innerHTML = `won ${winner == red_score ? 'Red' : 'Blue'}`;
	}
};

createGameGrid();
