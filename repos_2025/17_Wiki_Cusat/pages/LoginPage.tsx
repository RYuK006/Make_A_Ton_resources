import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import './Auth.css';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Logging in with:', email, password);
        // Logic to redirect to map after success
    };

    return (
        <div className="auth-container bento-container">
            <div className="auth-card bento-box animate-fade-up">
                <div className="auth-header">
                    <h1 className="text-gradient">Welcome Back</h1>
                    <p className="subtitle">Sign in to your Wiki CUSAT account</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />
                            <input 
                                type="email" 
                                placeholder="name@email.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label>Password</label>
                            <a href="#" className="forgot-link">Forgot?</a>
                        </div>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit">
                        Sign In <LogIn size={18} />
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <a href="/signup" className="auth-link">Create one for free <ArrowRight size={14} /></a></p>
                </div>
            </div>
        </div>
    );
};
