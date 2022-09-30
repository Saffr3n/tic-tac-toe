const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;

  return { getName, getMark };
};

const gameboard = (() => {
  let board = (new Array(9)).fill('');

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

  const update = cells => {
    for (let i = 0; i < cells.length; i++)
      cells[i].textContent = board[i];
  };

  return { get, set, reset, instantiate, update };
})();

const game = (() => {
  gameboard.instantiate();
  const cells = document.querySelectorAll('.cell');

  const start = (playerOne, playerTwo) => {
    cells.forEach(cell => cell.addEventListener('click', () => {
      const index = parseInt(cell.getAttribute('index'));

      const freeCells = gameboard.get().reduce((count, value) => {
        if (value === '') count++;
        return count;
      }, 0);

      const mark = freeCells % 2 !== 0 ? playerOne.getMark() : playerTwo.getMark();
      gameboard.set(index, mark);
      gameboard.update(cells);
    }, { once: true }));
  };

  const over = () => {

  };

  return { start };
})();

// TEST AREA
const p1 = Player('p1', 'X');
const p2 = Player('p2', 'O');
game.start(p1, p2);
