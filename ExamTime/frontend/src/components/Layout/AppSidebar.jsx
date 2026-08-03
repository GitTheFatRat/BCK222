import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice.js';
import { getMediaUrl } from '../../config/media.js';

export default function AppSidebar() {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        dispatch(logout());
        navigate('/login', { replace: true });
    }

    if (!isAuthenticated) {
        return (
            <aside className="app-sidebar app-sidebar--unauth">
                <div className="app-sidebar__header">
                    <Link to="/" className="app-sidebar__brand">
                        <span className="app-sidebar__brand-mark">IELTS</span>
                        <span className="app-sidebar__brand-name">ExamTime</span>
                    </Link>
                </div>
            </aside>
        );
    }

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <aside className="app-sidebar">
            <div className="app-sidebar__header">
                <Link to="/" className="app-sidebar__brand">
                    <span className="app-sidebar__brand-mark">IELTS</span>
                    <span className="app-sidebar__brand-name">ExamTime</span>
                </Link>
            </div>

            <nav className="app-sidebar__nav">
                <Link to="/" className={`app-sidebar__nav-link ${isActive('/')}`}>
                    Dashboard
                </Link>
                <Link to="/leaderboard" className={`app-sidebar__nav-link ${isActive('/leaderboard')}`}>
                    Leaderboard
                </Link>
                <Link to="/settings" className={`app-sidebar__nav-link ${isActive('/settings')}`}>
                    Settings
                </Link>
                
                {(user?.role === 'admin' || user?.role === 'teacher') && (
                    <div className="app-sidebar__admin-section">
                        <div className="app-sidebar__nav-title">{user?.role === 'admin' ? 'Admin' : 'Teacher'}</div>
                        {user?.role === 'admin' && (
                            <Link to="/admin/users" className={`app-sidebar__nav-link ${isActive('/admin/users')}`}>
                                User Management
                            </Link>
                        )}
                        <Link to="/admin/grading" className={`app-sidebar__nav-link ${isActive('/admin/grading')}`}>
                            Grading
                        </Link>
                        <Link to="/admin/cheating-logs" className={`app-sidebar__nav-link ${isActive('/admin/cheating-logs')}`}>
                            Cheating Logs
                        </Link>
                    </div>
                )}
            </nav>

            <div className="app-sidebar__footer">
                <div className="app-sidebar__user-info">
                    {user?.avatar ? (
                        <img src={getMediaUrl(user.avatar)} alt="Avatar" className="app-sidebar__avatar-img" />
                    ) : (
                        <div className="app-sidebar__avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
                    )}
                    <span className="app-sidebar__username">{user?.username || user?.email}</span>
                </div>
                <button type="button" className="btn btn-secondary app-sidebar__logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </aside>
    );
}
