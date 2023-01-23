import React, { useEffect, useState } from "react";
import "./Board.css";

//current block status
type BlockStatus = {
  blockIndex: number;
  x: number;
  y: number;
  rotation: number;
};
//init board
let board: number[][] = [];

for (let y = -1; y < 21; y++) {
  board[y] = [];
  for (let x = -1; x < 11; x++) {
    if (y === 20 || x < 0 || x >= 10) {
      board[y][x] = 1;
    } else board[y][x] = 0;
  }
}

// erase full lines
const eraseLine = () => {
  console.log(board);
  for (let y = 0; y < 20; y++) {
    let removable = true;
    for (let x = 0; x < 10; x++) {
      if (board[y][x] === 0) removable = false;
    }
    if (removable) {
      for (let j = y; j >= -1; j--) {
        for (let x = 0; x < 10; x++) {
          board[j][x] = j === -1 ? 0 : board[j - 1][x];
        }
        y--;
      }
      console.log(board);
    }
  }
};
//block shapes
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

//check if the block can be placed at the specified position
const putBlock = (
  blockStatus: BlockStatus,
  remove: boolean = false,
  action: boolean = false
) => {
  let { blockIndex, x, y, rotation } = blockStatus;
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
    putBlock(blockStatus, remove, true);
  }
  return true;
};

//Generate board
const createBoard = () => {
  return [...new Array(200)].map((_, i) => {
    var edgeColor, bgColor;
    let v = board[Math.floor(i / 10)][i % 10];
    edgeColor = v === 0 ? "#888" : `hsl(${((v - 1) / 7) * 360}deg, 100%, 70%)`;
    bgColor = v === 0 ? "#ccc" : `hsl(${((v - 1) / 7) * 360}deg, 100%, 50% )`;
    return (
      <div
        className="square"
        style={{ backgroundColor: bgColor, border: `4px ridge ${edgeColor}` }}
      ></div>
    );
  });
};

//Check if the block can move to the specified direction
const move = (dx: number, dy: number, dr: number, blockStatus: BlockStatus) => {
  let { blockIndex: ci, x: cx, y: cy, rotation: cr } = blockStatus;
  putBlock(blockStatus, true);
  if (putBlock({ blockIndex: ci, x: cx + dx, y: cy + dy, rotation: cr + dr })) {
    cx += dx;
    cy += dy;
    cr += dr;
    return true;
  } else {
    putBlock(blockStatus);
    return false;
  }
};

const Board = () => {
  const initBlock: BlockStatus = {
    blockIndex: Math.trunc(Math.random() * 7 + 1),
    x: 4,
    y: 0,
    rotation: Math.trunc(Math.random() * 4),
  };
  const [block, setBoard] = useState<BlockStatus>(initBlock);
  const [gameOver, setGameOver] = useState<boolean>(false);
  //Block fall down and if it can't fall down, generate a new block
  useEffect(() => {
    const blockFall = setInterval(() => {
      if (move(0, 1, 0, block)) setBoard({ ...block, y: block.y + 1 });
      else {
        // erase full lines
        eraseLine();
        //check if the block can be placed at the initial position
        if (putBlock(initBlock)) {
          setBoard(initBlock);
        } else if (!gameOver) {
          // Game over and color the board red
          board.forEach((row, y) => {
            row.forEach((_, x) => {
              if (board[y][x] !== 0) board[y][x] = 1;
            });
          });
          // game over
          setGameOver(true);
        }
      }
    }, 500);
    return () => clearInterval(blockFall);
  }, [block]);

  // Keyboard control
  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          move(-1, 0, 0, block) ? setBoard({ ...block, x: block.x - 1 }) : null;
          break;
        case "ArrowRight":
          move(1, 0, 0, block) ? setBoard({ ...block, x: block.x + 1 }) : null;
          break;
        case "ArrowUp":
          move(0, 0, 1, block)
            ? setBoard({ ...block, rotation: block.rotation + 1 })
            : null;
          break;
        case "ArrowDown":
          move(0, 1, 0, block) ? setBoard({ ...block, y: block.y + 1 }) : null;
          break;
      }
    };
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  }, [block]);

  //return board component
  return <React.Fragment>{createBoard()}</React.Fragment>;
};

export default Board;
