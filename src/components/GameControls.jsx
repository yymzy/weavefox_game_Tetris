import React from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

const GameControls = ({ gameState, onStart, onPause, onRestart }) => {
  return (
    <div className="pixel-border bg-slate-800 p-4">
      <h2 className="text-xl font-bold mb-3 text-center text-cyan-400">控制</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {gameState === 'menu' || gameState === 'gameOver' ? (
          <button 
            onClick={onStart}
            className="col-span-2 pixel-button flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Play size={18} />
            <span>开始游戏</span>
          </button>
        ) : (
          <>
            <button 
              onClick={onPause}
              className="pixel-button flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-700"
            >
              {gameState === 'playing' ? (
                <>
                  <Pause size={18} />
                  <span>暂停</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span>继续</span>
                </>
              )}
            </button>
            
            <button 
              onClick={onRestart}
              className="pixel-button flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-700"
            >
              <RefreshCw size={18} />
              <span>重新开始</span>
            </button>
          </>
        )}
      </div>
      
      <div className="mt-4 text-sm text-slate-400">
        <p className="mb-1">操作说明:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>← → 移动</li>
          <li>↑ 旋转</li>
          <li>↓ 加速下落</li>
          <li>空格 瞬间下落</li>
          <li>P 暂停/继续</li>
        </ul>
      </div>
    </div>
  );
};

export default GameControls;
