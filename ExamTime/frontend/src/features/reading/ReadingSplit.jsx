import ListeningForm from "../listening/ListeningForm";

export default function ReadingSplit({ passage, showAnswers = false }) {
    return (
        <div className="reading-split">
            <div className="passage-pane">
                <h3>{passage.title}</h3>
                {passage.text.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
            <div className="questions-pane">
                <ListeningForm questions={passage.questions} showAnswers={showAnswers} />
            </div>
        </div>
    )
}