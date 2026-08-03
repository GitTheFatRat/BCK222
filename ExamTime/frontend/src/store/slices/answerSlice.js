import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    byQuestionId: {},
    writingTask1: '',
    writingTask2: '',
    speakingRecordingBlobUrl: null,
};

const answerSlice = createSlice({
    name: 'answers',
    initialState,
    reducers: {
        setAnswer(state, action) {
            const { qId, value } = action.payload
            state.byQuestionId[qId] = value
        },
        setWritingContent(state, action) {
            const { task, content, value } = action.payload;
            const text = content !== undefined ? content : value;
            if (task === 'Task1') {
                state.writingTask1 = text;
            } else if (task === 'Task2') {
                state.writingTask2 = text;
            }
        },
        setSpeakingRecording(state, action) {
            state.speakingRecordingBlobUrl = action.payload;
        },
        clearAnswer(state, action) {
            delete state.byQuestionId[action.payload.questionId]
        },
        setAllAnswers(state, action) {
            state.byQuestionId = action.payload.byQuestionId || {};
            state.writingTask1 = action.payload.writingTask1 || '';
            state.writingTask2 = action.payload.writingTask2 || '';
            // speakingRecordingBlobUrl is not persisted across reloads usually
        },
        resetAnswers() {
            return initialState;
        }
    }
});

export const { setAnswer, setWritingContent, setSpeakingRecording, clearAnswer, setAllAnswers, resetAnswers } = answerSlice.actions;

export default answerSlice.reducer;