import { useRef, useState, useEffect } from 'react';

export default function AudioPlayer({ src, examMode = false }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        function handlePlay() {
            setIsPlaying(true);
            setHasPlayedOnce(true);
        }
        function handlePause() {
            setIsPlaying(false);
        }
        function handleEnded() {
            setIsPlaying(false);
        }

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    function handleTogglePlay() {
        const audio = audioRef.current;
        if (!audio) return;
        if (examMode && hasPlayedOnce && audio.paused) {
            return;
        }

        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    return (
        <div className="audio-player">
            <audio
                ref={audioRef}
                src={src}
                controls={!examMode}
                controlsList={examMode ? 'nodownload noplaybackrate' : undefined}
                onContextMenu={(e) => examMode && e.preventDefault()}
                onSeeking={(e) => {
                    if (examMode) e.preventDefault();
                }}
            />

            {examMode && (
                <>
                    <button
                        type="button"
                        className="audio-player__toggle"
                        onClick={handleTogglePlay}
                        disabled={hasPlayedOnce && !isPlaying}
                    >
                        {isPlaying ? 'Tam dung' : hasPlayedOnce ? 'Da nghe xong' : 'Phat am thanh'}
                    </button>

                    <p className="audio-player__notice">
                        Real Exam rule: You only listen to this audio <b>one time</b>, cannot rewind or download.
                    </p>
                </>
            )}
        </div>
    );
}