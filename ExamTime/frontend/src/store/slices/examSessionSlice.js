import { createSlice } from 'reduxt/toolkit';
const initialState = {
    examId: null,
    skill: null,
    remainingSecond: 0,
    status: 'IDLE',
    cheatingLog: [],
};

const examSessionSlice = createSlice({
    name: 'examSession',
    initialState,
    reducers: {
        startSession(state, action) {
            const { examnId, skill, remainingSecond } = action.payload;
            state.examId = examnId;
            state.skill = skill;
            state.remainingSecond = remainingSecond;
            state.status = 'IN_PROGRESS';
            state.cheatingLog = [];
        },
        tick(state) {
            if (state.status !== 'IN_PROGRESS') return;

            if (state.remainingSecond > 0) {
                state.remainingSecond -= 1;
            }
            if (state.remainingSecond <= 0) {
                state.status = 'TIME_UP';
            }

        },
        logCheatingEvent(state, action) {
            state.cheatingLog.push({
                timestamp: Date.now(),
                type: action.payload.type,
            });
        },
        endSession(state) {
            state.status = 'SUBMITED'
        },
        resetSession() {
            return initialState;
        }
    }
})

export const { startSession, tick, logCheatingEvent, endSession, resetSession } = examSessionSlice.actions;

export default examSessionSlice.reducer;