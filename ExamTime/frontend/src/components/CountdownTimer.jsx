import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { tick } from '../store/slices/examSessionSlice.js';

const WARNING_THREADOLD_SECOND = 5 * 60;

export default function CountdownTimer() {
    const dispatch = useDispatch();
    const remainingSeconds = useSelector((state) => state.examSession.remainingSeconds);
    const status = useSelector((state) => state.examSession.status)

    useEffect(() => {
        if (status !== 'IN_PROGRESS') return;

        const intervalId = setInterval(() => {
            dispatch(tick());
        }, 1000);

        return () => clearInterval(intervalId)
    }, [status, dispatch])

    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60;
    const isWarning = remainingSeconds <= WARNING_THREADOLD_SECOND;

    return (
        <div className={`countdown-timer ${isWarning ? 'countdown-timer--warning' : ''}`}>
            <span className="countdown-timer__label">Time Remaining</span>
            <span className="countdown-timer__value">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
}
