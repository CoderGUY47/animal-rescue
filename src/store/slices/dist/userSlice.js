"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
exports.__esModule = true;
exports.setVolunteer = exports.incrementReports = exports.clearProfile = exports.updateProfile = exports.setUser = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var DEFAULT_PROFILE = {
    name: "",
    avatar: "/avatars/avatar1.svg",
    gender: "",
    address: ""
};
var loadProfile = function () {
    if (typeof window === "undefined")
        return DEFAULT_PROFILE;
    try {
        var saved = localStorage.getItem("rescue_user_profile");
        return saved
            ? __assign(__assign({}, DEFAULT_PROFILE), JSON.parse(saved)) : DEFAULT_PROFILE;
    }
    catch (_a) {
        return DEFAULT_PROFILE;
    }
};
var saveProfile = function (profile) {
    if (typeof window !== "undefined") {
        localStorage.setItem("rescue_user_profile", JSON.stringify(profile));
    }
};
var initialState = {
    profile: loadProfile(),
    phone: null,
    isVolunteer: false,
    reportsCount: 12,
    rescuesCount: 5
};
var userSlice = toolkit_1.createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser: function (state, action) {
            return __assign(__assign({}, state), action.payload);
        },
        updateProfile: function (state, action) {
            state.profile = __assign(__assign({}, state.profile), action.payload);
            saveProfile(state.profile);
        },
        clearProfile: function (state) {
            state.profile = DEFAULT_PROFILE;
            saveProfile(DEFAULT_PROFILE);
        },
        incrementReports: function (state) {
            state.reportsCount += 1;
        },
        setVolunteer: function (state, action) {
            state.isVolunteer = action.payload;
        }
    }
});
exports.setUser = (_a = userSlice.actions, _a.setUser), exports.updateProfile = _a.updateProfile, exports.clearProfile = _a.clearProfile, exports.incrementReports = _a.incrementReports, exports.setVolunteer = _a.setVolunteer;
exports["default"] = userSlice.reducer;
