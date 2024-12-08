import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/UserSlicer";
import ModalSlice from "./slices/ModalSlicer"

const store = configureStore({
    reducer: {
        users: UserSlice,
        modal: ModalSlice,
    }
});

export default store;