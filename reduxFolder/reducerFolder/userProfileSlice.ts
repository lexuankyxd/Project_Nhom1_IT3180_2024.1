import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Account {
  account_id: string;
  phone_number: string;
  email: string;
  password_hash: string;
  user_profile: string;
  username: string;
}

interface Profile {
  _id: string;
  name: string;
  city: string;
  friendCount: number;
  description: string;
  imageId: string;
  profileTags: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MyFeed {
  post_id: string;
  profile_id: string;
  comment_count: number;
  like_count: number;
  content: string;
  media: string;
  latitude: string;
  longitude: string;
}

interface FriendRequest {
  sender: string;
  receiver: string;
  timestamp: string;
}

interface UserProfileState {
  account: Account;
  profile: Profile;
  myPost: any[]; 
  myFeed: any[];
  friends: any[]; 
  friend_reqs: FriendRequest[];
  messages: any[];
}

const initialState: UserProfileState = {
  account: {
    account_id: '',
    phone_number: '',
    email: '',
    password_hash: '',
    user_profile: '',
    username: '',
  },
  profile: {
    _id: '',
    name: '',
    city: '',
    friendCount: 0,
    description: '',
    imageId: '',
    profileTags: [],
    createdAt: '',
    updatedAt: '',
    __v: 0,
  },
  myPost: [],
  myFeed: [],
  friends: [],
  friend_reqs: [],
  messages: [],
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<Account>) {
      state.account = action.payload;
    },
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
    setMyPost(state, action: PayloadAction<any[]>) {
      state.myPost = action.payload;
    },
    setMyFeed(state, action: PayloadAction<MyFeed[]>) {
      state.myFeed = action.payload;
    },
    setFriends(state, action: PayloadAction<any[]>) {
      state.friends = action.payload;
    },
    setFriendRequests(state, action: PayloadAction<FriendRequest[]>) {
      state.friend_reqs = action.payload;
    },
    setMessages(state, action: PayloadAction<any[]>) {
      state.messages = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
});

export const {
  setAccount,
  setProfile,
  setMyPost,
  setMyFeed,
  setFriends,
  setFriendRequests,
  setMessages,
  resetState,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
