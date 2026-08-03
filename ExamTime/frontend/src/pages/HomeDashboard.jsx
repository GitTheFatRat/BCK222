import { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import ExamCard from '../features/dashboard/ExamCard.jsx';
import ResultHistory from '../features/dashboard/ResultHistory.jsx';
import { getExam } from '../services/examService.js';
import { getMyResultHistory } from '../services/resultService.js';

export default function HomeDashboard() {
  const user = useSelector(state => state.auth.user);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      setError('');
      try {
        const [examList, history] = await Promise.all([getExam(), getMyResultHistory()]);

        const formattedExams = examList.map((exam) => {
          const session = history.find((r) => r.examTitle === exam.title);

          return {
            examId: exam.code,
            title: exam.title,
            isCompleted: !!session && Object.keys(session.skills).length > 0,
            bestBand: session?.overallBand ?? null,
          };
        });

        setExams(formattedExams);
        setResults(history);
      } catch (err) {
        console.error('Khong the tai du lieu dashboard:', err);
        setError('Failed to load data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <p className="loading-state">Loading exam list...</p>;
  }

  return (
    <div className="dashboard-container">
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--et-primary) 0%, var(--et-accent) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 48px',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }}></div>
        <h1 style={{ color: 'white', fontSize: '36px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
          Welcome back, {user?.username}!
        </h1>
        <p style={{ opacity: 0.9, fontSize: '16px', margin: 0, position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          Ready to continue your preparation? Choose an exam below to start practicing or review your past results to track your progress.
        </p>
      </div>

      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Available Exams</h2>

      {error && <p className="form-error">{error}</p>}

      {exams.length === 0 ? (
        <p className="empty-state">No exams published yet.</p>
      ) : (
        <div className="exams-grid">
          {exams.map((exam) => (
            <ExamCard key={exam.examId} exam={exam} />
          ))}
        </div>
      )}
      </div>

      <div style={{ marginTop: '16px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Result History</h2>
        <ResultHistory results={results} />
      </div>
    </div>
  );
}