import { useEffect, useState } from 'react';
import api from './api/axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, BarChart3, TrendingUp, DollarSign, CreditCard, FileText, User, ChevronLeft, ChevronRight, PieChart, Download, Calendar, Filter, RefreshCw, ArrowUp, ArrowDown, Minus } from 'lucide-react';

function Reports() {
    const [reports, setReports] = useState([]);
    const [summaryStats, setSummaryStats] = useState({
        totalApplications: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalPending: 0,
        approvalRate: 0,
        averageAmount: 0,
        totalVolume: 0
    });
    const [user, setUser] = useState({ name: '', loginTime: '' });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month');
    const [reportType, setReportType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(15);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReportsData();
    }, [dateRange, reportType]);

    // Pagination calculations
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(reports.length / reportsPerPage);

    const fetchReportsData = async () => {
        try {
            setLoading(true);

            // Fetch user profile
            const profileRes = await api.get('/client/profile');
            const { user: userInfo, lastLoginTime } = profileRes.data;
            setUser({
                name: userInfo.username || 'Employee',
                loginTime: lastLoginTime ? new Date(lastLoginTime).toLocaleString() : '-'
            });

            // Fetch loan applications for reports
            const loansRes = await api.get('/employee/loans');
            const applications = loansRes.data;

            // Filter applications based on date range and type
            const filteredApplications = filterApplications(applications, dateRange, reportType);
            setReports(filteredApplications);

            // Calculate summary statistics
            const stats = calculateSummaryStats(filteredApplications);
            setSummaryStats(stats);

        } catch (err) {
            console.error('Error loading reports data:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert('Session expired or unauthorized. Please log in again.');
                localStorage.clear();
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = (applications, dateRange, reportType) => {
        let filtered = [...applications];

        // Filter by date range
        const now = new Date();
        const startDate = new Date();

        switch (dateRange) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        filtered = filtered.filter(app => {
            const appDate = new Date(app.createdAt);
            return appDate >= startDate;
        });

        // Filter by report type
        if (reportType !== 'all') {
            filtered = filtered.filter(app => app.status?.toLowerCase() === reportType);
        }

        return filtered;
    };

    const calculateSummaryStats = (applications) => {
        const total = applications.length;
        const approved = applications.filter(app => app.status?.toLowerCase() === 'approved').length;
        const rejected = applications.filter(app => app.status?.toLowerCase() === 'rejected').length;
        const pending = applications.filter(app =>
            app.status?.toLowerCase() === 'applied' ||
            app.status?.toLowerCase() === 'evaluation'
        ).length;

        const approvalRate = total > 0 ? (approved / total * 100).toFixed(1) : 0;
        const totalVolume = applications.reduce((sum, app) => sum + (parseFloat(app.requestedAmount) || 0), 0);
        const averageAmount = total > 0 ? (totalVolume / total).toFixed(2) : 0;

        return {
            totalApplications: total,
            totalApproved: approved,
            totalRejected: rejected,
            totalPending: pending,
            approvalRate: parseFloat(approvalRate),
            averageAmount: parseFloat(averageAmount),
            totalVolume: totalVolume
        };
    };

    const handleLogout = async () => {
        try {
            if (user.loginTime && user.loginTime !== '-') {
                const parsedDate = new Date(localStorage.getItem("loginTime"));
                const isoString = parsedDate.toISOString();
                await api.post('/employee/logout', { loginTime: isoString });
            }
        } catch (err) {
            console.warn('Logout time save failed', err);
        } finally {
            localStorage.clear();
            navigate('/');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleExportReport = () => {
        // Export functionality
        const csvContent = generateCSVReport();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `loan_reports_${dateRange}_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generateCSVReport = () => {
        const headers = ['Application ID', 'Client Name', 'Amount', 'Duration', 'Type', 'Status', 'Date'];
        const rows = reports.map(app => [
            app.id,
            app.firstName + app.lastName || app.username || 'N/A',
            `${app.requestedAmount} ${app.currency || 'EUR'}`,
            `${app.durationMonths} months`,
            app.loanType,
            app.status,
            new Date(app.createdAt).toLocaleDateString()
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return { color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' };
            case 'applied': return { color: '#2563eb', backgroundColor: '#eff6ff', borderColor: '#93c5fd' };
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

    const getChangeIcon = (value) => {
        if (value > 0) return <ArrowUp size={16} color="#059669" />;
        if (value < 0) return <ArrowDown size={16} color="#dc2626" />;
        return <Minus size={16} color="#64748b" />;
    };

    // Styles (same as the original component)
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
        overflow: 'hidden',
        marginBottom: '2rem'
    };

    const sectionHeaderStyle = {
        padding: '1.5rem',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
        backgroundColor: 'rgba(248, 250, 252, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const filtersStyle = {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
    };

    const selectStyle = {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        backgroundColor: 'white',
        fontSize: '0.875rem',
        cursor: 'pointer'
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

    const exportButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s'
    };

    if (loading) {
        return (
            <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={loadingStyle}></div>
                    <div style={{ fontSize: '1.5rem', color: '#64748b' }}>Loading Reports...</div>
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
                            <PieChart size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={titleStyle}>Reports & Analytics</h2>
                            <p style={subtitleStyle}>Comprehensive loan application reports</p>
                        </div>
                    </div>

                    <nav style={navStyle}>
                        <button
                            onClick={() => navigate('/employee/home')}
                            style={navButtonStyle}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <BarChart3 size={16} />
                            <span>Dashboard</span>
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
                                    Total Applications
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
                                    {summaryStats.totalApplications}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    {getChangeIcon(5)}
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>vs last period</span>
                                </div>
                            </div>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#eff6ff',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FileText size={24} color="#1e40af" />
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
                                    Approval Rate
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                                    {summaryStats.approvalRate}%
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    {getChangeIcon(2.5)}
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>vs last period</span>
                                </div>
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
                                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', margin: '0 0 0.5rem 0' }}>
                                    Average Amount
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>
                                    €{summaryStats.averageAmount.toLocaleString()}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    {getChangeIcon(-1.2)}
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>vs last period</span>
                                </div>
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
                                <DollarSign size={24} color="#7c3aed" />
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
                                    Total Volume
                                </p>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
                                    €{summaryStats.totalVolume.toLocaleString()}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                    {getChangeIcon(8.3)}
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>vs last period</span>
                                </div>
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
                                <BarChart3 size={24} color="#dc2626" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Controls */}
                <section style={sectionStyle}>
                    <div style={sectionHeaderStyle}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                            Report Filters
                        </h3>
                        <div style={filtersStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={16} color="#64748b" />
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    style={selectStyle}
                                >
                                    <option value="week">Last Week</option>
                                    <option value="month">Last Month</option>
                                    <option value="quarter">Last Quarter</option>
                                    <option value="year">Last Year</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Filter size={16} color="#64748b" />
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    style={selectStyle}
                                >
                                    <option value="all">All Applications</option>
                                    <option value="applied">Applied</option>
                                    <option value="evaluation">Under Evaluation</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <button
                                onClick={fetchReportsData}
                                style={navButtonStyle}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                <RefreshCw size={16} />
                                <span>Refresh</span>
                            </button>

                            <button
                                onClick={handleExportReport}
                                style={exportButtonStyle}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                            >
                                <Download size={16} />
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Reports Table */}
                <section style={sectionStyle}>
                    <div style={sectionHeaderStyle}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                            Detailed Reports
                        </h3>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            {reports.length} applications found
                        </div>
                    </div>

                    {reports.length === 0 ? (
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
                                <PieChart size={48} color="#64748b" />
                            </div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                                No reports found
                            </h3>
                            <p style={{ color: '#64748b', margin: 0 }}>
                                Try adjusting your filters to see more results
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
                                        <th style={thStyle}>Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentReports.map((app) => (
                                        <tr key={app.id}>
                                            <td style={tdStyle}>{app.id}</td>
                                            <td style={tdStyle}>{(app.firstName + " " + app.lastName) || 'N/A'}</td>
                                            <td style={tdStyle}>{`${app.requestedAmount} ${app.currency || 'EUR'}`}</td>
                                            <td style={tdStyle}>{`${app.durationMonths} months`}</td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {getLoanTypeIcon(app.loanType)}
                                                    <span style={{ marginLeft: '0.5rem' }}>{app.loanType}</span>
                                                </div>
                                            </td>
                                            <td style={tdStyle}>
                                                    <span style={{
                                                        color: getStatusColor(app.status).color,
                                                        backgroundColor: getStatusColor(app.status).backgroundColor,
                                                        border: `1px solid ${getStatusColor(app.status).borderColor}`,
                                                        borderRadius: '8px',
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {app.status}
                                                    </span>
                                            </td>
                                            <td style={tdStyle}>{new Date(app.applicationDate || app.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            <div style={paginationStyle}>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    style={currentPage === 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                    <span>Previous</span>
                                </button>
                                <div>
                                    Page {currentPage} of {totalPages}
                                </div>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    style={currentPage === totalPages ? paginationButtonDisabledStyle : paginationButtonStyle}
                                    disabled={currentPage === totalPages}
                                >
                                    <span>Next</span>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer style={footerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} />
                    <span>Last login: {user.loginTime}</span>
                </div>
                <div style={{ color: '#94a3b8' }}>
                    © 2025 Bank Employee Management System
                </div>
            </footer>
        </div>
    );
}

export default Reports;