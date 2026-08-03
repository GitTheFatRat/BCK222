import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children, allowedRoles = ['admin'] }) {
    const user = useSelector((state) => state.auth.user);

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
