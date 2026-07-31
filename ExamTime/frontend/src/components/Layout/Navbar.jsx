import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../../store/slices/authSlice.js';

export default function Navbar() {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleLogout() {
        dispatch(logout());
        navigate('/login', { replace: true });
    }

    return (
        <header className="navbar">
            <Link to="/" className="navbar__brand">
                <span className="navbar__brand-mark">IELTS</span>
                <span className="navbar__brand-name">ExamTime</span>
            </Link>

            {isAuthenticated && (
                <div className="navbar__user">
                    {user?.role === 'admin' && (
                        <>
                            <Link to="/admin/grading" className="navbar__admin-link">
                                Grading
                            </Link>
                            <Link to="/admin/cheating-logs" className="navbar__admin-link">
                                Cheating Logs
                            </Link>
                        </>
                    )}
                    <span className="navbar__username">{user?.username || user?.email}</span>
                    <button type="button" className="navbar__logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}