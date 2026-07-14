import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserProfile = {
  name: string;
  avatar: string; // e.g. "/avatars/avatar1.svg"
  gender: "male" | "female" | "other" | "";
  address: string;
};

type UserState = {
  profile: UserProfile;
  phone: string | null;
  isVolunteer: boolean;
  reportsCount: number;
  rescuesCount: number;
};

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  avatar: "/avatars/avatar1.svg",
  gender: "",
  address: "",
};

const loadProfile = (): UserProfile => {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const saved = localStorage.getItem("rescue_user_profile");
    return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
};

const saveProfile = (profile: UserProfile) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("rescue_user_profile", JSON.stringify(profile));
  }
};

const initialState: UserState = {
  profile: loadProfile(),
  phone: null,
  isVolunteer: false,
  reportsCount: 12,
  rescuesCount: 5,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      state.profile = { ...state.profile, ...action.payload };
      saveProfile(state.profile);
    },
    clearProfile(state) {
      state.profile = DEFAULT_PROFILE;
      saveProfile(DEFAULT_PROFILE);
    },
    incrementReports(state) {
      state.reportsCount += 1;
    },
    setVolunteer(state, action: PayloadAction<boolean>) {
      state.isVolunteer = action.payload;
    },
  },
});

export const { setUser, updateProfile, clearProfile, incrementReports, setVolunteer } = userSlice.actions;
export default userSlice.reducer;
