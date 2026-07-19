import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ListeningForm from '../features/listening/ListeningForm.jsx';
import ReadingSplit from '../features/reading/ReadingSplit.jsx';
import WritingEditor from '../features/writing/WritingEditor.jsx';
import SpeakingRecorder from '../features/speaking/SpeakingRecorder.jsx';
import mockData from '../mock/examMock.json';

export default function PracticeRoom() {
    const { examId, skill } = useParams();
    const [examData, setExamData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadExamData() {
            setIsLoading(true);
            setError('');
            try {
                if (mockData.examId !== examId) {
                    throw new Error('Cannot find exam.');
                }
                setExamData(mockData);
            } catch (err) {
                setError(err.message || 'Cannot load exam.');
            } finally {
                setIsLoading(false);
            }
        }
        loadExamData()
    }, [examId])

    if (isLoading) return <div className='loading-state'>Loading practice exams</div>
    if (error) return <p className='form-error'>{error}</p>
    if (!examData) return null;

    return (
        <div className='practice-room'>
            <div className='practice-header'>
                <h2>Practice: {skillLabel(skill)}</h2>
                <Link to="/">&larr; Back to home</Link>
            </div>

            {skill === 'reading' && <ReadingSplit passage={examData.reading.passages[0]} />}

            {skill === 'writing-task1' && (
                <WritingEditor task="Task1" minWords={examData.writing.task1.minWords} />
            )}

            {skill === 'writing-task2' && (
                <WritingEditor task="Task2" minWords={examData.writing.task2.minWords} />
            )}

            {skill === 'speaking' && <SpeakingRecorder cueCard={examData.speaking.part2} />}

            {!['listening', 'reading', 'writing-task1', 'writing-task2', 'speaking'].includes(skill) && (
                <p>Invalid Skill: {skill}</p>
            )}
        </div>
    );
}

function skillLabel(skill) {
    const labels = {
        listening: 'listening',
        reading: 'reading',
        'writing-task1': 'Writing Task 1',
        'writing-task2': 'Writing Task 2',
        speaking: 'Speaking',
    };
    return labels[skill] || skill;
}