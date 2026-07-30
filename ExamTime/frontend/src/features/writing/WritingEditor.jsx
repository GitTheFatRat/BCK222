import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWritingContent } from '../../store/slices/answerSlice';
import { getMediaUrl } from '../../config/media.js';

export default function WritingEditor({ task, minWords, prompt, imageUrl }) {
    const dispatch = useDispatch();
    const stateKey = task === 'Task1' ? 'writingTask1' : 'writingTask2';
    const rawContent = useSelector((state) => state.answers[stateKey]);
    const content = rawContent || '';

    const wordCount = useMemo(() => {
        return content.trim().length === 0 ? 0 : content.trim().split(/\s+/).length;
    }, [content]);

    function handleChange(e) {
        dispatch(setWritingContent({ task, content: e.target.value }));
    }

    const isBelowMin = useMemo(() => wordCount < minWords, [wordCount, minWords]);

    return (
        <div className='writing-editor'>
            {prompt && <p className='writing-prompt'>{prompt}</p>}
            {imageUrl && <img src={getMediaUrl(imageUrl)} alt={`${task} chart`} className='writing-chart-image' />}
            <textarea
                value={content}
                onChange={handleChange}
                placeholder="Start writing here..."
                rows={20}
                className='writing-textarea'
            />
            <div className={`word-count ${isBelowMin ? 'warning' : 'ok'}`}>
                {wordCount} / {minWords} words
                {isBelowMin && <span> - Need {minWords - wordCount} more words to meet the minimum</span>}
            </div>

        </div>
    )
}