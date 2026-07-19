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
                    <th>Writing</th>
                    <th>Speaking</th>
                    <th>Overall</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {results.map((result) => (
                    <tr key={result._id}>
                        <td>{result.examTitle}</td>
                        <td>{formatDate(result.createdAt)}</td>
                        <td>{result.scores?.listeningBand ?? '--'}</td>
                        <td>{result.scores?.readingBand ?? '--'}</td>
                        <td>{result.scores?.writingBand ?? '--'}</td>
                        <td>{result.scores?.speakingBand ?? '--'}</td>
                        <td>
                            <b>{result.scores?.overallBand ?? '--'}</b>
                        </td>
                        <td>
                            <StatusBadge status={result.status} />
                        </td>
                    </tr>
                ))}
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