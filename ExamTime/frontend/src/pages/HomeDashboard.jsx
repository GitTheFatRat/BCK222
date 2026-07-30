import { useEffect, useState } from 'react';

import ExamCard from '../features/dashboard/ExamCard.jsx';
import ResultHistory from '../features/dashboard/ResultHistory.jsx';
import { getExam } from '../services/examService.js';
import { getMyResultHistory } from '../services/resultService.js';

export default function HomeDashboard() {
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
      <h2>IELTS Exam Practice</h2>

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

      <h2>Result History</h2>
      <ResultHistory results={results} />
    </div>
  );
}