import { useState, useEffect, useCallback } from 'react';
import { getCheatingLogs } from '../services/resultService.js';

const SKILL_LABELS = {
    listening: 'Listening',
    reading: 'Reading',
    'writing-task1': 'Writing Task 1',
    'writing-task2': 'Writing Task 2',
    speaking: 'Speaking',
};

export default function AdminCheatingLogs() {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [filterOnlyCheated, setFilterOnlyCheated] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        setLoadError('');
        try {
            const data = await getCheatingLogs();
            setResults(data);
        } catch (err) {
            setLoadError(err.response?.data?.message || err.message || 'Failed to load cheating logs.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const filtered = filterOnlyCheated
        ? results.filter(r => r.cheatingLog && r.cheatingLog.length > 0)
        : results;

    const toggleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    return (
        <div className="admin-cheating-logs-page">
            <div className="admin-dashboard-header">
                <h2>Cheating Logs</h2>
                <p className="admin-dashboard-subtitle">
                    Monitor tab switching and cheating events during mock tests.
                </p>
            </div>

            <div className="cheating-logs-filters mt-10">
                <label className="option-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={filterOnlyCheated}
                        onChange={(e) => setFilterOnlyCheated(e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                    />
                    <span>Show only submissions with recorded cheating events</span>
                </label>
            </div>

            {isLoading && <p className="loading-state">Loading cheating logs...</p>}
            {loadError && <p className="form-error">{loadError}</p>}

            {!isLoading && !loadError && filtered.length === 0 && (
                <div className="admin-empty-state">
                    <p>{filterOnlyCheated ? 'No cheating events recorded across mock tests.' : 'No mock test submissions found.'}</p>
                </div>
            )}

            {!isLoading && filtered.length > 0 && (
                <div className="admin-pending-list mt-20">
                    <div className="admin-pending-count">
                        Showing <strong>{filtered.length}</strong> mock test submission{filtered.length !== 1 ? 's' : ''}
                    </div>

                    {filtered.map(item => {
                        const cheatCount = item.cheatingLog ? item.cheatingLog.length : 0;
                        const isExpanded = expandedId === item._id;

                        return (
                            <div key={item._id} className={`admin-task-card ${cheatCount > 0 ? 'cheat-detected' : ''}`}>
                                <div className="admin-task-header" onClick={() => toggleExpand(item._id)}>
                                    <div className="admin-task-info">
                                        <span className="admin-task-skill-badge">
                                            {SKILL_LABELS[item.skill] || item.skill}
                                        </span>
                                        <span className="admin-task-student">
                                            {item.user?.username || item.user?.email || 'Unknown User'}
                                        </span>
                                        <span className="admin-task-exam">
                                            {item.exam?.title || 'Unknown Exam'} ({item.exam?.code || '—'})
                                        </span>
                                    </div>

                                    <div className="admin-task-meta">
                                        <span className={`status-badge ${cheatCount > 0 ? 'status-grading' : 'status-graded'}`}>
                                            {cheatCount > 0 ? `${cheatCount} Cheating Event${cheatCount !== 1 ? 's' : ''}` : 'Clean'}
                                        </span>
                                        <span className="admin-task-date">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                        <span className={`admin-expand-icon ${isExpanded ? 'rotated' : ''}`}>▼</span>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="admin-task-body">
                                        {cheatCount === 0 ? (
                                            <p className="text-muted">No suspicious activity or tab switches detected during this session.</p>
                                        ) : (
                                            <div className="cheating-events-detail">
                                                <h4>Recorded Events ({cheatCount}):</h4>
                                                <table className="result-history" style={{ marginTop: '8px' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Event Type</th>
                                                            <th>Timestamp</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.cheatingLog.map((log, idx) => (
                                                            <tr key={idx}>
                                                                <td>{idx + 1}</td>
                                                                <td>
                                                                    <strong style={{ color: '#c62828' }}>
                                                                        {log.type === 'TAB_SWITCH' ? 'Tab Switched / Window Blur' : log.type}
                                                                    </strong>
                                                                </td>
                                                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
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
