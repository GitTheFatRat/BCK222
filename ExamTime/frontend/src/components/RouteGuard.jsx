import { useEffect } from 'react';
import { useSelector } from 'react-redux';
export default function RouteGuard({ children }) {
    const status = useSelector((state) => state.examSession.status);

    useEffect(() => {
        function handleBeforeUnload(e) {
            if (status === 'IN_PROGRESS') {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [status]);

    function notificationIfLeaving() {
        if (status === 'IN_PROGRESS') {
            alert('You are leaving the exam room!');
        }
    }

    return children;
}