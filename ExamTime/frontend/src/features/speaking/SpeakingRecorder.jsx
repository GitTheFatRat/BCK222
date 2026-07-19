import { useState, useRef, useEffect, useCallBack } from 'react'
import { useDispatch } from 'react-redux'
import { setSpeakingRecording } from '../../store/slices/answerSlice'

export default function SpeakingRecorder({ cueCard }) {
    const [phase, setPhase] = useState('PREP');
    const [countdown, setCountdown] = useState(cueCard.prepSeconds);
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

    })
}