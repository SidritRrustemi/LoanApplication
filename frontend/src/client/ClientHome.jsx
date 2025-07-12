import { useEffect, useState } from 'react';
import api from './api/axios';
import { useNavigate } from 'react-router-dom';
import {LogOut, Plus, Edit2, Trash2, CreditCard, Clock, DollarSign, TrendingUp, User, Eye} from 'lucide-react';

function ClientHome() {
    const [applications, setApplications] = useState([]);
    const [user, setUser] = useState({ name: '', loginTime: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileAndLoans = async () => {
            try {
                const profileRes = await api.get('/client/profile');
                const { user, lastLoginTime } = profileRes.data;

                setUser({
                    name: user.username,
                    loginTime: lastLoginTime
                        ? new Date(lastLoginTime).toLocaleString()
                        : '-'
                });

                const loansRes = await api.get('/client/loans');
                setApplications(loansRes.data);
            } catch (err) {
                console.error('Error loading data:', err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    alert('Session expired or unauthorized. Please log in again.');
                    localStorage.clear();
                    navigate('/');
                }
            }
        };

        fetchProfileAndLoans();
    }, [navigate]);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/client/loans');
            setApplications(res.data);
            console.log(res.data); // Always log fresh data, not state
        } catch (err) {
            console.error('Error fetching applications:', err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.clear();
                navigate('/');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/client/loans/${id}`);
            await fetchApplications(); // Refresh list
        } catch (err) {
            alert('Could not delete application.');
        }
    };

    const handleEdit = (id) => {
        navigate(`/client/loans/${id}`);
    };

    const handleViewDetails = (id) => {
        navigate(`/client/loans/${id}/readonly`);
    };

    const handleLogout = async () => {
        try {
            if (user.loginTime && user.loginTime !== '-') {
                // Parse the localized string back to Date, then to ISO string
                const parsedDate = new Date(localStorage.getItem("loginTime"));
                const isoString = parsedDate.toISOString();  // this is ISO 8601 format

                await api.post('/client/logout', { loginTime: isoString });
            }
        } catch (err) {
            console.warn('Logout time save failed', err);
        } finally {
            localStorage.clear();
            navigate('/');
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return { color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' };
            case 'applied': return { color: '#2563eb', backgroundColor: '#eff6ff', borderColor: '#93c5fd' };
            case 'under review': return { color: '#d97706', backgroundColor: '#fffbeb', borderColor: '#fcd34d' };
            case 'rejected': return { color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fca5a5' };
            default: return { color: '#4b5563', backgroundColor: '#f9fafb', borderColor: '#d1d5db' };
        }
    };

    const getLoanTypeIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'personal': return <CreditCard size={16} />;
            case 'auto': return <TrendingUp size={16} />;
            case 'home': return <DollarSign size={16} />;
            default: return <CreditCard size={16} />;
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };

    const headerStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 10
    };

    const headerContentStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem'
    };

    const logoStyle = {
        width: '48px',
        height: '48px',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem'
    };

    const titleStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#111827',
        margin: 0
    };

    const subtitleStyle = {
        fontSize: '0.875rem',
        color: '#6b7280',
        margin: 0
    };

    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    };

    const navButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
        textDecoration: 'none',
        color: '#374151'
    };

    const primaryButtonStyle = {
        ...navButtonStyle,
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
        color: 'white'
    };

    const logoutButtonStyle = {
        ...navButtonStyle,
        color: '#dc2626',
        borderColor: '#fca5a5'
    };

    const mainStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem'
    };

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    };

    const statCardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        cursor: 'pointer'
    };

    const sectionStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    };

    const sectionHeaderStyle = {
        padding: '1.5rem',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse'
    };

    const thStyle = {
        padding: '0.75rem 1.5rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: 'rgba(249, 250, 251, 0.5)'
    };

    const tdStyle = {
        padding: '1rem 1.5rem',
        whiteSpace: 'nowrap',
        fontSize: '0.875rem'
    };

    const rowStyle = {
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        transition: 'background-color 0.15s'
    };

    const actionButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.15s'
    };

    const editButtonStyle = {
        ...actionButtonStyle,
        color: '#2563eb',
        backgroundColor: 'transparent'
    };

    const deleteButtonStyle = {
        ...actionButtonStyle,
        color: '#dc2626',
        backgroundColor: 'transparent'
    };

    const viewButtonStyle = {
        ...actionButtonStyle,
        color: '#2563eb',
        backgroundColor: '#eff6ff',
        border: '1px solid #93c5fd'
    };

    const emptyStateStyle = {
        padding: '3rem',
        textAlign: 'center'
    };

    const footerStyle = {
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
        color: '#6b7280'
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <header style={headerStyle}>
                <div style={headerContentStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={logoStyle}>
                            <CreditCard size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={titleStyle}>Hello, {user.name}</h2>
                            <p style={subtitleStyle}>Manage your loan applications</p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div style={navStyle}>
                        <button
                            onClick={() => navigate('/client/apply')}
                            style={primaryButtonStyle}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        >
                            <Plus size={16} />
                            <span>Apply for Loan</span>
                        </button>

                        <button
                            onClick={() => navigate('/client/profile')}
                            style={navButtonStyle}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <User size={16} />
                            <span>Edit Profile</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            style={logoutButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#fef2f2';
                                e.currentTarget.style.borderColor = '#f87171';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#fca5a5';
                            }}
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main style={mainStyle}>
                {/* Stats Cards */}
                <div style={statsGridStyle}>
                    <div
                        style={statCardStyle}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                                    Total Applications
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                                    {applications.length}
                                </p>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#dbeafe',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <CreditCard size={24} color="#2563eb" />
                            </div>
                        </div>
                    </div>

                    <div
                        style={statCardStyle}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                                    Approved
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                                    {applications.filter(app => app.status.toLowerCase() === 'approved').length}
                                </p>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#dcfce7',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TrendingUp size={24} color="#059669" />
                            </div>
                        </div>
                    </div>

                    <div
                        style={statCardStyle}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                                    Total Amount
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>
                                    ${applications.reduce((sum, app) => sum + app.requestedAmount, 0).toLocaleString()}
                                </p>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#ede9fe',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <DollarSign size={24} color="#7c3aed" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications Section */}
                <section style={sectionStyle}>
                    <div style={sectionHeaderStyle}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Your Loan Applications
                        </h3>
                    </div>

                    {applications.length === 0 ? (
                        <div style={emptyStateStyle}>
                            <div style={{
                                width: '96px',
                                height: '96px',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem auto'
                            }}>
                                <CreditCard size={48} color="#9ca3af" />
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: '0 0 0.5rem 0' }}>
                                You have no applications yet
                            </h3>
                            <p style={{ color: '#6b7280', margin: '0 0 1.5rem 0' }}>
                                Start your loan application journey today
                            </p>
                            <button
                                onClick={() => navigate('/client/apply')}
                                style={{
                                    ...primaryButtonStyle,
                                    padding: '0.75rem 1.5rem',
                                    fontSize: '1rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            >
                                <Plus size={20} />
                                <span>Apply for Your First Loan</span>
                            </button>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead>
                                <tr>
                                    <th style={thStyle}>Application ID</th>
                                    <th style={thStyle}>Amount</th>
                                    <th style={thStyle}>Duration</th>
                                    <th style={thStyle}>Type</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {applications.map((app) => (
                                    <tr
                                        key={app.id}
                                        style={rowStyle}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.3)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '0.75rem',
                                                    color: 'white',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500'
                                                }}>
                                                    {app.id}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontWeight: '600', color: '#111827' }}>
                                                {app.requestedAmount} {app.currency}
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', color: '#374151' }}>
                                                <Clock size={16} style={{ marginRight: '0.25rem' }} />
                                                {app.durationMonths} months
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', color: '#374151' }}>
                                                {getLoanTypeIcon(app.loanType)}
                                                <span style={{ marginLeft: '0.5rem' }}>{app.loanType}</span>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                                <span style={{
                                                    ...getStatusColor(app.status),
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '500',
                                                    border: '1px solid'
                                                }}>
                                                    {app.status}
                                                </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleViewDetails(app.id)}
                                                    style={viewButtonStyle}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                                >
                                                    <Eye size={14} />
                                                    <span>View</span>
                                                </button>

                                                {app.status === 'Applied' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(app.id)}
                                                            style={editButtonStyle}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            <Edit2 size={16} />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(app.id)}
                                                            style={deleteButtonStyle}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            <Trash2 size={16} />
                                                            <span>Delete</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Footer */}
                <footer style={footerStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} />
                        <span>Last login: {user.loginTime}</span>
                    </div>
                    <div style={{ color: '#9ca3af' }}>
                        © 2025 Loan Management System
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default ClientHome;