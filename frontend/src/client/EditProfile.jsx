import React, { useEffect, useState } from 'react';
import api from './api/axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Edit, Save, ArrowLeft } from 'lucide-react';

function EditProfile() {
    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        username: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await api.get('/client/profile');
            console.log('API Response:', res.data); // Debug log
            // Access user data from the nested user object
            const userData = res.data.user || {};
            setForm({
                name: userData.firstName || '',
                surname: userData.lastName || '',
                email: userData.email || '',
                username: userData.username || ''
            });
        } catch (err) {
            console.error('Profile load error:', err);
            alert('Could not load profile.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const isEmptyOrWhitespace = (value) => !value || String(value).trim() === "";

        if (isEmptyOrWhitespace(form.name) ||
            isEmptyOrWhitespace(form.surname) ||
            isEmptyOrWhitespace(form.email)) {
            alert("Please fill all required fields.");
            return;
        }

        // Optional: Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            await api.put('/client/profile/update', {
                firstName: form.name,
                lastName: form.surname,
                email: form.email,
                password: '' // Optional: include password field only if needed
            });
            alert('Profile updated!');
            navigate('/client/home');
        } catch (err) {
            alert('Update failed.');
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

    const profileCardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '500px',
        position: 'relative'
    };

    const backButtonStyle = {
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        background: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
        padding: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        color: '#6b7280'
    };

    const logoContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem',
        marginTop: '1rem'
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

    const inputRowStyle = {
        display: 'flex',
        gap: '1rem'
    };

    const inputGroupStyle = {
        position: 'relative',
        flex: 1
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

    const inputDisabledStyle = {
        ...inputStyle,
        backgroundColor: 'rgba(243, 244, 246, 0.8)',
        color: '#9ca3af',
        cursor: 'not-allowed'
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

    const labelStyle = {
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem',
        display: 'block'
    };

    return (
        <div style={containerStyle}>
            <div style={profileCardStyle}>
                <button
                    style={backButtonStyle}
                    onClick={() => navigate('/client/home')}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <ArrowLeft size={16} />
                </button>

                <div style={logoContainerStyle}>
                    <div style={logoStyle}>
                        <Edit size={32} color="white" />
                    </div>
                    <h2 style={titleStyle}>Edit Profile</h2>
                    <p style={subtitleStyle}>Update your personal information</p>
                </div>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={inputRowStyle}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>First Name</label>
                            <div style={iconStyle}>
                                <User size={16} />
                            </div>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                                style={inputStyle}
                                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Last Name</label>
                            <div style={iconStyle}>
                                <User size={16} />
                            </div>
                            <input
                                name="surname"
                                value={form.surname}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                                style={inputStyle}
                                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                            />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Email Address</label>
                        <div style={iconStyle}>
                            <Mail size={16} />
                        </div>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            type="email"
                            required
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, { borderColor: '#d1d5db', boxShadow: 'none' })}
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Username (Read Only)</label>
                        <div style={iconStyle}>
                            <User size={16} />
                        </div>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username"
                            disabled
                            style={inputDisabledStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Save size={16} />
                        <span>Save Changes</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;