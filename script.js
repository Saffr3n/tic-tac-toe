const Player = (name) => {
  let mark;

  const getName = () => name;
  const getMark = () => mark;
  const setMark = m => mark = m;

  return { getName, getMark, setMark };
};

const gameboard = (() => {
  let board;

  const get = () => board;
  const set = (index, mark) => board[index] = mark;
  const reset = () => board = (new Array(9)).fill('');

  const instantiate = () => {
    const div = document.querySelector('.board');
    div.innerHTML = '';

    for (let i = 0; i < board.length; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('index', i);
      div.appendChild(cell);
    }
  };

  reset();
  instantiate();

  const update = cells => {
    for (let i = 0; i < cells.length; i++)
      cells[i].textContent = board[i];
  };

  return { get, set, reset, instantiate, update };
})();

const game = (() => {
  let playerOne;
  let playerTwo;
  let cells;

  const start = (p1, p2) => {
    if (!p1.getMark() || p1.getMark() === 'O') {
      p1.setMark('X');
      p2.setMark('O');
      playerOne = p1;
      playerTwo = p2;
    }
    else {
      p1.setMark('O');
      p2.setMark('X');
      playerOne = p2;
      playerTwo = p1;
    }

    gameboard.reset();
    gameboard.instantiate();
    controller.getNextBtn().disabled = true;
    controller.getMessage().textContent = `(X) ${playerOne.getMark() === 'X' ? playerOne.getName() : playerTwo.getName()}'s turn`;

    cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.addEventListener('click', clickHandler, { once: true }));
  };

  const check = () => {
    const board = gameboard.get();

    for (let i = 0; i < board.length; i += 3) {
      if (board[i] && board[i] === board[i + 1] && board[i] === board[i + 2]) {
        over(board[i] === playerOne.getMark() ? playerOne : playerTwo);
        return;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (board[i] && board[i] === board[i + 3] && board[i] === board[i + 6]) {
        over(board[i] === playerOne.getMark() ? playerOne : playerTwo);
        return;
      }
    }

    if (board[0] && board[0] === board[4] && board[0] === board[8]) {
      over(board[0] === playerOne.getMark() ? playerOne : playerTwo);
      return;
    }

    if (board[2] && board[2] === board[4] && board[2] === board[6]) {
      over(board[2] === playerOne.getMark() ? playerOne : playerTwo);
      return;
    }

    for (let i = 0; i < board.length; i++) {
      if (!board[i]) return;
    }

    over();
  };

  const over = (winner = null) => {
    cells.forEach(cell => {
      cell.removeEventListener('click', clickHandler);
    });

    controller.getNextBtn().disabled = false;

    if (winner) {
      controller.getMessage().textContent = `(${winner.getMark()}) ${winner.getName()} wins!`;
    }
    else controller.getMessage().textContent = 'Draw';
  };

  const clickHandler = e => {
    const index = parseInt(e.target.getAttribute('index'));

    const freeCells = gameboard.get().reduce((count, value) => {
      if (value === '') count++;
      return count;
    }, 0);

    let mark;

    if (freeCells % 2 !== 0) {
      mark = playerOne.getMark();
      controller.getMessage().textContent = `(${playerTwo.getMark()}) ${playerTwo.getName()}'s turn`;
    }
    else {
      mark = playerTwo.getMark();
      controller.getMessage().textContent = `(${playerOne.getMark()}) ${playerOne.getName()}'s turn`;
    }

    gameboard.set(index, mark);
    gameboard.update(cells);
    check(playerOne, playerTwo);
  };

  return { start };
})();

const controller = (() => {
  const message = document.querySelector('.message');

  const startBtn = document.querySelector('#start');
  const nextBtn = document.querySelector('#next');
  const endBtn = document.querySelector('#end');

  const p1 = document.querySelector('#p1');
  const p2 = document.querySelector('#p2');

  let playerOne;
  let playerTwo;

  startBtn.addEventListener('click', () => {
    if (!p1.value || !p2.value) return;
  
    p1.disabled = true;
    p2.disabled = true;
    startBtn.style.display = 'none';
    document.querySelector('.buttons').style.display = 'block';
  
    playerOne = Player(p1.value);
    playerTwo = Player(p2.value);
  
    game.start(playerOne, playerTwo);
  });

  nextBtn.addEventListener('click', () => {
    game.start(playerOne, playerTwo);
  });

  endBtn.addEventListener('click', () => {
    p1.disabled = false;
    p2.disabled = false;
    startBtn.style.display = 'inline';
    document.querySelector('.buttons').style.display = 'none';
    message.textContent = 'Type your names and start the game!';
  });

  const getNextBtn = () => nextBtn;
  const getMessage = () => message;

  return { getNextBtn, getMessage };
})();
