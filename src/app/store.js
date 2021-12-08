import {configureStore} from '@reduxjs/toolkit';
import accessTokenReducer from "../features/accessToken/accessTokenSlice";
import userReducer from "../features/user/userSlice";
import modeReducer from "../features/mode/modeSlice";
import refreshTokenReducer from "../features/refreshToken/refreshTokenSlice";

export const store = configureStore({
    reducer: {
        accessToken: accessTokenReducer,
        refreshToken: refreshTokenReducer,
        user: userReducer,
        mode: modeReducer,
    },
});
