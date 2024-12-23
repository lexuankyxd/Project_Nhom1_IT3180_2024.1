import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostDataState {
  post: {
    post_id: string;
    profile_id: string;
    comment_count: number;
    like_count: number;
    content: string;
    media: string;
    latitude: string;
    longitude: string;
    comments: {
      comment_id: string;
      profile_id: string;
      post_id: string;
      reply_comment: string | null;
      content: string;
      timestamp: string;
    }[];
    username: string;
    img: string;
  } | null;
}

const initialState: PostDataState = {
  post: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<PostDataState['post']>) => {
      state.post = action.payload;
    },
    clearPost: (state) => {
      state.post = null;
    }
}});

export const { setPost, clearPost } =
  postSlice.actions;
export default postSlice.reducer;
