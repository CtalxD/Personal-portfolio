import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid access code');
      setPassword('');
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">🔐</div>
          <h1 className="login-title">Admin Access</h1>
          <p className="login-subtitle">Enter secret code to continue</p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="password"
              className="login-input"
              placeholder="Enter secret code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-button">
              Verify Access
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;