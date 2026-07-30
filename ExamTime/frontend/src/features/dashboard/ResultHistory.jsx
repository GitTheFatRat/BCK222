export default function ResultHistory({ results = [] }) {
    if (results.length === 0) {
        return <p className="empty-state">You haven't submitted any practice exams yet.</p>;
    }

    return (
        <table className="result-history">
            <thead>
                <tr>
                    <th>Exam</th>
                    <th>Date</th>
                    <th>Listening</th>
                    <th>Reading</th>
                    <th>Writing T1</th>
                    <th>Writing T2</th>
                    <th>Speaking</th>
                    <th>Overall</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {results.map((session, index) => {
                    const hasWritingT1 = session.skills['writing-task1'];
                    const hasWritingT2 = session.skills['writing-task2'];
                    const hasSpeaking = session.skills.speaking;
                    const writingT1Band = hasWritingT1?.scores?.writingBand;
                    const writingT2Band = hasWritingT2?.scores?.writingBand;
                    const speakingBand = hasSpeaking?.scores?.speakingBand;
                    const skillCount = Object.keys(session.skills).length;
                    const isPending = Object.values(session.skills).some(
                        (s) => s.status === 'GRADING' || s.status === 'SUBMITTED'
                    );

                    return (
                        <tr key={session.sessionId || `legacy-session-${index}`}>
                            <td>{session.examTitle}</td>
                            <td>{formatDate(session.lastUpdatedAt)}</td>
                            <td>{session.skills.listening?.scores?.listeningBand ?? '--'}</td>
                            <td>{session.skills.reading?.scores?.readingBand ?? '--'}</td>
                            <td>{hasWritingT1 ? (typeof writingT1Band === 'number' ? writingT1Band : 'Pending') : '--'}</td>
                            <td>{hasWritingT2 ? (typeof writingT2Band === 'number' ? writingT2Band : 'Pending') : '--'}</td>
                            <td>{hasSpeaking ? (typeof speakingBand === 'number' ? speakingBand : 'Pending') : '--'}</td>
                            <td>
                                <b>{session.overallBand ?? '--'}</b>
                            </td>
                            <td>
                                <span className="status-badge status-graded">{skillCount}/5 skills</span>
                                {isPending && <span className="status-badge status-grading" style={{ marginLeft: '4px' }}>Pending</span>}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function StatusBadge({ status }) {
    const labels = {
        SUBMITTED: 'Submitted',
        GRADING: 'Grading',
        GRADED: 'Graded',
    };
    return <span className={`status-badge status-${status?.toLowerCase()}`}>{labels[status] || status}</span>;
}

function formatDate(isoString) {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}