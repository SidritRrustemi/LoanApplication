import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, Lock, Mail, UserPlus, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        username: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/auth/register', formData);
            alert('Registration successful! You can now login.');
            navigate('/');
        } catch (error) {
            alert('Registration failed. Please try again.');
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

    const registerCardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px'
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
        gap: '1.25rem'
    };

    const inputRowStyle = {
        display: 'flex',
        gap: '1rem'
    };

    const inputGroupStyle = {
        position: 'relative',
        flex: 1
    };

    const inputGroupFullStyle = {
        position: 'relative',
        width: '100%'
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
        color: '#6b7280',
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

    const backButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        color: '#6b7280',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textDecoration: 'none',
        marginBottom: '1.5rem'
    };

    return (
        <div style={containerStyle}>
            <div style={registerCardStyle}>
                <a
                    href="/"
                    style={backButtonStyle}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#6b7280';
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Back to Login</span>
                </a>

                <div style={logoContainerStyle}>
                    <div style={logoStyle}>
                        <CreditCard size={32} color="white" />
                    </div>
                    <h2 style={titleStyle}>Create Account</h2>
                    <p style={subtitleStyle}>Join our loan management platform</p>
                </div>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={inputRowStyle}>
                        <div style={inputGroupStyle}>
                            <div style={iconStyle}>
                                <User size={16} />
                            </div>
                            <input
                                name="name"
                                placeholder="First Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <div style={iconStyle}>
                                <User size={16} />
                            </div>
                            <input
                                name="surname"
                                placeholder="Last Name"
                                value={formData.surname}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                            />
                        </div>
                    </div>

                    <div style={inputGroupFullStyle}>
                        <div style={iconStyle}>
                            <Mail size={16} />
                        </div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                        />
                    </div>

                    <div style={inputGroupFullStyle}>
                        <div style={iconStyle}>
                            <User size={16} />
                        </div>
                        <input
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                        />
                    </div>

                    <div style={inputGroupFullStyle}>
                        <div style={iconStyle}>
                            <Lock size={16} />
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
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
                        <UserPlus size={16} />
                        <span>Create Account</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;