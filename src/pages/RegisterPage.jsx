import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证密码
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    // 检查用户名是否已存在
    const users = JSON.parse(localStorage.getItem('tetrisUsers') || '[]');
    if (users.some(u => u.username === username)) {
      setError('用户名已存在');
      return;
    }
    
    // 创建新用户
    const newUser = {
      username,
      password,
      highScore: 0,
      lastScore: 0,
      registerDate: new Date().toISOString()
    };
    
    // 保存用户
    users.push(newUser);
    localStorage.setItem('tetrisUsers', JSON.stringify(users));
    
    // 自动登录
    localStorage.setItem('tetrisUser', JSON.stringify(newUser));
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="pixel-border bg-slate-800 p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-cyan-400">用户注册</h1>
        
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
          
          <div>
            <label className="block mb-2">确认密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pixel-border bg-slate-700 p-2"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full pixel-button bg-cyan-600 hover:bg-cyan-700 mt-6"
          >
            注册
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p>已有账号？ <Link to="/login" className="text-cyan-400 hover:underline">立即登录</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
