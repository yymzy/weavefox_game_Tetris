import React from 'react';

const GameInfo = ({ score, level, lines, nextPiece }) => {
  // 方块颜色映射
  const getColor = (value) => {
    const colors = [
      'bg-transparent', // 空白
      'bg-cyan-500', // I
      'bg-blue-500', // J
      'bg-orange-500', // L
      'bg-yellow-500', // O
      'bg-green-500', // S
      'bg-purple-500', // T
      'bg-red-500' // Z
    ];
    return colors[value] || 'bg-transparent';
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="pixel-border bg-slate-800 p-4">
        <h2 className="text-xl font-bold mb-3 text-center text-cyan-400">游戏信息</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>分数:</span>
            <span className="font-mono font-bold">{score}</span>
          </div>
          
          <div className="flex justify-between">
            <span>等级:</span>
            <span className="font-mono font-bold">{level}</span>
          </div>
          
          <div className="flex justify-between">
            <span>行数:</span>
            <span className="font-mono font-bold">{lines}</span>
          </div>
        </div>
      </div>
      
      <div className="pixel-border bg-slate-800 p-4">
        <h2 className="text-xl font-bold mb-3 text-center text-cyan-400">下一个</h2>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-1 w-24 h-24">
            {nextPiece && nextPiece.shape.flat().map((cell, index) => (
              <div 
                key={index} 
                className={`tetris-block ${getColor(cell)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
