import React from 'react';

const GameBoard = ({ board, currentPiece, gameState }) => {
  // 创建显示板（包含当前方块）
  const displayBoard = () => {
    if (!board.length) return [];
    
    const newBoard = board.map(row => [...row]);
    
    // 添加当前方块到显示板
    if (currentPiece && gameState === 'playing') {
      const { shape, x, y } = currentPiece;
      
      for (let py = 0; py < shape.length; py++) {
        for (let px = 0; px < shape[py].length; px++) {
          if (shape[py][px] !== 0) {
            const boardY = y + py;
            const boardX = x + px;
            
            if (boardY >= 0 && boardY < newBoard.length && boardX >= 0 && boardX < newBoard[0].length) {
              newBoard[boardY][boardX] = shape[py][px];
            }
          }
        }
      }
    }
    
    return newBoard;
  };
  
  const renderedBoard = displayBoard();
  
  // 方块颜色映射
  const getColor = (value) => {
    const colors = [
      'bg-gray-900', // 空白
      'bg-cyan-500', // I
      'bg-blue-500', // J
      'bg-orange-500', // L
      'bg-yellow-500', // O
      'bg-green-500', // S
      'bg-purple-500', // T
      'bg-red-500' // Z
    ];
    return colors[value] || 'bg-gray-900';
  };
  
  return (
    <div className="pixel-border bg-slate-800 p-2 w-full">
      <div className="grid grid-cols-10 gap-px bg-slate-700 border-2 border-slate-600 w-full aspect-[1/2]">
        {renderedBoard.flat().map((cell, index) => (
          <div 
            key={index} 
            className={`aspect-square game-cell tetris-block ${getColor(cell)}`}
          />
        ))}
      </div>
      
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="text-2xl font-bold text-white">游戏暂停</div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
