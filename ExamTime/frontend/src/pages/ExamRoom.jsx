import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  startSession,
  logCheatingEvent,
  endSession,
  resetSession,
} from '../store/slices/examSessionSlice.js';
import { resetAnswers, setAllAnswers } from '../store/slices/answerSlice.js';
import { saveAnswersToDB, getAnswersFromDB, clearAnswersFromDB } from '../services/indexedDBService.js';
import CountdownTimer from '../components/CountdownTimer.jsx';
import Sidebar from '../components/Layout/Sidebar.jsx';
import AudioPlayer from '../components/AudioPlayer.jsx';
import ListeningForm from '../features/listening/ListeningForm.jsx';
import ReadingSplit from '../features/reading/ReadingSplit.jsx';
import WritingEditor from '../features/writing/WritingEditor.jsx';
import SpeakingRecorder from '../features/speaking/SpeakingRecorder.jsx';
import { getExamByCode } from '../services/examService.js';
import { submitExam } from '../services/resultService.js';
import { getMediaUrl } from '../config/media.js';

const DURATION_SECONDS = {
  listening: 30 * 60,
  reading: 45 * 60,
  'writing-task1': 20 * 60,
  'writing-task2': 40 * 60,
  speaking: 3 * 60,
};



export default function ExamRoom() {
  const { examId: examCode, skill } = useParams(); // examCode = 'code' cua de thi tren URL, vd 'CAMBRIDGE-19-TEST01'
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const status = useSelector((state) => state.examSession.status);
  const answers = useSelector((state) => state.answers.byQuestionId);
  const cheatingLog = useSelector((state) => state.examSession.cheatingLog);
  const writingTask1 = useSelector((state) => state.answers.writingTask1);
  const writingTask2 = useSelector((state) => state.answers.writingTask2);
  const speakingRecordingBlobUrl = useSelector((state) => state.answers.speakingRecordingBlobUrl);

  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sessionId, setSessionId] = useState('');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Chong nop bai 2 lan (vd het gio tu dong nop + nguoi dung cung luc bam nut Nop bai)
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    const key = `examtime_session_${examCode}`;
    let stored = localStorage.getItem(key);
    let validSessionId = null;

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        if (Date.now() - parsed.timestamp < thirtyDays) {
          validSessionId = parsed.sessionId;
        }
      } catch (e) {
        // ignore JSON parse error
      }
    }

    if (!validSessionId) {
      validSessionId = crypto.randomUUID();
      localStorage.setItem(
        key,
        JSON.stringify({ sessionId: validSessionId, timestamp: Date.now() })
      );
    }
    setSessionId(validSessionId);
  }, [examCode]);

  // Khoi phuc du lieu tra loi tu IndexedDB
  useEffect(() => {
    if (sessionId && skill) {
      const dbKey = `${sessionId}_${skill}`;
      getAnswersFromDB(dbKey).then((savedData) => {
        if (savedData) {
          dispatch(setAllAnswers(savedData));
        }
      });
    }
  }, [sessionId, skill, dispatch]);

  // Luu du lieu tra loi vao IndexedDB moi khi co thay doi (debounce 1 giay)
  useEffect(() => {
    if (sessionId && skill) {
      const dbKey = `${sessionId}_${skill}`;
      const dataToSave = {
        byQuestionId: answers,
        writingTask1,
        writingTask2
      };
      const timeoutId = setTimeout(() => {
        saveAnswersToDB(dbKey, dataToSave);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [sessionId, skill, answers, writingTask1, writingTask2]);

  // Tai du lieu de thi that (mode=exam -> backend tu an correctAnswer/explanation)
  useEffect(() => {
    let isCancelled = false;

    async function loadExamData() {
      setIsLoading(true);
      setLoadError('');
      try {
        const data = await getExamByCode(examCode, 'exam');
        if (isCancelled) return;

        setExamData(data);
        hasSubmittedRef.current = false;

        const remainingSeconds = DURATION_SECONDS[skill] || 30 * 60;
        dispatch(startSession({ examId: examCode, skill, remainingSeconds }));
      } catch (err) {
        if (!isCancelled) {
          setLoadError(err.response?.data?.message || 'Failed to load exam.');
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadExamData();

    return () => {
      isCancelled = true;
      dispatch(resetSession());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examCode, skill]);

  // Phat hien chuyen tab trong luc dang thi that
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden && status === 'IN_PROGRESS') {
        dispatch(logCheatingEvent({ type: 'TAB_SWITCH' }));
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch, status]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || hasSubmittedRef.current || !examData) return;

    // examData._id la ObjectId THAT cua Exam trong MongoDB (dang chuoi text sau khi qua JSON),
    // BAT BUOC phai la string o day - khong duoc truyen ca object examData vao.
    const realExamId = typeof examData._id === 'string' ? examData._id : String(examData._id);

    if (!realExamId || realExamId === 'undefined' || realExamId === '[object Object]') {
      console.error('examData._id khong hop le (JSON):', JSON.stringify(examData._id));
      console.error('Toan bo examData (JSON):', JSON.stringify(examData, null, 2));
      setLoadError('Unable to determine exam for submission. Please reload the page.');
      return;
    }

    hasSubmittedRef.current = true;
    setIsSubmitting(true);

    try {
      dispatch(endSession());

      // Chuyen blob URL tam thoi (URL.createObjectURL) thanh Blob that de gui qua FormData
      let speakingRecordingBlob = null;
      if (speakingRecordingBlobUrl) {
        const res = await fetch(speakingRecordingBlobUrl);
        speakingRecordingBlob = await res.blob();
      }

      const result = await submitExam({
        examId: realExamId,
        skill,
        sessionId,
        answers,
        cheatingLog,
        writingTask1Text: writingTask1,
        writingTask2Text: writingTask2,
        speakingRecordingBlob,
      });

      const dbKey = `${sessionId}_${skill}`;
      clearAnswersFromDB(dbKey);

      // Luu lai snapshot cau tra loi + diem so TRUOC KHI reset Redux,
      // de trang /result co du lieu hien thi (Redux se bi xoa sach ngay sau day).
      const navigationState = {
        examCode,
        skill,
        sessionId,
        scores: result.scores,
        userAnswers: answers,
      };

      dispatch(resetAnswers());
      navigate('/result', { replace: true, state: navigationState });
    } catch (err) {
      console.error('Nop bai that bai:', err);
      hasSubmittedRef.current = false; // cho phep thu lai neu nop that bai
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    examData,
    dispatch,
    skill,
    answers,
    cheatingLog,
    writingTask1,
    writingTask2,
    speakingRecordingBlobUrl,
    sessionId,
    navigate,
  ]);

  // Tu dong nop bai khi het gio (examSessionSlice.tick() tu chuyen status -> 'SUBMITTED')
  useEffect(() => {
    if (status === 'SUBMITTED' && !isSubmitting) {
      handleSubmit();
    }
  }, [status, isSubmitting, handleSubmit]);

  if (isLoading) return <p className="loading-state">Loading exam...</p>;
  if (loadError) return <p className="form-error">{loadError}</p>;
  if (!examData) return null;

  return (
    <div className="exam-room">
      <div className="exam-room-header">
        <CountdownTimer />
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Exam'}
        </button>
      </div>

      <div className="exam-room-body">
        <div className="exam-room-content">
          {skill === 'listening' && examData.listeningSet && (
            <div className="listening-section-container">
              {examData.listeningSet.sections[currentSectionIndex] && (
                <>
                  <AudioPlayer
                    key={currentSectionIndex}
                    src={getMediaUrl(examData.listeningSet.sections[currentSectionIndex].audioUrl)}
                    examMode
                  />
                  <ListeningForm
                    questions={examData.listeningSet.sections[currentSectionIndex].questions}
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
              <ReadingSplit key={passage.passageNumber} passage={passage} />
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

        {(skill === 'listening' || skill === 'reading') && (
          <Sidebar
            totalQuestions={
              skill === 'listening'
                ? (examData.listeningSet?.sections || []).reduce(
                    (sum, sec) => sum + (sec.questions?.length || 0),
                    0
                  )
                : (examData.readingSet?.passages || []).reduce(
                    (sum, p) => sum + (p.questions?.length || 0),
                    0
                  )
            }
            answeredIds={Object.keys(answers)}
            onJump={(qId) => {
              if (skill === 'listening' && examData?.listeningSet?.sections) {
                  const targetSectionIndex = examData.listeningSet.sections.findIndex(sec => 
                      sec.questions.some(q => q.qId === qId)
                  );
                  if (targetSectionIndex !== -1 && targetSectionIndex !== currentSectionIndex) {
                      setCurrentSectionIndex(targetSectionIndex);
                      setTimeout(() => {
                          document.getElementById(`question-${qId}`)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                      return;
                  }
              }
              document.getElementById(`question-${qId}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </div>
  );
}