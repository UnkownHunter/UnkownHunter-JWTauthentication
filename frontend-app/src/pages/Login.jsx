import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { login } from '../api/auth';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('admin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card card animate-fade-in">
                <div className="auth-header">
                    <div className="auth-icon">
                        <LogIn size={28} />
                    </div>
                    <h2>Welcome Back</h2>
                    <p>Login to manage your tasks securely.</p>
                </div>

                {error && <div className="auth-error animate-fade-in">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form flex flex-col gap-sm">
                    <Input
                        label="Username"
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="primary" isLoading={loading} className="auth-submit">
                        Sign In
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
