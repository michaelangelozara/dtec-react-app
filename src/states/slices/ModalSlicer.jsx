import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: { message: "", isOpen: false, type: "Idle"},
  reducers: {
    showModal: (state, action) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.type = action.payload.type
    },
    hideModal: (state) => {
      state.isOpen = false;
      state.message = '';
      state.type = "Idle"
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice.reducer;