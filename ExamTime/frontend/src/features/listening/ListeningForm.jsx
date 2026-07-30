import { useDispatch, useSelector } from "react-redux";
import { setAnswer } from '../../store/slices/answerSlice.js'

export default function ListeningForm({ questions = [], showAnswers = false }) {
    const dispatch = useDispatch();
    const answers = useSelector((state) => state.answers.byQuestionId);

    function handleChange(qId, value) {
        dispatch(setAnswer({ qId, value }));
    }

    return (
        <div className="listening-form">
            {questions.map((question, index) => {
                const currentAnswer = answers[question.qId] ?? '';
                const isCorrect = showAnswers && currentAnswer === question.correctAnswer;
                const isWrong = showAnswers && currentAnswer && currentAnswer !== question.correctAnswer;

                return (
                    <div
                        key={question.qId}
                        id={`question-${question.qId}`}
                        className={`question-block ${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}`}
                    >
                        <p className="question-prompt">
                            <span className="question-number">{index + 1}.</span> {question.prompt}
                        </p>

                        {question.type === 'multiple-choice' && (
                            <div className="options-group">
                                {(question.options || []).map((option) => (
                                    <label key={option} className="option-label">
                                        <input
                                            type="radio"
                                            name={question.qId}
                                            value={option.charAt(0)}
                                            checked={currentAnswer === option.charAt(0)}
                                            onChange={(e) => handleChange(question.qId, e.target.value)}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        )}

                        {question.type === 'true-false-notgiven' && (
                            <div className="options-group">
                                {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                                    <label key={option} className="option-label">
                                        <input
                                            type="radio"
                                            name={question.qId}
                                            value={option}
                                            checked={currentAnswer === option}
                                            onChange={(e) => handleChange(question.qId, e.target.value)}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        )}

                        {(question.type === 'gap-fill' || question.type === 'matching') && (
                            <input
                                type="text"
                                className="gap-fill-input"
                                value={currentAnswer}
                                onChange={(e) => handleChange(question.qId, e.target.value)}
                                placeholder="Type your answers here..."
                            />
                        )}

                        {showAnswers && (
                            <div className="answer-feedback">
                                <p>
                                    Correct Answer: <b>{String(question.correctAnswer)}</b>
                                </p>
                                {question.explanation && <p className="explanation">{question.explanation}</p>}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}