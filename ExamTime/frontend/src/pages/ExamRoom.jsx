import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { startSession, logCheatingEvent, endSession, resetSession } from '../store/slices/examSessionSlice.js';
import { resetAnswers } from '../store/slices/answerSlice.js';
import CountdownTimer from '../components/CountdownTimer.jsx';
import Sidebar from '../components/Layout/Sidebar.jsx';
import AudioPlayer from '../components/AudioPlayer.jsx';
import ListeningForm from '../features/listening/ListeningForm.jsx';
import ReadingSplit from '../features/reading/ReadingSplit.jsx';
import WritingEditor from '../features/writing/WritingEditor.jsx';
import SpeakingRecorder from '../features/speaking/SpeakingRecorder.jsx';
import mockData from '../mock/examMock.json';

const DURATION_SECONDS = {
    listening: 30 * 60,
    reading: 60 * 60,
    'writing-task1': 20 * 60,
    'writing-task2': 40 * 60,
    speaking: 15 * 60,
};

export default function ExamRoom() {
    const { examId, skill } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const status = useSelector((state) => state.examSession.status);
    const answers = useSelector((state) => state.answers.byQuestionId);
    const cheatingLog = useSelector((state) => state.examSession.cheatingLog);
    const writingTask1 = useSelector((state) => state.answers.writingTask1);
    const writingTask2 = useSelector((state) => state.answers.writingTask2);
    const speakingRecordingBlobUrl = useSelector((state) => state.answers.speakingRecordingBlobUrl);

    const [examData, setExamData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mockData.examId !== examId) return;
        setExamData(mockData);

        const remainingSeconds = DURATION_SECONDS[skill] || 30 * 60;
        dispatch(startSession({ examId, skill, remainingSeconds }));

        return () => {
            dispatch(resetSession());
        };
    }, [examId, skill]);

    useEffect(() => {
        function handleVisibilityChange() {
            if (document.hidden && status === 'IN_PROGRESS') {
                dispatch(logCheatingEvent({ type: 'TAB_SWITCHED' }));
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [dispatch, status]);

    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            dispatch(endSession());
            console.log("Submitting responses...", { examId, skill, answers, cheatingLog });

            dispatch(resetAnswers());
            navigate('/', { replace: true })
        } catch (err) {
            console.error('Submit failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, examId, skill, answers, cheatingLog, dispatch, navigate])

    useEffect(() => {
        if (status === 'SUBMITTED' && !isSubmitting) {
            handleSubmit();
        }
    }, [status, isSubmitting, handleSubmit]);

    if (!examData) {
        return <p className="loading-state">Dang tai de thi...</p>;
    }

    return (
        <div className="exam-room">
            <div className="exam-room-header">
                <CountdownTimer />
                <button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Dang nop bai...' : 'Nop bai'}
                </button>
            </div>

            <div className="exam-room-body">
                <div className="exam-room-content">
                    {skill === 'listening' && (
                        <>
                            <AudioPlayer src={examData.listening.audioUrl} examMode />
                            <ListeningForm questions={examData.listening.sections[0].questions} />
                        </>
                    )}

                    {skill === 'reading' && <ReadingSplit passage={examData.reading.passages[0]} />}

                    {skill === 'writing-task1' && (
                        <WritingEditor task="Task1" minWords={examData.writing.task1.minWords} />
                    )}

                    {skill === 'writing-task2' && (
                        <WritingEditor task="Task2" minWords={examData.writing.task2.minWords} />
                    )}

                    {skill === 'speaking' && <SpeakingRecorder cueCard={examData.speaking.part2} />}
                </div>

                {(skill === 'listening' || skill === 'reading') && (
                    <Sidebar
                        totalQuestions={examData[skill].sections?.[0]?.questions?.length || examData[skill].passages?.[0]?.questions?.length || 0}
                        answeredIds={Object.keys(answers)}
                        onJump={(qId) => {
                            document.getElementById(`question-${qId}`)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    />
                )}
            </div>
        </div>
    );
}   