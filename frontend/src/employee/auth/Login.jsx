import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, Lock, LogIn } from 'lucide-react';
import api from '../api/axios';

function EmployeeLogin() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post('/auth/login_employee', credentials);
            const { token, username, role } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);
            const now = new Date();
            const loginTime = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + 'T' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');
            localStorage.setItem("loginTime", loginTime);

            if (role === 'bank_employee') navigate('/employee/home');
            else alert('Unknown user role');
        } catch (err) {
            alert('Invalid login credentials');
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
    };

    const loginCardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '400px'
    };

    const logoContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem'
    };

    const logoStyle = {
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
    };

    const titleStyle = {
        fontSize: '1.875rem',
        fontWeight: 'bold',
        color: '#111827',
        margin: '0 0 0.5rem 0',
        textAlign: 'center'
    };

    const subtitleStyle = {
        fontSize: '0.875rem',
        color: '#6b7280',
        margin: 0,
        textAlign: 'center'
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    };

    const inputGroupStyle = {
        position: 'relative'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem 0.75rem 3rem',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '0.875rem',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s',
        outline: 'none',
        boxSizing: 'border-box'
    };

    const inputFocusStyle = {
        borderColor: '#2563eb',
        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
    };

    const iconStyle = {
        position: 'absolute',
        left: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af',
        pointerEvents: 'none'
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '0.5rem'
    };

    const linkStyle = {
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#6b7280',
        marginTop: '1.5rem'
    };

    const linkAnchorStyle = {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: '500'
    };

    return (
        <div style={containerStyle}>
            <div style={loginCardStyle}>
                <div style={logoContainerStyle}>
                    <div style={logoStyle}>
                        <CreditCard size={32} color="white" />
                    </div>
                    <h2 style={titleStyle}>Welcome Back</h2>
                    <p style={subtitleStyle}>Sign in to your employee account</p>
                </div>

                <form onSubmit={handleLogin} style={formStyle}>
                    <div style={inputGroupStyle}>
                        <div style={iconStyle}>
                            <User size={16} />
                        </div>
                        <input
                            name="username"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <div style={iconStyle}>
                            <Lock size={16} />
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                        />
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        <LogIn size={16} />
                        <span>Sign In</span>
                    </button>

                    <p style={linkStyle}>
                        Are you a client?{' '}
                        <a
                            href="/"
                            style={linkAnchorStyle}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                            Login here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default EmployeeLogin;