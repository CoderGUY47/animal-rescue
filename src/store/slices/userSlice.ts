import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UserState = {
 name: string | null;
 phone: string | null;
 isVolunteer: boolean;
 reportsCount: number;
 rescuesCount: number;
};

const initialState: UserState = {
 name: null,
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
 incrementReports(state) {
 state.reportsCount += 1;
 },
 setVolunteer(state, action: PayloadAction<boolean>) {
 state.isVolunteer = action.payload;
 },
 },
});

export const { setUser, incrementReports, setVolunteer } = userSlice.actions;
export default userSlice.reducer;
