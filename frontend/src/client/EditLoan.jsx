import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, MapPin, GraduationCap, Heart, DollarSign, Calendar, Briefcase, Plus, Trash2, Save, Mail, Phone } from 'lucide-react';
import api from './api/axios';

function EditLoan() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
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

    useEffect(() => {
        loadLoan();
    }, []);

    const loadLoan = async () => {
        try {
            const res = await api.get(`/client/loans/${id}`);
            const data = res.data;
            setForm({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                fatherName: data.fatherName || '',
                birthDate: data.birthDate || '',
                birthPlace: data.birthPlace || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                educationLevel: data.educationLevel || '',
                maritalStatus: data.maritalStatus || '',
                requestedAmount: data.requestedAmount || '',
                currency: data.currency || '',
                durationMonths: data.durationMonths || '',
                loanType: data.loanType || ''
            });
            if (data.incomes) setIncomes(data.incomes);
        } catch (err) {
            alert('Failed to load loan data.');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleIncomeChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...incomes];
        updated[index][name] = value;
        setIncomes(updated);
    };

    const addIncome = () => {
        setIncomes([...incomes, { incomeType: '', amount: '', currency: '', since: '' }]);
    };

    const removeIncome = (index) => {
        const updated = incomes.filter((_, i) => i !== index);
        setIncomes(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/client/loans/${id}`, {
                ...form,
                incomes: incomes
            });
            alert('Loan updated!');
            navigate('/client/home');
        } catch (err) {
            alert('Update failed.');
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

    const formStyle = {
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
        gap: '1.5rem',
        marginBottom: '1.5rem'
    };

    const inputGroupStyle = {
        marginBottom: '1rem'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '0.875rem',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.2s',
        boxSizing: 'border-box'
    };

    const selectStyle = {
        ...inputStyle,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '2.5rem'
    };

    const incomeCardStyle = {
        backgroundColor: 'rgba(249, 250, 251, 0.8)',
        border: '1px solid rgba(229, 231, 235, 0.5)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1rem',
        position: 'relative'
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s'
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white'
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#374151',
        border: '1px solid #d1d5db'
    };

    const dangerButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fca5a5',
        padding: '0.5rem',
        position: 'absolute',
        top: '1rem',
        right: '1rem'
    };

    const getFieldIcon = (fieldName) => {
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
            case 'fatherName': return <User size={16} />;
            case 'birthDate': return <Calendar size={16} />;
            case 'birthPlace': return <MapPin size={16} />;
            case 'email': return <Mail size={16} />;
            case 'phoneNumber': return <Phone size={16} />;
            case 'educationLevel': return <GraduationCap size={16} />;
            case 'maritalStatus': return <Heart size={16} />;
            case 'requestedAmount': return <DollarSign size={16} />;
            case 'currency': return <DollarSign size={16} />;
            case 'durationMonths': return <Calendar size={16} />;
            case 'loanType': return <CreditCard size={16} />;
            default: return <User size={16} />;
        }
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
                            <h2 style={titleStyle}>Edit Loan Application</h2>
                            <p style={subtitleStyle}>Update your loan application details</p>
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
                <form onSubmit={handleSubmit}>
                    {/* Personal Information Section */}
                    <div style={formStyle}>
                        <div style={sectionHeaderStyle}>
                            <User size={20} color="#2563eb" />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                Personal Information
                            </h3>
                        </div>
                        <div style={sectionContentStyle}>
                            <div style={gridStyle}>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('firstName')}
                                            First Name
                                        </div>
                                    </label>
                                    <input
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        placeholder="Enter your first name"
                                        disabled
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('lastName')}
                                            Last Name
                                        </div>
                                    </label>
                                    <input
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        placeholder="Enter your last name"
                                        disabled
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('fatherName')}
                                            Father's Name
                                        </div>
                                    </label>
                                    <input
                                        name="fatherName"
                                        value={form.fatherName}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        placeholder="Enter your father's name"
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('birthDate')}
                                            Birth Date
                                        </div>
                                    </label>
                                    <input
                                        name="birthDate"
                                        type="date"
                                        value={form.birthDate}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('birthPlace')}
                                            Birth Place
                                        </div>
                                    </label>
                                    <input
                                        name="birthPlace"
                                        value={form.birthPlace}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        placeholder="Enter your birth place"
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('email')}
                                            Email
                                        </div>
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        placeholder="Enter your email"
                                        disabled
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('phoneNumber')}
                                            Phone Number
                                        </div>
                                    </label>
                                    <input
                                        name="phoneNumber"
                                        type="tel"
                                        value={form.phoneNumber}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        placeholder="Enter your phone number"
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('educationLevel')}
                                            Education Level
                                        </div>
                                    </label>
                                    <select
                                        name="educationLevel"
                                        value={form.educationLevel}
                                        onChange={handleFormChange}
                                        style={selectStyle}
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    >
                                        <option value="Pa Arsim">Pa Arsim</option>
                                        <option value="Arsim Fillor">Arsim Fillor</option>
                                        <option value="Shkolle e Mesme">Shkolle e Mesme</option>
                                        <option value="Arsim I Larte">Arsim I Larte</option>
                                        <option value="Doktorature">Doktorature</option>
                                    </select>
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('maritalStatus')}
                                            Civil Status
                                        </div>
                                    </label>
                                    <select
                                        name="maritalStatus"
                                        value={form.maritalStatus}
                                        onChange={handleFormChange}
                                        style={selectStyle}
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    >
                                        <option value="Beqar">Beqar</option>
                                        <option value="I Martuar">I Martuar</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loan Details Section */}
                    <div style={{ ...formStyle, marginTop: '2rem' }}>
                        <div style={sectionHeaderStyle}>
                            <CreditCard size={20} color="#2563eb" />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                Loan Details
                            </h3>
                        </div>
                        <div style={sectionContentStyle}>
                            <div style={gridStyle}>
                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('requestedAmount')}
                                            Requested Amount
                                        </div>
                                    </label>
                                    <input
                                        name="requestedAmount"
                                        type="number"
                                        value={form.requestedAmount}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        placeholder="Enter amount"
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('currency')}
                                            Currency
                                        </div>
                                    </label>
                                    <select
                                        name="currency"
                                        value={form.currency}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    >
                                        <option value="EUR">EUR</option>
                                        <option value="ALL">ALL</option>
                                    </select>
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('durationMonths')}
                                            Duration (Months)
                                        </div>
                                    </label>
                                    <input
                                        name="durationMonths"
                                        type="number"
                                        value={form.durationMonths}
                                        onChange={handleFormChange}
                                        style={inputStyle}
                                        placeholder="Enter duration in months"
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div style={inputGroupStyle}>
                                    <label style={labelStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getFieldIcon('loanType')}
                                            Loan Type
                                        </div>
                                    </label>
                                    <select
                                        name="loanType"
                                        value={form.loanType}
                                        onChange={handleFormChange}
                                        style={selectStyle}
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    >
                                        <option value="Kredi personale">Kredi personale</option>
                                        <option value="Kredi per shtepi">Kredi per shtepi</option>
                                        <option value="Kredi per makine">Kredi per makine</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Income Information Section */}
                    <div style={{ ...formStyle, marginTop: '2rem' }}>
                        <div style={sectionHeaderStyle}>
                            <Briefcase size={20} color="#2563eb" />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                                Income Information
                            </h3>
                            <button
                                type="button"
                                onClick={addIncome}
                                style={{
                                    ...secondaryButtonStyle,
                                    marginLeft: 'auto',
                                    padding: '0.5rem 1rem',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'}
                            >
                                <Plus size={16} />
                                <span>Add Income</span>
                            </button>
                        </div>
                        <div style={sectionContentStyle}>
                            {incomes.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                    <Briefcase size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                                    <p>No income sources added yet. Click "Add Income" to get started.</p>
                                </div>
                            ) : (
                                incomes.map((income, index) => (
                                    <div key={index} style={incomeCardStyle}>
                                        {incomes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeIncome(index)}
                                                style={{
                                                    ...dangerButtonStyle,
                                                    transition: 'background-color 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                        <h4 style={{
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            color: '#374151',
                                            margin: '0 0 1rem 0'
                                        }}>
                                            Income Source {index + 1}
                                        </h4>
                                        <div style={gridStyle}>
                                            <div style={inputGroupStyle}>
                                                <label style={labelStyle}>Income Type</label>
                                                <select
                                                    name="incomeType"
                                                    value={income.incomeType || ''}
                                                    onChange={(e) => handleIncomeChange(index, e)}
                                                    style={selectStyle}
                                                    required
                                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                >
                                                    <option value="Paga">Paga</option>
                                                    <option value="Qera">Qera</option>
                                                    <option value="Biznesi">Biznesi</option>
                                                </select>
                                            </div>
                                            <div style={inputGroupStyle}>
                                                <label style={labelStyle}>Amount</label>
                                                <input
                                                    name="amount"
                                                    type="number"
                                                    value={income.amount + "" || ""}
                                                    onChange={(e) => handleIncomeChange(index, e)}
                                                    style={inputStyle}
                                                    placeholder="Enter amount"
                                                    required
                                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                />
                                            </div>
                                            <div style={inputGroupStyle}>
                                                <label style={labelStyle}>Currency</label>
                                                <select
                                                    name="currency"
                                                    value={income.currency || ''}
                                                    onChange={(e) => handleIncomeChange(index, e)}
                                                    style={selectStyle}
                                                    required
                                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                >
                                                    <option value="ALL">ALL</option>
                                                    <option value="EUR">EUR</option>
                                                </select>
                                            </div>
                                            <div style={inputGroupStyle}>
                                                <label style={labelStyle}>Since</label>
                                                <input
                                                    name="since"
                                                    type="date"
                                                    value={income.since || ''}
                                                    onChange={(e) => handleIncomeChange(index, e)}
                                                    style={inputStyle}
                                                    placeholder="e.g., 2025-06-30"
                                                    required
                                                    onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button
                            type="submit"
                            style={{
                                ...primaryButtonStyle,
                                padding: '1rem 2rem',
                                fontSize: '1rem',
                                transition: 'transform 0.2s ease' // Add transition
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Save size={20} />
                            <span>Update Loan Application</span>
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
}

export default EditLoan;