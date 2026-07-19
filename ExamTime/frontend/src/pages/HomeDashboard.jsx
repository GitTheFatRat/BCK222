import { useEffect, useState } from 'react';
import ExamCard from '../features/dashboard/ExamCard.jsx';
import ResultHistory from '../features/dashboard/ResultHistory.jsx';
import mockData from '../mock/examMock.json';
export default function HomeDashboard() {
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            setIsLoading(true);
            try {
                setExams([
                    {
                        examId: mockData.examId,
                        title: mockData.title,
                        isCompleted: false,
                        bestBand: null,
                    },
                ]);
                setResults([]);
            } catch (err) {
                console.error('Cannot load data.:', err);
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    if (isLoading) {
        return <p className="loading-state">Loading ExamBanks...</p>;
    }


}