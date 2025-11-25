import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 获取用户数据
    const users = JSON.parse(localStorage.getItem('tetrisUsers') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      // 保存当前用户
      localStorage.setItem('tetrisUser', JSON.stringify(user));
      navigate('/');
      window.location.reload();
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="pixel-border bg-slate-800 p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-cyan-400">用户登录</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900 text-red-100 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pixel-border bg-slate-700 p-2"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pixel-border bg-slate-700 p-2"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full pixel-button bg-emerald-600 hover:bg-emerald-700 mt-6"
          >
            登录
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p>还没有账号？ <Link to="/register" className="text-cyan-400 hover:underline">立即注册</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
