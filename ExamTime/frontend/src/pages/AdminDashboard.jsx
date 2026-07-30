import { useState, useEffect, useCallback } from 'react';
import { getPendingResults, submitGrade } from '../services/resultService.js';

const SKILL_LABELS = {
    'writing-task1': 'Writing Task 1',
    'writing-task2': 'Writing Task 2',
    speaking: 'Speaking',
};

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
    : 'http://localhost:5000';

export default function AdminDashboard() {
    const [pending, setPending] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [gradeInputs, setGradeInputs] = useState({});
    const [gradingStatus, setGradingStatus] = useState({});

    const loadPending = useCallback(async () => {
        setIsLoading(true);
        setLoadError('');
        try {
            const data = await getPendingResults();
            setPending(data);
        } catch (err) {
            setLoadError(err.response?.data?.message || err.message || 'Failed to load pending tasks.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPending();
    }, [loadPending]);

    const toggleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const handleGradeChange = (id, value) => {
        setGradeInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmitGrade = async (id) => {
        const score = parseFloat(gradeInputs[id]);
        if (isNaN(score) || score < 0 || score > 9) {
            setGradingStatus(prev => ({ ...prev, [id]: { type: 'error', msg: 'Score must be between 0 and 9.' } }));
            return;
        }

        setGradingStatus(prev => ({ ...prev, [id]: { type: 'loading', msg: 'Submitting...' } }));

        try {
            await submitGrade(id, score);
            setGradingStatus(prev => ({ ...prev, [id]: { type: 'success', msg: 'Graded successfully!' } }));
            // Remove from list after a brief delay
            setTimeout(() => {
                setPending(prev => prev.filter(p => p._id !== id));
                setGradingStatus(prev => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                });
            }, 1200);
        } catch (err) {
            setGradingStatus(prev => ({
                ...prev,
                [id]: { type: 'error', msg: err.response?.data?.message || 'Failed to submit grade.' },
            }));
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h2>Grading page</h2>
                <p className="admin-dashboard-subtitle">
                    Review and grade pending Writing & Speaking submissions.
                </p>
            </div>

            {isLoading && <p className="loading-state">Loading pending tasks...</p>}
            {loadError && <p className="form-error">{loadError}</p>}

            {!isLoading && !loadError && pending.length === 0 && (
                <div className="admin-empty-state">
                    <span className="admin-empty-icon"></span>
                    <p>No pending submissions to grade. All caught up!</p>
                </div>
            )}

            {!isLoading && pending.length > 0 && (
                <div className="admin-pending-list">
                    <div className="admin-pending-count">
                        <strong>{pending.length}</strong> submission{pending.length !== 1 ? 's' : ''} pending
                    </div>

                    {pending.map(task => {
                        const isExpanded = expandedId === task._id;
                        const status = gradingStatus[task._id];

                        return (
                            <div
                                key={task._id}
                                className={`admin-task-card ${isExpanded ? 'expanded' : ''} ${status?.type === 'success' ? 'graded-success' : ''}`}
                            >
                                <div className="admin-task-header" onClick={() => toggleExpand(task._id)}>
                                    <div className="admin-task-info">
                                        <span className="admin-task-skill-badge">
                                            {SKILL_LABELS[task.skill] || task.skill}
                                        </span>
                                        <span className="admin-task-student">
                                            {task.user?.username || task.user?.email || 'Unknown'}
                                        </span>
                                        <span className="admin-task-exam">
                                            {task.exam?.title || 'Unknown Exam'} ({task.exam?.code || '—'})
                                        </span>
                                    </div>
                                    <div className="admin-task-meta">
                                        <span className="admin-task-date">
                                            {new Date(task.createdAt).toLocaleString()}
                                        </span>
                                        <span className={`admin-expand-icon ${isExpanded ? 'rotated' : ''}`}>▼</span>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="admin-task-body">
                                        {/* Writing content */}
                                        {task.skill === 'writing-task1' && task.writingTask1Text && (
                                            <div className="admin-submission-content">
                                                <h4>Student's Writing (Task 1):</h4>
                                                <div className="admin-writing-text">{task.writingTask1Text}</div>
                                                <div className="admin-word-count">
                                                    Word count: {task.writingTask1Text.trim().split(/\s+/).filter(Boolean).length}
                                                </div>
                                            </div>
                                        )}
                                        {task.skill === 'writing-task2' && task.writingTask2Text && (
                                            <div className="admin-submission-content">
                                                <h4>Student's Writing (Task 2):</h4>
                                                <div className="admin-writing-text">{task.writingTask2Text}</div>
                                                <div className="admin-word-count">
                                                    Word count: {task.writingTask2Text.trim().split(/\s+/).filter(Boolean).length}
                                                </div>
                                            </div>
                                        )}

                                        {/* Speaking audio */}
                                        {task.skill === 'speaking' && task.speakingRecordingUrl && (
                                            <div className="admin-submission-content">
                                                <h4>Student's Speaking Recording:</h4>
                                                <audio
                                                    controls
                                                    src={`${BACKEND_URL}${task.speakingRecordingUrl}`}
                                                    className="admin-audio-player"
                                                >
                                                    Your browser does not support the audio element.
                                                </audio>
                                            </div>
                                        )}

                                        {/* No content fallback */}
                                        {task.skill === 'speaking' && !task.speakingRecordingUrl && (
                                            <p className="text-muted">No speaking recording found for this submission.</p>
                                        )}
                                        {task.skill.startsWith('writing') && !task.writingTask1Text && !task.writingTask2Text && (
                                            <p className="text-muted">No writing content found for this submission.</p>
                                        )}

                                        {/* Grading form */}
                                        <div className="admin-grade-form">
                                            <label htmlFor={`grade-${task._id}`}>Band Score (0 – 9):</label>
                                            <div className="admin-grade-input-row">
                                                <input
                                                    id={`grade-${task._id}`}
                                                    type="number"
                                                    min="0"
                                                    max="9"
                                                    step="0.5"
                                                    placeholder="e.g. 6.5"
                                                    value={gradeInputs[task._id] || ''}
                                                    onChange={(e) => handleGradeChange(task._id, e.target.value)}
                                                    disabled={status?.type === 'loading' || status?.type === 'success'}
                                                />
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleSubmitGrade(task._id)}
                                                    disabled={status?.type === 'loading' || status?.type === 'success'}
                                                >
                                                    {status?.type === 'loading' ? 'Grading...' : 'Submit Grade'}
                                                </button>
                                            </div>
                                            {status && (
                                                <p className={`admin-grade-msg ${status.type}`}>{status.msg}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
