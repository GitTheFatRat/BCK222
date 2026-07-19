import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    byQuestionId: {},
    writingTask1: '',
    writingTask2: '',
    speakingRecordBlobUrl: null,
};

const answerSlice = createSlice({
    name: 'answers',
    initialState,
    reducers: {
        setAnswer(state, action) {
            const { questionId, value } = action.payload
            state.byQuestionId[questionId] = value
        },
        setWritingContent(state, action) {
            const { questionId, value } = action.payload
            if (task === 'Task1') {
                state.writingTask1 = value;
            } else if (task === 'Task2') {
                state.writingTask2 = value;
            }
        },
        setSpeakingRecording(state, action) {
            state.speakingRecordingBlobUrl = action.payload;
        },
        clearAnswer(state, action) {
            delete state.byQuestionId[action.payload.questionId]
        },
        resetAnswers() {
            return initialState;
        }
    }
});

export const { setAnswer, setWritingContent, setSpeakingRecording, clearAnswer, resetAnswers } = answerSlice.actions;

export default answerSlice.reducer;