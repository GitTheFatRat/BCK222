import { Link } from 'react-router-dom';

const SKILLS = [
    { key: 'listening', label: 'Listening' },
    { key: 'reading', label: 'Reading' },
    { key: 'writing-task1', label: 'Writing T1' },
    { key: 'writing-task2', label: 'Writing T2' },
    { key: 'speaking', label: 'Speaking' }
];

export default function ExamCard({ exam }) {
    return (
        <div className="exam-card">
            <div className="exam-card-header">
                <h3>{exam.title}</h3>
                <span className={exam.isCompleted ? 'badge badge-done' : 'badge badge-pending'}>
                    {exam.isCompleted ? `Completed - Band ${exam.bestBand ?? '--'}` : 'Not Yet'}
                </span>
            </div>

            <div className="exam-card-footer" style={{ marginTop: '1.5rem', display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                    onClick={() => {
                        localStorage.removeItem(`examtime_session_${exam.examId}`);
                        alert('Started a new attempt.');
                    }}
                >
                    Start a new attempt
                </button>
                <Link to={`/exam/${exam.examId}/listening`} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                    Take Exam
                </Link>
            </div>
        </div>
    );
}