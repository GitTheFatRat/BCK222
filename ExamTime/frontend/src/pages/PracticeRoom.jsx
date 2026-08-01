import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import ListeningForm from '../features/listening/ListeningForm.jsx';
import ReadingSplit from '../features/reading/ReadingSplit.jsx';
import WritingEditor from '../features/writing/WritingEditor.jsx';
import SpeakingRecorder from '../features/speaking/SpeakingRecorder.jsx';
import { getExamByCode } from '../services/examService.js';
import { getMediaUrl } from '../config/media.js';

export default function PracticeRoom() {
  const { examId, skill } = useParams();
  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    async function loadExamData() {
      setIsLoading(true);
      setError('');
      try {
        const data = await getExamByCode(examId, 'practice');
        setExamData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Co loi khi tai de thi.');
      } finally {
        setIsLoading(false);
      }
    }

    loadExamData();
  }, [examId]);

  if (isLoading) return <p className="loading-state">Dang tai de luyen tap...</p>;
  if (error) return <p className="form-error">{error}</p>;
  if (!examData) return null;

  return (
    <div className="practice-room">
      <div className="practice-header">
        <h2>Luyen tap: {skillLabel(skill)}</h2>
        <Link to="/">&larr; Ve trang chu</Link>
      </div>

      {skill === 'listening' && examData.listeningSet && (
        <div className="listening-section-container">
          {examData.listeningSet.sections[currentSectionIndex] && (
            <>
              <audio 
                key={currentSectionIndex}
                src={getMediaUrl(examData.listeningSet.sections[currentSectionIndex].audioUrl)} 
                controls 
              />
              <ListeningForm 
                questions={examData.listeningSet.sections[currentSectionIndex].questions} 
                showAnswers 
              />
              <div className="section-navigation">
                <button
                  className="btn-prev-section"
                  disabled={currentSectionIndex === 0}
                  onClick={() => setCurrentSectionIndex(prev => prev - 1)}
                >
                  &lt; Previous Section
                </button>
                <button
                  className="btn-next-section"
                  disabled={currentSectionIndex === examData.listeningSet.sections.length - 1}
                  onClick={() => setCurrentSectionIndex(prev => prev + 1)}
                >
                  Next Section &gt;
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {skill === 'reading' &&
        examData.readingSet &&
        examData.readingSet.passages.map((passage) => (
          <ReadingSplit key={passage.passageNumber} passage={passage} showAnswers />
        ))}

      {skill === 'writing-task1' && examData.writingSet && (
        <WritingEditor
          task="Task1"
          minWords={examData.writingSet.task1.minWords}
          prompt={examData.writingSet.task1.prompt}
          imageUrl={examData.writingSet.task1.imageUrl}
        />
      )}

      {skill === 'writing-task2' && examData.writingSet && (
        <WritingEditor
          task="Task2"
          minWords={examData.writingSet.task2.minWords}
          prompt={examData.writingSet.task2.prompt}
        />
      )}

      {skill === 'speaking' && examData.speakingSet && (
        <SpeakingRecorder cueCard={examData.speakingSet.part2} />
      )}
    </div>
  );
}

function skillLabel(skill) {
  const labels = {
    listening: 'Listening',
    reading: 'Reading',
    'writing-task1': 'Writing Task 1',
    'writing-task2': 'Writing Task 2',
    speaking: 'Speaking',
  };
  return labels[skill] || skill;
}