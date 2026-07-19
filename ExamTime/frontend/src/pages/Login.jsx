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
                <h2>Login ExamTime</h2>

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

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Login'}
                </button>

                <p className="form-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
}