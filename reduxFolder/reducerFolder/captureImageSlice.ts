import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CaptureImageState {
  photo: any;  
}

const initialState: CaptureImageState = {
  photo: null,
};

const captureImageSlice = createSlice({
  name: 'captureImage',
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<any>) => {
      state.photo = action.payload;
    },
    clearImage: (state) => {
      state.photo = null;
    },
  },
});

export const { setImage, clearImage } = captureImageSlice.actions;
export default captureImageSlice.reducer;
