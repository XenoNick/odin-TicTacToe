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
  const addPlayers = (...newPlayers) => {
    const [player1, player2] = newPlayers;
    if (players[0]) {
      players.pop();
      players.pop();
    }
    players.push(player1);
    players.push(player2);
  };
  const getPlayers = () => [...players];
  return { getCurrentMarkers, reset, update, addPlayers, getPlayers };
})();

const playerCreator = (name, marker) => {
  marker = marker.toUpperCase();
  const player = { name, marker };
  const getName = () => player.name;
  const getMarker = () => player.marker;
  return { getName, getMarker };
};

const displayController = (() => {
  const tiles = [...document.querySelectorAll('.tiles')];
  const markers = [...document.querySelectorAll('.marker')];
  const menu = document.querySelector('.player-menu');
  const inputs = document.querySelectorAll('input');
  const button = document.querySelector('.Pcreate-button');
  const startButton = document.querySelector('.title button');
  const altButtons = document.querySelectorAll('.alt-buttons');
  const title = document.querySelector('h1');
  const exitButton = menu.querySelector('.exit');
  let currentTurn = null;

  startButton.addEventListener('click', () => {
    menu.classList.add('show-menu');
  });

  const checkInputValidity = () => {
    for (const input of inputs) {
      if (!input.validity.valid) return false;
    }
    return true;
  };

  const victoryCheck = (currentPlayer) => {
    const currBoard = gameBoard.getCurrentMarkers();
    const winningSets = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < winningSets.length; i++) {
      let matches = 0;
      for (let j = 0; j < winningSets[i].length; j++) {
        if (currBoard[winningSets[i][j]] === currentPlayer.getMarker()) {
          matches++;
        }
      }
      if (matches === 3) {
        return true;
      }
    }
    return false;
  };

  const activateTiles = function ({ target }) {
    if (target === this) {
      const tileText = this.childNodes[0];
      if (tileText.textContent !== '') return;
      const [player1, player2] = gameBoard.getPlayers();
      tileText.textContent = currentTurn.getMarker();
      gameBoard.update(
        +this.getAttribute('data-index'),
        currentTurn.getMarker()
      );
      if (victoryCheck(currentTurn)) {
        title.textContent = `${currentTurn.getName()} wins!`;
        disableGame();
        const scores = [...document.querySelectorAll('.score-container')];
        scores.forEach((score) => {
          const name = score.children[0].textContent;
          console.log(name);
          if (name.slice(0, name.length - 1) === currentTurn.getName()) {
            score.children[1].textContent = `${
              +score.children[1].textContent + 1
            }`;
          }
        });
      } else {
        if (currentTurn === player1) {
          currentTurn = player2;
        } else {
          currentTurn = player1;
        }
        title.textContent = `${currentTurn.getName()}s turn!`;
      }
    }
  };

  const resetDisplay = () => {
    enableGame();
    const [player1] = gameBoard.getPlayers();
    gameBoard.reset(null);
    markers.forEach((elm) => {
      elm.textContent = '';
    });
    currentTurn = player1;
    title.textContent = `${currentTurn.getName()}s turn!`;
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

  const setupDisplay = () => {
    const [player1, player2] = gameBoard.getPlayers();
    menu.classList.remove('show-menu');
    resetDisplay();
    enableGame();
    title.textContent = `${player1.getName()}s turn!`;
    document.querySelector('.p1-name').textContent = `${player1.getName()}:`;
    document.querySelector('.p2-name').textContent = `${player2.getName()}:`;
    document.querySelectorAll('.player-score')[0].textContent = '0';
    document.querySelectorAll('.player-score')[1].textContent = '0';
    if (!startButton.classList.contains('hidden')) {
      startButton.classList.add('hidden');
      altButtons.forEach((buttons) => {
        buttons.classList.remove('hidden');
      });
      altButtons[0].addEventListener('click', resetDisplay);
      altButtons[1].addEventListener('click', () => {
        disableGame();
        menu.classList.add('show-menu');
        if (exitButton.classList.contains('hidden')) {
          exitButton.classList.remove('hidden');
          exitButton.addEventListener('click', () => {
            enableGame();
            menu.classList.remove('show-menu');
          });
        }
      });
    }
  };

  button.addEventListener('click', () => {
    if (!checkInputValidity()) return;
    const [p1Name, p1Marker, p2Name, p2Marker] = inputs;
    const player1 = playerCreator(p1Name.value, p1Marker.value);
    const player2 = playerCreator(p2Name.value, p2Marker.value);
    p1Name.value = p2Name.value = p1Marker.value = p2Marker.value = '';
    gameBoard.addPlayers(player1, player2);
    currentTurn = player1;
    setupDisplay();
  });
  return { enableGame, disableGame, resetDisplay };
})();
