import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    examId: null,
    skill: null,
    remainingSeconds: 0,
    status: 'IDLE',
    cheatingLog: [],
};

const examSessionSlice = createSlice({
    name: 'examSession',
    initialState,
    reducers: {
        startSession(state, action) {
            const { examId, skill, remainingSeconds } = action.payload;
            state.examId = examId;
            state.skill = skill;
            state.remainingSeconds = remainingSeconds;
            state.status = 'IN_PROGRESS';
            state.cheatingLog = [];
        },
        tick(state) {
            if (state.status !== 'IN_PROGRESS') return;

            if (state.remainingSeconds > 0) {
                state.remainingSeconds -= 1;
            }
            if (state.remainingSeconds <= 0) {
                state.status = 'SUBMITTED';
            }

        },
        logCheatingEvent(state, action) {
            state.cheatingLog.push({
                timestamp: Date.now(),
                type: action.payload.type,
            });
        },
        endSession(state) {
            state.status = 'SUBMITTED'
        },
        resetSession() {
            return initialState;
        }
    }
})

export const { startSession, tick, logCheatingEvent, endSession, resetSession } = examSessionSlice.actions;

export default examSessionSlice.reducer;