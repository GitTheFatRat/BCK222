import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import { getExamByCode } from '../services/examService.js';
import { getMyResultHistory } from '../services/resultService.js';

const SKILL_LABELS = {
    listening: 'Listening',
    reading: 'Reading',
    'writing-task1': 'Writing Task 1',
    'writing-task2': 'Writing Task 2',
    speaking: 'Speaking'
};

const SKILL_ORDER = ['listening', 'reading', 'writing-task1', 'writing-task2', 'speaking'];

export default function ResultSummary() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state; 

    const [sessionData, setSessionData] = useState(null);
    const [questionsMap, setQuestionsMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [expandedSkills, setExpandedSkills] = useState({});

    useEffect(() => {
        if (!state?.sessionId || !state?.examCode) {
            setIsLoading(false);
            return;
        }

        let isCancelled = false;

        async function loadData() {
            setIsLoading(true);
            setLoadError('');
            try {
                const history = await getMyResultHistory();
                if (isCancelled) return;

                const session = history.find(s => s.sessionId === state.sessionId);
                if (!session) {
                    throw new Error('No result found for this session.');
                }
                setSessionData(session);

                const examData = await getExamByCode(state.examCode, 'practice');
                if (isCancelled) return;

                const newQuestionsMap = {};
                
                if (examData.listeningSet && examData.listeningSet.sections) {
                    newQuestionsMap.listening = examData.listeningSet.sections.flatMap(s => s.questions);
                }
                if (examData.readingSet && examData.readingSet.passages) {
                    newQuestionsMap.reading = examData.readingSet.passages.flatMap(p => p.questions);
                }
                setQuestionsMap(newQuestionsMap);

                if (state.skill === 'listening' || state.skill === 'reading') {
                    setExpandedSkills(prev => ({ ...prev, [state.skill]: true }));
                }

            } catch (err) {
                if (!isCancelled) {
                    setLoadError(err.message || 'Error loading result data.');
                }
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        }

        loadData();

        return () => {
            isCancelled = true;
        };
    }, [state]);

    if (!state?.sessionId || !state?.examCode) {
        return (
            <div className="result-summary-page">
                <p className="empty-state">No test session result available.</p>
                <Link to="/" className="btn btn-primary">&larr; Return to Home</Link>
            </div>
        );
    }

    if (isLoading) {
        return <div className="result-summary-page"><p className="loading-state">Loading results...</p></div>;
    }

    if (loadError) {
        return (
            <div className="result-summary-page">
                <p className="form-error">{loadError}</p>
                <Link to="/" className="btn btn-primary">&larr; Return to Home</Link>
            </div>
        );
    }

    if (!sessionData) {
        return <div className="result-summary-page"><p>Unable to display results.</p></div>;
    }

    const toggleExpand = (skillKey) => {
        setExpandedSkills(prev => ({ ...prev, [skillKey]: !prev[skillKey] }));
    };

    return (
        <div className="result-summary-page">
            <div className="result-summary-header">
                <h2>Exam Result: {sessionData.examTitle}</h2>
                <div className="overall-band-banner">
                    Overall Band: <strong>{sessionData.overallBand ?? '--'}</strong>
                </div>
            </div>

            <div className="skill-sections-container">
                {SKILL_ORDER.map(skillKey => {
                    const skillData = sessionData.skills[skillKey];
                    const isAttempted = !!skillData;
                    
                    if (!isAttempted) {
                        return (
                            <UnattemptedSkillCard 
                                key={skillKey} 
                                skillKey={skillKey} 
                                examCode={state.examCode} 
                            />
                        );
                    }

                    return (
                        <AttemptedSkillCard 
                            key={skillKey}
                            skillKey={skillKey}
                            skillData={skillData}
                            questions={questionsMap[skillKey]}
                            isExpanded={!!expandedSkills[skillKey]}
                            onToggleExpand={() => toggleExpand(skillKey)}
                        />
                    );
                })}
            </div>

            <div className="result-summary-actions mt-20">
                <Link to="/" className="btn btn-primary">&larr; Return to Home</Link>
            </div>
        </div>
    );
}

function UnattemptedSkillCard({ skillKey, examCode }) {
    return (
        <div className="skill-result-card skill-unattempted">
            <div className="skill-card-header">
                <h3>{SKILL_LABELS[skillKey]}</h3>
                <span className="badge badge-muted">Not Attempted</span>
            </div>
            <div className="skill-card-body">
                <p className="text-muted">You have not taken this skill in this session.</p>
                <Link to={`/exam/${examCode}/${skillKey}`} className="btn btn-secondary mt-10">
                    Start {SKILL_LABELS[skillKey]}
                </Link>
            </div>
        </div>
    );
}

function AttemptedSkillCard({ skillKey, skillData, questions, isExpanded, onToggleExpand }) {
    const BAND_FIELD_BY_SKILL = {
        listening: 'listeningBand',
        reading: 'readingBand',
        'writing-task1': 'writingBand',
        'writing-task2': 'writingBand',
        speaking: 'speakingBand',
    };

    const bandField = BAND_FIELD_BY_SKILL[skillKey];
    const isGraded = skillData.scores?.[bandField] !== null && skillData.scores?.[bandField] !== undefined;
    const bandScore = skillData.scores?.[bandField];
    
    const isSubjective = skillKey === 'writing-task1' || skillKey === 'writing-task2' || skillKey === 'speaking';

    if (isSubjective) {
        return (
            <div className="skill-result-card">
                <div className="skill-card-header">
                    <h3>{SKILL_LABELS[skillKey]}</h3>
                    {isGraded ? (
                        <span className="badge badge-success">Graded</span>
                    ) : (
                        <span className="badge badge-warning">Pending</span>
                    )}
                </div>
                {isGraded && (
                    <div className="skill-card-body">
                        <div className="stat-box stat-band">
                            <span className="stat-label">Band Score</span>
                            <span className="stat-value">{bandScore.toFixed(1)}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const answers = skillData.answers || {};
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const totalQuestions = questions ? questions.length : 0;

    if (questions) {
        questions.forEach(q => {
            const userAns = answers[q.qId];
            if (userAns === undefined || userAns === null || userAns === '') {
                skippedCount++;
            } else if (userAns === q.correctAnswer) {
                correctCount++;
            } else {
                wrongCount++;
            }
        });
    }

    const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    return (
        <div className="skill-result-card">
            <div className="skill-card-header">
                <h3>{SKILL_LABELS[skillKey]}</h3>
                <span className="badge badge-success">Graded</span>
            </div>
            
            <div className="skill-card-body">
                <div className="skill-stats-layout">
                    <div className="ring-container">
                        <div className="circular-ring" style={{"--percentage": `${percentage}%`}}>
                            <div className="ring-inner">
                                <span className="ring-score">{correctCount}/{totalQuestions}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="stats-grid">
                        <div className="stat-box stat-correct">
                            <span className="stat-label">Correct</span>
                            <span className="stat-value">{correctCount}</span>
                        </div>
                        <div className="stat-box stat-wrong">
                            <span className="stat-label">Wrong</span>
                            <span className="stat-value">{wrongCount}</span>
                        </div>
                        <div className="stat-box stat-skipped">
                            <span className="stat-label">Skipped</span>
                            <span className="stat-value">{skippedCount}</span>
                        </div>
                        <div className="stat-box stat-band">
                            <span className="stat-label">Band Score</span>
                            <span className="stat-value">{typeof bandScore === 'number' ? bandScore.toFixed(1) : '--'}</span>
                        </div>
                    </div>
                </div>

                {questions && questions.length > 0 && (
                    <div className="expand-action">
                        <button className="btn btn-outline" onClick={onToggleExpand}>
                            {isExpanded ? 'Hide Answer Key' : 'View Answer Key'}
                        </button>
                    </div>
                )}
            </div>

            {isExpanded && questions && (
                <div className="answer-key-list">
                    {questions.map((q, idx) => {
                        const userAns = answers[q.qId];
                        const isSkipped = userAns === undefined || userAns === null || userAns === '';
                        const isCorrect = !isSkipped && userAns === q.correctAnswer;
                        
                        let rowClass = 'row-skipped';
                        if (!isSkipped) {
                            rowClass = isCorrect ? 'row-correct' : 'row-wrong';
                        }

                        return (
                            <div key={q.qId} className={`answer-key-row ${rowClass}`}>
                                <div className="q-num">{idx + 1}</div>
                                <div className="q-details">
                                    <div className="q-answers">
                                        <span className="user-ans">Your answer: {isSkipped ? '(skipped)' : userAns}</span>
                                        {!isCorrect && (
                                            <span className="correct-ans">Correct answer: {q.correctAnswer}</span>
                                        )}
                                    </div>
                                    {q.explanation && (
                                        <div className="q-explanation">{q.explanation}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}