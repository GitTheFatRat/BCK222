export default function Sidebar({ totalQuestions = 0, answeredIds = [], onJump }) {
    const questionNumbers = Array.from({ length: totalQuestions }, (_, index) => index + 1);

    return (
        <aside className="sidebar">
            <h4 className="sidebar__title">Question List</h4>

            <div className="sidebar__grid">
                {questionNumbers.map((num) => {
                    const qId = `Q${num}`;
                    const isAnswered = answeredIds.includes(qId) || answeredIds.includes(String(num));

                    return (
                        <button
                            key={num}
                            type="button"
                            className={`sidebar__question-btn ${isAnswered ? 'sidebar__question-btn--answered' : ''}`}
                            onClick={() => onJump(qId)}
                        >
                            {num}
                        </button>
                    );
                })}
            </div>

            <div className="sidebar__legend">
                <span>
                    <i className="sidebar__legend-dot sidebar__legend-dot--answered" /> Answered
                </span>
                <span>
                    <i className="sidebar__legend-dot" /> Not Answered
                </span>
            </div>
        </aside>
    );
}