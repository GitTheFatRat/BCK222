import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/authSlice.js";
import examSessionReducer from "./slices/examSessionSlice.js";
import answerReducer from "./slices/answerSlice.js";
import userResponseReducer from "./slices/userResponseSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        examSession: examSessionReducer,
        answers: answerReducer,
    },
    devTools: import.meta.env.MODE !== 'production',
});