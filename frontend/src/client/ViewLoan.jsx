import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, MapPin, GraduationCap, Heart, DollarSign, Calendar, Briefcase, Eye } from 'lucide-react';
import api from './api/axios';

function ViewLoan() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loanData, setLoanData] = useState({
        firstName: '',
        lastName: '',
        fatherName: '',
        birthDate: '',
        birthPlace: '',
        email: '',
        phoneNumber: '',
        educationLevel: '',
        maritalStatus: '',
        requestedAmount: '',
        currency: '',
        durationMonths: '',
        loanType: ''
    });

    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLoan();
    }, []);

    const loadLoan = async () => {
        try {
            const res = await api.get(`/client/loans/${id}`);
            const data = res.data;
            setLoanData({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                fatherName: data.fatherName || '',
                birthDate: data.birthDate || '',
                birthPlace: data.birthPlace || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber | '',
                educationLevel: data.educationLevel || '',
                maritalStatus: data.maritalStatus || '',
                requestedAmount: data.requestedAmount || '',
                currency: data.currency || '',
                durationMonths: data.durationMonths || '',
                loanType: data.loanType || ''
            });
            if (data.incomes) setIncomes(data.incomes);
            setLoading(false);
        } catch (err) {
            alert('Failed to load loan data.');
            setLoading(false);
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

    const backButtonStyle = {
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

    const mainStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem'
    };

    const cardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    };

    const sectionHeaderStyle = {
        padding: '1.5rem',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    };

    const sectionContentStyle = {
        padding: '1.5rem'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
    };

    const fieldStyle = {
        marginBottom: '1.5rem'
    };

    const labelStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
    };

    const valueStyle = {
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(249, 250, 251, 0.8)',
        border: '1px solid rgba(229, 231, 235, 0.5)',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#111827',
        fontWeight: '500'
    };

    const incomeCardStyle = {
        backgroundColor: 'rgba(249, 250, 251, 0.8)',
        border: '1px solid rgba(229, 231, 235, 0.5)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1rem'
    };

    const getFieldIcon = (fieldName) => {
        switch (fieldName) {
            case 'birthDate': return <Calendar size={16} />;
            case 'birthPlace': return <MapPin size={16} />;
            case 'address': return <MapPin size={16} />;
            case 'educationLevel': return <GraduationCap size={16} />;
            case 'maritalStatus': return <Heart size={16} />;
            case 'requestedAmount': return <DollarSign size={16} />;
            case 'currency': return <DollarSign size={16} />;
            case 'durationMonths': return <Calendar size={16} />;
            case 'loanType': return <CreditCard size={16} />;
            default: return <User size={16} />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <div style={{ textAlign: 'center', color: '#6b7280' }}>
                        <CreditCard size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                        <p>Loading loan details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            {/* Header */}
            <header style={headerStyle}>
                <div style={headerContentStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={logoStyle}>
                            <Eye size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={titleStyle}>Loan Application Details</h2>
                            <p style={subtitleStyle}>View your loan application information</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/client/home')}
                        style={{
                            ...backButtonStyle,
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Home</span>
                    </button>
                </div>
            </header>

            <main style={mainStyle}>
                {/* Personal Information Section */}
                <div style={cardStyle}>
                    <div style={sectionHeaderStyle}>
                        <User size={20} color="#2563eb" />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Personal Information
                        </h3>
                    </div>
                    <div style={sectionContentStyle}>
                        <div style={gridStyle}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('firstName')}
                                    First Name
                                </label>
                                <div style={valueStyle}>
                                    {loanData.firstName}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('lastName')}
                                    Last Name
                                </label>
                                <div style={valueStyle}>
                                    {loanData.lastName}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('fatherName')}
                                    Father's Name
                                </label>
                                <div style={valueStyle}>
                                    {loanData.fatherName}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('birthDate')}
                                    Birth Date
                                </label>
                                <div style={valueStyle}>
                                    {formatDate(loanData.birthDate)}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('birthPlace')}
                                    Birth Place
                                </label>
                                <div style={valueStyle}>
                                    {loanData.birthPlace || 'Not specified'}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('email')}
                                    Email
                                </label>
                                <div style={valueStyle}>
                                    {loanData.email || 'Not specified'}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('phoneNumber')}
                                    Phone Number
                                </label>
                                <div style={valueStyle}>
                                    {loanData.phoneNumber || 'Not specified'}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('educationLevel')}
                                    Education Level
                                </label>
                                <div style={valueStyle}>
                                    {loanData.educationLevel || 'Not specified'}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('maritalStatus')}
                                    Marital Status
                                </label>
                                <div style={valueStyle}>
                                    {loanData.maritalStatus || 'Not specified'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Details Section */}
                <div style={{ ...cardStyle, marginTop: '2rem' }}>
                    <div style={sectionHeaderStyle}>
                        <CreditCard size={20} color="#2563eb" />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Loan Details
                        </h3>
                    </div>
                    <div style={sectionContentStyle}>
                        <div style={gridStyle}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('requestedAmount')}
                                    Requested Amount
                                </label>
                                <div style={valueStyle}>
                                    {loanData.requestedAmount}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('currency')}
                                    Currency
                                </label>
                                <div style={valueStyle}>
                                    {loanData.currency || 'Not specified'}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('durationMonths')}
                                    Duration
                                </label>
                                <div style={valueStyle}>
                                    {loanData.durationMonths ? `${loanData.durationMonths} months` : 'Not specified'}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>
                                    {getFieldIcon('loanType')}
                                    Loan Type
                                </label>
                                <div style={valueStyle}>
                                    {loanData.loanType || 'Not specified'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Income Information Section */}
                <div style={{ ...cardStyle, marginTop: '2rem' }}>
                    <div style={sectionHeaderStyle}>
                        <Briefcase size={20} color="#2563eb" />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                            Income Information
                        </h3>
                    </div>
                    <div style={sectionContentStyle}>
                        {incomes.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                <Briefcase size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                                <p>No income sources available.</p>
                            </div>
                        ) : (
                            incomes.map((income, index) => (
                                <div key={index} style={incomeCardStyle}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: '#374151',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Income Source {index + 1}
                                    </h4>
                                    <div style={gridStyle}>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Income Type</label>
                                            <div style={valueStyle}>
                                                {income.incomeType || 'Not specified'}
                                            </div>
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Amount</label>
                                            <div style={valueStyle}>
                                                {income.amount}
                                            </div>
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Currency</label>
                                            <div style={valueStyle}>
                                                {income.currency || 'Not specified'}
                                            </div>
                                        </div>
                                        <div style={fieldStyle}>
                                            <label style={labelStyle}>Since</label>
                                            <div style={valueStyle}>
                                                {income.since || 'Not specified'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ViewLoan;