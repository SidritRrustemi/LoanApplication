import { useEffect, useState } from 'react';
import api from './api/axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Eye, Check, X, Clock, BarChart3, TrendingUp, AlertCircle, DollarSign, CreditCard, FileText, User} from 'lucide-react';

function EmployeeHome() {
    const [applications, setApplications] = useState([]);
    const [summaryStats, setSummaryStats] = useState({
        pending: 0,
        inProgress: 0,
        approved: 0,
        rejected: 0,
        total: 0
    });
    const [user, setUser] = useState({ name: '', loginTime: '' });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [applicationsPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfileAndLoans();
    }, [navigate]);

    // Pagination calculations
    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);
    const totalPages = Math.ceil(applications.length / applicationsPerPage);

    const fetchProfileAndLoans = async () => {
        try {
            /*setLoading(true);*/
            const profileRes = await api.get('/client/profile');
            const { user: userInfo, lastLoginTime } = profileRes.data;

            setUser({
                name: userInfo.username || 'Employee',
                loginTime: lastLoginTime
                    ? new Date(lastLoginTime).toLocaleString()
                    : '-'
            });

            const loansRes = await api.get('/employee/loans');
            setApplications(loansRes.data);

            // Calculate summary stats from applications data
            const stats = loansRes.data.reduce((acc, app) => {
                acc.total++;
                switch (app.status.toLowerCase()) {
                    case 'applied':
                        acc.pending++;
                        break;
                    case 'evaluation':
                        acc.inProgress++;
                        break;
                    case 'approved':
                        acc.approved++;
                        break;
                    case 'rejected':
                        acc.rejected++;
                        break;
                }
                return acc;
            }, { pending: 0, inProgress: 0, approved: 0, rejected: 0, total: 0 });

            setSummaryStats(stats);
        } catch (err) {
            console.error('Error loading data:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.clear();
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await api.get('/employee/loans');
            setApplications(res.data);

            // Recalculate summary stats
            const stats = res.data.reduce((acc, app) => {
                acc.total++;
                switch (app.status.toLowerCase()) {
                    case 'applied':
                        acc.pending++;
                        break;
                    case 'evaluation':
                        acc.inProgress++;
                        break;
                    case 'approved':
                        acc.approved++;
                        break;
                    case 'rejected':
                        acc.rejected++;
                        break;
                }
                return acc;
            }, { pending: 0, inProgress: 0, approved: 0, rejected: 0, total: 0 });

            setSummaryStats(stats);
        } catch (err) {
            console.error('Error fetching applications:', err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.clear();
                navigate('/');
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.post(`/employee/loans/${id}/approve`);
            await fetchApplications(); // Refresh data
            alert('Loan approved successfully!');
        } catch (err) {
            console.error('Error approving loan:', err);
            alert('Could not approve loan. Please try again.');
        }
    };

    const handleReject = async (id) => {
        try {
            await api.post(`/employee/loans/${id}/reject`);
            await fetchApplications(); // Refresh data
            alert('Loan rejected successfully!');
        } catch (err) {
            console.error('Error rejecting loan:', err);
            alert('Could not reject loan. Please try again.');
        }
    };

    const handleEvaluate = async (id) => {
        try {
            await api.post(`/employee/loans/${id}/evaluate`);
            await fetchApplications(); // Refresh data
            alert('Loan set to evaluation!');
        } catch (err) {
            console.error('Error starting evaluation:', err);
            alert('Could not start evaluation. Please try again.');
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/employee/loans/${id}`);
    };

    const handleLogout = async () => {
        try {
            if (user.loginTime && user.loginTime !== '-') {
                // Parse the localized string back to Date, then to ISO string
                const parsedDate = new Date(localStorage.getItem("loginTime"));
                const isoString = parsedDate.toISOString();

                await api.post('/client/logout', { loginTime: isoString });
            }
        } catch (err) {
            console.warn('Logout time save failed', err);
        } finally {
            localStorage.clear();
            navigate('/employee_login');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return { color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' };
            case 'applied': return { color: '#2563eb', backgroundColor: '#eff6ff', borderColor: '#93c5fd' };
            case 'under review': return { color: '#d97706', backgroundColor: '#fffbeb', borderColor: '#fcd34d' };
            case 'evaluation': return { color: '#d97706', backgroundColor: '#fffbeb', borderColor: '#fcd34d' };
            case 'rejected': return { color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fca5a5' };
            default: return { color: '#4b5563', backgroundColor: '#f9fafb', borderColor: '#d1d5db' };
        }
    };

    const getLoanTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'personal': return <User size={16} />;
            case 'auto': return <TrendingUp size={16} />;
            case 'home': return <DollarSign size={16} />;
            default: return <CreditCard size={16} />;
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };

    const headerStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(203, 213, 225, 0.3)',
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
        background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '1rem'
    };

    const titleStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1e293b',
        margin: 0
    };

    const subtitleStyle = {
        fontSize: '0.875rem',
        color: '#64748b',
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
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
        textDecoration: 'none',
        color: '#475569'
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    };

    const statCardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s'
    };

    const sectionStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    };

    const sectionHeaderStyle = {
        padding: '1.5rem',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
        backgroundColor: 'rgba(248, 250, 252, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse'
    };

    const thStyle = {
        padding: '0.75rem 1.5rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: 'rgba(248, 250, 252, 0.7)'
    };

    const tdStyle = {
        padding: '1rem 1.5rem',
        fontSize: '0.875rem',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)'
    };

    const actionButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.375rem 0.75rem',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.75rem',
        fontWeight: '500',
        transition: 'all 0.15s',
        marginRight: '0.5rem'
    };

    const approveButtonStyle = {
        ...actionButtonStyle,
        color: '#059669',
        backgroundColor: '#ecfdf5',
        border: '1px solid #76db7a'
    };

    const rejectButtonStyle = {
        ...actionButtonStyle,
        color: '#dc2626',
        backgroundColor: '#fef2f2',
        border: '1px solid #fca5a5'
    };

    const evaluateButtonStyle = {
        ...actionButtonStyle,
        color: '#d97706',
        backgroundColor: '#fffbeb',
        border: '1px solid #fcd34d'
    };

    const viewButtonStyle = {
        ...actionButtonStyle,
        color: '#2563eb',
        backgroundColor: '#eff6ff',
        border: '1px solid #93c5fd'
    };

    const paginationStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        backgroundColor: 'rgba(248, 250, 252, 0.5)',
        borderTop: '1px solid rgba(226, 232, 240, 0.5)'
    };

    const paginationButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'white',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
        color: '#475569'
    };

    const paginationButtonDisabledStyle = {
        ...paginationButtonStyle,
        opacity: 0.5,
        cursor: 'not-allowed'
    };

    const footerStyle = {
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(226, 232, 240, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
        color: '#64748b'
    };

    const emptyStateStyle = {
        padding: '3rem',
        textAlign: 'center'
    };

    const loadingStyle = {
        width: '48px',
        height: '48px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #1e40af',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
    };

    if (loading) {
        return (
            <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={loadingStyle}></div>
                    <div style={{ fontSize: '1.5rem', color: '#64748b' }}>Loading...</div>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* Header */}
            <header style={headerStyle}>
                <div style={headerContentStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={logoStyle}>
                            <BarChart3 size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={titleStyle}>Welcome, {user.name}</h2>
                            <p style={subtitleStyle}>Bank Employee Dashboard</p>
                        </div>
                    </div>

                    <nav style={navStyle}>
                        <button
                            onClick={() => navigate('/employee/reports')}
                            style={navButtonStyle}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <FileText size={16} />
                            <span>Reports</span>
                        </button>

                        <button
                            onClick={() => navigate('/employee/profile')}
                            style={navButtonStyle}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <User size={16} />
                            <span>Profile</span>
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
                    </nav>
                </div>
            </header>

            <main style={mainStyle}>
                {/* Summary Statistics */}
                <div style={statsGridStyle}>
                    <div
                        style={statCardStyle}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', margin: '0 0 0.5rem 0' }}>
                                    Pending Applications
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>
                                    {summaryStats.pending}
                                </p>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Clock size={24} color="#7c3aed" />
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
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', margin: '0 0 0.5rem 0' }}>
                                    In Progress
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706', margin: 0 }}>
                                    {summaryStats.inProgress}
                                </p>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#fffbeb',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <AlertCircle size={24} color="#d97706" />
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
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', margin: '0 0 0.5rem 0' }}>
                                    Approved
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                                    {summaryStats.approved}
                                </p>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#ecfdf5',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Check size={24} color="#059669" />
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
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', margin: '0 0 0.5rem 0' }}>
                                    Rejected
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
                                    {summaryStats.rejected}
                                </p>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#fef2f2',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <X size={24} color="#dc2626" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Applications Table */}
                <section style={sectionStyle}>
                    <div style={sectionHeaderStyle}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                            Loan Applications Management
                        </h3>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {applications.length} total applications
                        </div>
                    </div>

                    {applications.length === 0 ? (
                        <div style={emptyStateStyle}>
                            <div style={{
                                width: '96px',
                                height: '96px',
                                backgroundColor: '#f1f5f9',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem auto'
                            }}>
                                <FileText size={48} color="#64748b" />
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                                No loan applications found
                            </h3>
                            <p style={{ color: '#64748b', margin: 0 }}>
                                Applications will appear here when submitted by clients
                            </p>
                        </div>
                    ) : (
                        <>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={tableStyle}>
                                    <thead>
                                    <tr>
                                        <th style={thStyle}>Application ID</th>
                                        <th style={thStyle}>Client Name</th>
                                        <th style={thStyle}>Amount</th>
                                        <th style={thStyle}>Duration</th>
                                        <th style={thStyle}>Type</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentApplications.map((app) => (
                                        <tr
                                            key={app.id}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.5)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
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
                                                <div style={{ fontWeight: '500', color: '#1e293b' }}>
                                                    {(app.firstName + " " + app.lastName) || 'N/A'}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>
                                                    {app.requestedAmount} {app.currency || 'EUR'}
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>
                                                    <Clock size={16} style={{ marginRight: '0.25rem' }} />
                                                    {app.durationMonths} months
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>
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
                                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <button
                                                        onClick={() => handleViewDetails(app.id)}
                                                        style={viewButtonStyle}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                                    >
                                                        <Eye size={14} />
                                                        <span>View</span>
                                                    </button>

                                                    {app.status?.toLowerCase() === 'applied' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleEvaluate(app.id)}
                                                                style={evaluateButtonStyle}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                                                            >
                                                                <AlertCircle size={14} />
                                                                <span>Evaluate</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleApprove(app.id)}
                                                                style={approveButtonStyle}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1fae5'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                                                            >
                                                                <Check size={14} />
                                                                <span>Approve</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(app.id)}
                                                                style={rejectButtonStyle}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                            >
                                                                <X size={14} />
                                                                <span>Reject</span>
                                                            </button>
                                                        </>
                                                    )}

                                                    {app.status?.toLowerCase() === 'evaluation' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(app.id)}
                                                                style={approveButtonStyle}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1fae5'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                                                            >
                                                                <Check size={14} />
                                                                <span>Approve</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(app.id)}
                                                                style={rejectButtonStyle}
                                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                            >
                                                                <X size={14} />
                                                                <span>Reject</span>
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
                        </>
                    )}
                </section>                {/* Footer */}
                <footer style={footerStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} />
                        <span>Last login: {user.loginTime}</span>
                    </div>
                    <div style={{ color: '#94a3b8' }}>
                        © 2025 Bank Employee Management System
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default EmployeeHome;