import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/AxiosConfig";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
    try {
        const response = await axios.get("/users/me");
        return response.data.data;
    } catch (err) {
    }
});

const userSlice = createSlice({
    name: "users",
    initialState: { user: null, status: "Idle" },
    reducers: {
        deleteUser: (state) => {
            state.user = null;
            state.status = "Idle";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = "Loading";
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = "Succeeded";
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.status = "Failed";
            })
    }
});

export const { deleteUser } = userSlice.actions;
export default userSlice.reducer;