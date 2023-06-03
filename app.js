const gameBoard = (() => {
  const board = [];
  const players = [];
  const getCurrentMarkers = () => [...board];
  const reset = (pieces) => {
    for (let i = 0; i < 9; i++) {
      board[i] = pieces;
    }
  };
  const update = (index, marker) => {
    if (index >= 9 || index < 0) {
      console.log('Invalid index!');
      return;
    }
    if (!marker) {
      console.log('Missing marker!');
      return;
    }
    board[index] = marker;
  };
  return { getCurrentMarkers, reset, update };
})();

const playerCreator = (name, marker) => {
  const player = { name, marker };
  const getName = () => player.name;
  const getMarker = () => player.marker;
  const setMarker = (newMark) => {
    if (typeof newMark !== 'string' || newMark.length !== 1) {
      console.log('Not a string or exceeds required length of 1!');
      return;
    }
    player.marker = newMark.toUpperCase();
  };
  return { getName, getMarker, setMarker };
};

const displayController = (() => {
  const tiles = [...document.querySelectorAll('.tiles')];
  const markers = [...document.querySelectorAll('.marker')];

  const activateTiles = function ({ target }) {
    if (target === this) {
      const tileText = this.childNodes[0];
      if (tileText.textContent !== '') return;
      tileText.textContent = 'X';
      gameBoard.update(+this.getAttribute('data-index'), 'X');
    }
  };

  const resetDisplay = () => {
    gameBoard.reset(null);
    markers.forEach((elm) => {
      elm.textContent = '';
    });
  };

  const enableGame = () => {
    tiles.forEach((elm) => {
      elm.addEventListener('click', activateTiles);
    });
  };

  const disableGame = () => {
    tiles.forEach((elm) => {
      elm.removeEventListener('click', activateTiles);
    });
  };
  return { enableGame, disableGame, resetDisplay };
})();

document.querySelector('.title button').addEventListener('click', () => {
  const menu = document.querySelector('.player-menu');
  menu.classList.add('show-menu');
});
