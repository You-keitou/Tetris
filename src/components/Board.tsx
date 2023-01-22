import React, { useState } from "react";
import "./Board.css";

const board: Number[][] = [];

for (let y = -1; y < 21; y++) {
  board[y] = [];
  for (let x = -1; x < 11; x++) {
    if (y === 20 || x < 0 || x >= 10) {
      board[y][x] = 1;
    } else board[y][x] = 0;
  }
}

const blockShapes = [
  [0, []],
  [2, [-1, 0], [1, 0], [2, 0]], //tetris
  [2, [-1, 0], [0, 1], [1, 1]], //key 1
  [2, [-1, 0], [0, -1], [1, -1]], //key 2
  [1, [0, 1], [1, 0], [1, 1]], // square
  [4, [-1, 0], [1, 0], [1, 1]], // l1
  [4, [-1, 0], [1, 0], [1, -1]], // L2
  [4, [-1, 0], [0, 1], [0, -1]], // T
];

const clearLine = () => {
  for (let y = 0; y < 20; y++) {
    let removable: Boolean = true;
    for (let x = 0; x < 10; x++) {
      if (board[y][x] === 0) {
        removable = false;
        break;
      }
    }
    if (removable) {
      for (let j = y; j >= -1; j--) {
        for (let x = 0; x < 10; x++) {
          board[j][x] = j === -1 ? 0 : board[j - 1][x];
        }
      }
    }
  }
};

const putBlock = (
  blockIndex: Number,
  x: Number,
  y: Number,
  rotation: Number,
  remove: Boolean = false,
  action: Boolean = false
) => {
  const blockShape = [...blockShapes[blockIndex]];
  const rotateMax = blockShape.shift();
  blockShape.unshift([0, 0]);
  for (let [dy, dx] of blockShape) {
    for (let i = 0; i < rotation % rotateMax; i++) {
      [dx, dy] = [dy, -dx];
    }
    if (remove) {
      board[y + dy][x + dx] = 0;
    } else {
      if (board[y + dy][x + dx]) {
        return false;
      }
      if (action) {
        board[y + dy][x + dx] = blockIndex;
      }
    }
  }
  if (!action) {
    putBlock(blockIndex, x, y, rotation, remove, true);
  }
  return true;
};

const createBlock = () => {
  clearLine();
  let ci = Math.trunc(Math.random() * 7 + 1),
    cr = Math.trunc(Math.random() * 4),
    cx = 4,
    cy = 0;
  if (!putBlock(ci, cx, cy, cr)) {
  }
};

const createBoard = () => {
  const list = [];
  var edgeColor, bgColor;
  for (let i = 0; i < 200; i++) {
    let v = board[Math.floor(i / 10)][i % 10];
    edgeColor = v === 0 ? "#888" : `hsl(${((v - 1) / 7) * 360}deg, 100%, 50%)`;
    bgColor = v === 0 ? "#ccc" : `hsl(${((v - 1) / 7) * 360}deg, 100%, 50% )`;
    if (v !== 0) console.log(bgColor);
    list.push(
      <div
        className="square"
        style={{ backgroundColor: bgColor, border: `4px ridge ${edgeColor}` }}
      ></div>
    );
  }
  return list;
};

const Board = () => {
  const [state, setState] = useState({
    field: board,
    isDroped: true,
  });
  if (state.isDroped) {
    createBlock();
    setState(() => ({
      field: board,
      isDroped: false,
    }));
  }
  const list = createBoard();
  return <React.Fragment>{list}</React.Fragment>;
};

export default Board;
