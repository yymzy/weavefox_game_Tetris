import React, { useState, useEffect } from 'react';

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sortOption, setSortOption] = useState('highScore');

  useEffect(() => {
    // 获取用户数据
    const storedUsers = JSON.parse(localStorage.getItem('tetrisUsers') || '[]');
    const storedUser = JSON.parse(localStorage.getItem('tetrisUser') || 'null');
    
    setCurrentUser(storedUser);
    
    // 排序用户
    const sortedUsers = [...storedUsers].sort((a, b) => {
      if (sortOption === 'highScore') {
        return b.highScore - a.highScore;
      } else {
        return new Date(b.registerDate) - new Date(a.registerDate);
      }
    });
    
    setUsers(sortedUsers);
  }, [sortOption]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-cyan-400">排行榜</h1>
      
      <div className="pixel-border bg-slate-800 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold">玩家排名</h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setSortOption('highScore')}
              className={`pixel-button ${sortOption === 'highScore' ? 'bg-cyan-600' : 'bg-slate-700'}`}
            >
              按分数排序
            </button>
            <button 
              onClick={() => setSortOption('newest')}
              className={`pixel-button ${sortOption === 'newest' ? 'bg-cyan-600' : 'bg-slate-700'}`}
            >
              按注册时间
            </button>
          </div>
        </div>
      </div>
      
      <div className="pixel-border bg-slate-800 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-4 text-left">排名</th>
              <th className="p-4 text-left">玩家</th>
              <th className="p-4 text-left">最高分</th>
              <th className="p-4 text-left">最近得分</th>
              <th className="p-4 text-left">注册时间</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr 
                  key={user.username} 
                  className={`border-b border-slate-700 ${currentUser && user.username === currentUser.username ? 'bg-slate-750' : ''}`}
                >
                  <td className="p-4">
                    {index === 0 ? (
                      <span className="text-yellow-400 font-bold">#1</span>
                    ) : index === 1 ? (
                      <span className="text-gray-300 font-bold">#2</span>
                    ) : index === 2 ? (
                      <span className="text-amber-700 font-bold">#3</span>
                    ) : (
                      <span>#{index + 1}</span>
                    )}
                  </td>
                  <td className="p-4 font-mono">
                    {user.username}
                    {currentUser && user.username === currentUser.username && (
                      <span className="ml-2 text-xs bg-cyan-600 px-2 py-1 rounded">你</span>
                    )}
                  </td>
                  <td className="p-4 font-mono font-bold text-cyan-400">{user.highScore}</td>
                  <td className="p-4 font-mono">{user.lastScore}</td>
                  <td className="p-4 text-sm">
                    {new Date(user.registerDate).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  暂无玩家数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-center text-slate-400">
        <p>排行榜数据保存在本地浏览器中</p>
      </div>
    </div>
  );
};

export default LeaderboardPage;
