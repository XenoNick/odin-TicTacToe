const gameBoard = (() => {
  const board = [];
  const display = () => [...board];
  const setUp = () => {
    for (let i = 0; i < 9; i++) {
      board[i] = null;
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
  setUp();
  return { display, setUp, update };
})();

const playerCreator = (name, marker) => {};
