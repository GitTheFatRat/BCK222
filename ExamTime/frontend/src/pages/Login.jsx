import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice.js';
import { login } from '../services/authService.js';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || '/'

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }
    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!form.email || !form.password) {
            setError('All fields are required')
            return
        }
        setIsSubmitting(true);
        try {
            const data = await login(form)
            dispatch(loginSuccess(data));
            navigate(redirectTo, { replace: true })
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to login, please try again'
            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit} className="login-form">
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, var(--et-primary), var(--et-accent))', color: 'white', fontWeight: 800, fontFamily: 'Outfit, sans-serif', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '20px', letterSpacing: '1px', marginBottom: '8px', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)' }}>
                        ExamTime
                    </div>
                </div>
                <h2 style={{ marginBottom: '8px' }}>Welcome Back</h2>
                <p style={{ textAlign: 'center', color: 'var(--et-text-muted)', marginBottom: '24px', fontSize: '15px' }}>Sign in to continue your preparation.</p>

                {error && <p className="form-error">{error}</p>}

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="[EMAIL_ADDRESS]"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                />

                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '8px', width: '100%' }}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="form-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}