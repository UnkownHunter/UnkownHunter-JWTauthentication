import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { register } from '../api/auth';
import './Auth.css'; // Reusing auth styles

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            await register(username, password);
            // Auto redirect to login on success
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card card animate-fade-in">
                <div className="auth-header">
                    <div className="auth-icon">
                        <UserPlus size={28} />
                    </div>
                    <h2>Create Account</h2>
                    <p>Sign up to start managing your tasks.</p>
                </div>

                {error && <div className="auth-error animate-fade-in">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form flex flex-col gap-sm">
                    <Input
                        label="Username"
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="primary" isLoading={loading} className="auth-submit">
                        Sign Up
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
