import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { register } from '../services/authService.js';

export default function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }))
    }
    function validate() {
        if (!form.username || !form.email || !form.password) {
            return 'Please fill in all fields.';
        }
        if (form.password.length < 6) {
            return 'Please enter at least 6 characters.';
        }
        if (form.password !== form.confirmPassword) {
            return 'Password is not match.';
        }
        return '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        try {
            await register({
                username: form.username,
                email: form.email,
                password: form.password,
            });
            navigate('/login')
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="register-page">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Create an account</h2>

                {error && <p className="form-error">{error}</p>}

                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                />

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
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />

                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Register'}
                </button>

                <p className="form-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}