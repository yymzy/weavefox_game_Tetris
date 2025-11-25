import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Trophy, LogIn, UserPlus, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('tetrisUser') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('tetrisUser');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-slate-800 border-b-4 border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-cyan-400">
              <div className="w-3 h-3 bg-red-500"></div>
              <div className="w-3 h-3 bg-green-500"></div>
              <div className="w-3 h-3 bg-blue-500"></div>
              <span>Tetris</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-slate-700 transition-colors">
                <Home size={18} />
                <span>游戏</span>
              </Link>
              <Link to="/leaderboard" className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-slate-700 transition-colors">
                <Trophy size={18} />
                <span>排行榜</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-slate-700 px-3 py-1 rounded">
                  <User size={16} />
                  <span className="text-sm">{currentUser.username}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 rounded transition-colors"
                >
                  <LogOut size={16} />
                  <span>退出</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                >
                  <LogIn size={16} />
                  <span>登录</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded transition-colors"
                >
                  <UserPlus size={16} />
                  <span>注册</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
