import React from 'react';

const GameOverModal = ({ score, onRestart, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="pixel-border bg-slate-800 p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-red-400">游戏结束</h2>
        
        <div className="text-center mb-6">
          <p className="text-lg mb-2">最终得分</p>
          <p className="text-3xl font-bold text-cyan-400">{score}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onRestart}
            className="pixel-button flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            再玩一次
          </button>
          <button 
            onClick={onClose}
            className="pixel-button flex-1 bg-slate-600 hover:bg-slate-700"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
