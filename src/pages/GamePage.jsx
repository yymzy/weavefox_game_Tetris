import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import GameControls from '../components/GameControls';
import GameInfo from '../components/GameInfo';
import GameOverModal from '../components/GameOverModal';

const GamePage = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameOver
  const [board, setBoard] = useState([]);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(1000); // ms
  const [showGameOver, setShowGameOver] = useState(false);
  const gameLoopRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('tetrisUser') || 'null');

  // 初始化游戏
  const initGame = useCallback(() => {
    // 创建空的游戏板
    const newBoard = Array(20).fill().map(() => Array(10).fill(0));
    setBoard(newBoard);
    
    // 生成初始方块
    const newPiece = {
      shape: getRandomPiece(),
      x: 4,
      y: 0
    };
    
    const nextNewPiece = {
      shape: getRandomPiece(),
      x: 0,
      y: 0
    };
    
    setCurrentPiece(newPiece);
    setNextPiece(nextNewPiece);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameSpeed(1000);
    setGameState('playing');
  }, []);

  // 获取随机方块
  const getRandomPiece = () => {
    const pieces = {
      I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      O: [
        [1, 1],
        [1, 1]
      ],
      S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ]
    };
    
    const pieceNames = Object.keys(pieces);
    const randPiece = pieceNames[Math.floor(Math.random() * pieceNames.length)];
    return pieces[randPiece];
  };

  // 旋转方块
  const rotatePiece = (piece) => {
    const rows = piece.shape.length;
    const cols = piece.shape[0].length;
    const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        rotated[x][rows - 1 - y] = piece.shape[y][x];
      }
    }
    
    return rotated;
  };

  // 检查碰撞
  const checkCollision = (piece, board, offsetX = 0, offsetY = 0) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardX = piece.x + x + offsetX;
          const boardY = piece.y + y + offsetY;
          
          if (
            boardX < 0 || 
            boardX >= board[0].length || 
            boardY >= board.length ||
            (boardY >= 0 && board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // 合并方块到游戏板
  const mergePieceToBoard = (piece, board) => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          
          // 确保不会访问超出边界的位置
          if (boardY >= 0 && boardY < newBoard.length && boardX >= 0 && boardX < newBoard[0].length) {
            newBoard[boardY][boardX] = piece.shape[y][x];
          }
        }
      }
    }
    
    return newBoard;
  };

  // 清除完整的行
  const clearLines = (board) => {
    let linesCleared = 0;
    const newBoard = [...board];
    
    for (let y = board.length - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(10).fill(0));
        linesCleared++;
        y++; // 重新检查当前行
      }
    }
    
    return { newBoard, linesCleared };
  };

  // 更新分数
  const updateScore = (linesCleared) => {
    if (linesCleared > 0) {
      const linePoints = [0, 40, 100, 300, 1200];
      const newScore = score + linePoints[linesCleared] * level;
      setScore(newScore);
      
      const newLines = lines + linesCleared;
      setLines(newLines);
      
      // 每10行升一级
      const newLevel = Math.floor(newLines / 10) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setGameSpeed(Math.max(100, 1000 - (newLevel - 1) * 100)); // 每级增加速度
      }
    }
  };

  // 游戏循环
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;
    
    setBoard(prevBoard => {
      if (!currentPiece) return prevBoard;
      
      // 尝试下移
      if (!checkCollision(currentPiece, prevBoard, 0, 1)) {
        setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }));
        return prevBoard;
      }
      
      // 无法下移，合并方块
      const mergedBoard = mergePieceToBoard(currentPiece, prevBoard);
      const { newBoard, linesCleared } = clearLines(mergedBoard);
      
      // 更新分数
      updateScore(linesCleared);
      
      // 生成新方块
      const newPiece = {
        shape: nextPiece.shape,
        x: 4,
        y: 0
      };
      
      const newNextPiece = {
        shape: getRandomPiece(),
        x: 0,
        y: 0
      };
      
      // 检查游戏结束
      if (checkCollision(newPiece, newBoard)) {
        setGameState('gameOver');
        setShowGameOver(true);
        return newBoard;
      }
      
      setCurrentPiece(newPiece);
      setNextPiece(newNextPiece);
      return newBoard;
    });
  }, [currentPiece, nextPiece, gameState, level, lines, score]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 阻止上下键触发页面滚动
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (gameState !== 'playing') return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (!checkCollision(currentPiece, board, -1, 0)) {
            setCurrentPiece(prev => ({ ...prev, x: prev.x - 1 }));
          }
          break;
        case 'ArrowRight':
          if (!checkCollision(currentPiece, board, 1, 0)) {
            setCurrentPiece(prev => ({ ...prev, x: prev.x + 1 }));
          }
          break;
        case 'ArrowDown':
          if (!checkCollision(currentPiece, board, 0, 1)) {
            setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }));
          }
          break;
        case 'ArrowUp':
          const rotated = rotatePiece(currentPiece);
          if (!checkCollision({ ...currentPiece, shape: rotated }, board)) {
            setCurrentPiece(prev => ({ ...prev, shape: rotated }));
          }
          break;
        case ' ':
          // 瞬间下落
          let piece = { ...currentPiece };
          while (!checkCollision(piece, board, 0, 1)) {
            piece.y += 1;
          }
          setCurrentPiece(piece);
          break;
        case 'p':
        case 'P':
          setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPiece, board, gameState]);

  // 游戏循环定时器
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, gameSpeed);
    } else {
      clearInterval(gameLoopRef.current);
    }
    
    return () => clearInterval(gameLoopRef.current);
  }, [gameLoop, gameSpeed, gameState]);

  // 开始游戏
  const startGame = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    initGame();
  };

  // 暂停/继续游戏
  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  // 重新开始游戏
  const restartGame = () => {
    setShowGameOver(false);
    initGame();
  };

  // 保存分数
  const saveScore = () => {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('tetrisUsers') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex !== -1) {
      if (score > users[userIndex].highScore) {
        users[userIndex].highScore = score;
        users[userIndex].lastScore = score;
        localStorage.setItem('tetrisUsers', JSON.stringify(users));
        
        // 更新当前用户
        const updatedUser = { ...currentUser, highScore: score, lastScore: score };
        localStorage.setItem('tetrisUser', JSON.stringify(updatedUser));
      } else {
        users[userIndex].lastScore = score;
        localStorage.setItem('tetrisUsers', JSON.stringify(users));
        
        // 更新当前用户
        const updatedUser = { ...currentUser, lastScore: score };
        localStorage.setItem('tetrisUser', JSON.stringify(updatedUser));
      }
    }
  };

  // 游戏结束时保存分数
  useEffect(() => {
    if (gameState === 'gameOver') {
      saveScore();
    }
  }, [gameState]);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-cyan-400">
        俄罗斯方块
      </h1>
      
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex-1">
          <GameBoard 
            board={board} 
            currentPiece={currentPiece} 
            gameState={gameState}
          />
        </div>
        
        <div className="w-full md:w-64 flex flex-col gap-6">
          <GameInfo 
            score={score}
            level={level}
            lines={lines}
            nextPiece={nextPiece}
          />
          
          <GameControls 
            gameState={gameState}
            onStart={startGame}
            onPause={togglePause}
            onRestart={restartGame}
          />
        </div>
      </div>
      
      {showGameOver && (
        <GameOverModal 
          score={score}
          onRestart={restartGame}
          onClose={() => setShowGameOver(false)}
        />
      )}
    </div>
  );
};

export default GamePage;
