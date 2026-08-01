import { useState, useRef, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setSpeakingRecording } from '../../store/slices/answerSlice'

export default function SpeakingRecorder({ cueCard }) {
    const prepSeconds = 60;
    const talkSeconds = 120;
    const [phase, setPhase] = useState('PREP');
    const [countdown, setCountdown] = useState(prepSeconds);
    const [errorMessage, setErrorMessage] = useState('');

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const autoStopTimeoutRef = useRef(null);

    const dispatch = useDispatch();
    useEffect(() => {
        if (phase !== 'PREP') return;

        countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownIntervalRef.current);
                    setPhase('RECORDING');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(countdownIntervalRef.current);
        }
    }, [phase]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        clearTimeout(autoStopTimeoutRef.current)
    }, [])

    useEffect(() => {
        if (phase !== 'RECORDING') return;

        let isCancelled = false;

        async function startRecording() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (isCancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;
                chunksRef.current = [];

                const recorder = new MediaRecorder(stream);
                mediaRecorderRef.current = recorder;

                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunksRef.current.push(e.data);
                };

                recorder.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    dispatch(setSpeakingRecording(url));
                    streamRef.current?.getTracks().forEach((track) => track.stop());
                    setPhase('DONE');
                };

                recorder.start();
                setCountdown(talkSeconds);

                autoStopTimeoutRef.current = setTimeout(() => {
                    recorder.stop();
                }, talkSeconds * 1000);
            } catch (err) {
                setErrorMessage('Cannot access to microphone. Please allow access and try again.');
                setPhase('ERROR');
            } finally {
                isCancelled = true;
            }
        }
        startRecording();
    }, [phase])

    useEffect(() => {
        return () => {
            clearInterval(countdownIntervalRef.current)
            clearTimeout(autoStopTimeoutRef.current)
            streamRef.current?.getTracks().forEach((track) => track.stop())
        }
    }, [])

    function handleRetry() {
        setErrorMessage('')
        setPhase('PREP')
        setCountdown(prepSeconds);
    }

    return (
        <div className="speaking-recorder">
            <h3>Part 2: Cue Card</h3>
            <p className="cue-card-text">{cueCard.cueCard}</p>

            {phase === 'PREP' && (
                <div className="phase-prep">
                    <p>Preparing to talk:</p>
                    <div className="countdown-display">{countdown}s</div>
                </div>
            )}

            {phase === 'RECORDING' && (
                <div className="phase-recording">
                    <p className="recording-indicator">Recording ...</p>
                    <div className="countdown-display">{countdown}s</div>
                    <button onClick={stopRecording} className="btn btn-danger">
                        Stop Recording
                    </button>
                </div>
            )}

            {phase === 'DONE' && (
                <div className="phase-done">
                    <p>Recorded Successfully. You can listen again before submitting.</p>
                    <button onClick={handleRetry} className="btn btn-secondary">
                        Record Again
                    </button>
                </div>
            )}

            {phase === 'ERROR' && (
                <div className="phase-error">
                    <p className="form-error">{errorMessage}</p>
                    <button onClick={handleRetry} className="btn btn-primary">
                        Retry
                    </button>
                </div>
            )}
        </div>
    );


}
