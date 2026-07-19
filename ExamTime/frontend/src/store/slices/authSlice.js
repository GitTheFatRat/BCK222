import { createSlice } from '@reduxjs/toolkit'

const TOKEN_STORAGE_KEY = 'examtime_token'
const USER_STORAGE_KEY = 'examtime_user'

function loadInitialState() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);

    let user = null;
    try {
        user = rawUser ? JSON.parse(rawUser) : null;
    } catch {
        user = null;
    }

    return {
        user,
        token,
        isAuthenticated: Boolean(token && user),
    };
}

const authSlice = createSlice({
    name: 'auth',
    initialState: loadInitialState,
    reducers: {
        loginSuccess(state, action) {
            const { token, user } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem(TOKEN_STORAGE_KEY, token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        },
        updateUser(state, action) {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state.user));
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    }
});