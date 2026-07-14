"use client";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var select_1 = require("@/components/ui/select");
var fa_1 = require("react-icons/fa");
var next_themes_1 = require("next-themes");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var link_1 = require("next/link");
var image_1 = require("next/image");
var hooks_1 = require("@/store/hooks");
var userSlice_1 = require("@/store/slices/userSlice");
var language_provider_1 = require("@/components/providers/language-provider");
var tb_1 = require("react-icons/tb");
var fa_2 = require("react-icons/fa");
var AVATARS = [
    "/avatars/avatar1.svg",
    "/avatars/avatar2.svg",
    "/avatars/avatar3.svg",
    "/avatars/avatar4.svg",
    "/avatars/avatar5.svg",
    "/avatars/avatar6.svg",
    "/avatars/avatar7.svg",
    "/avatars/avatar8.svg",
    "/avatars/avatar9.svg",
    "/avatars/avatar10.svg",
    "/avatars/avatar11.svg",
    "/avatars/avatar12.svg",
    "/avatars/avatar13.svg",
    "/avatars/avatar14.svg",
    "/avatars/avatar15.svg",
];
var LANGUAGE_LIST = [
    { name: "English", label: "English" },
    { name: "Chinese", label: "中文" },
    { name: "Spanish", label: "Español" },
    { name: "Hindi", label: "हिन्दी" },
    { name: "Arabic", label: "العربية" },
    { name: "Bengali", label: "বাংলা" },
    { name: "Portuguese", label: "Português" },
    { name: "Russian", label: "Русский" },
    { name: "Japanese", label: "日本語" },
    { name: "Punjabi", label: "ਪੰਜਾਬੀ" },
    { name: "German", label: "Deutsch" },
    { name: "French", label: "Français" },
    { name: "Telugu", label: "తెలుగు" },
    { name: "Turkish", label: "Türkçe" },
    { name: "Tamil", label: "தமிழ்" },
    { name: "Vietnamese", label: "Tiếng Việt" },
    { name: "Korean", label: "한국어" },
    { name: "Italian", label: "Italiano" },
    { name: "Marathi", label: "मराठी" },
    { name: "Urdu", label: "اردو" },
];
function SettingsPage() {
    var _a;
    var _b = next_themes_1.useTheme(), theme = _b.theme, setTheme = _b.setTheme;
    var _c = react_1.useState(false), mounted = _c[0], setMounted = _c[1];
    var _d = react_1.useState(false), isAccordionOpen = _d[0], setIsAccordionOpen = _d[1];
    var _e = react_1.useState(false), isEditing = _e[0], setIsEditing = _e[1];
    var _f = language_provider_1.useLanguage(), language = _f.language, setLanguage = _f.setLanguage, t = _f.t;
    var dispatch = hooks_1.useAppDispatch();
    var profile = hooks_1.useAppSelector(function (s) { return s.user.profile; });
    var volunteers = hooks_1.useAppSelector(function (state) { return state.volunteers.items; });
    // local draft for editing
    var _g = react_1.useState(profile), draft = _g[0], setDraft = _g[1];
    var _h = react_1.useState(true), isOnline = _h[0], setIsOnline = _h[1];
    react_1.useEffect(function () {
        setMounted(true);
    }, []);
    // sync draft when profile loads from localStorage
    react_1.useEffect(function () {
        setDraft(profile);
    }, [profile]);
    // online/offline status
    react_1.useEffect(function () {
        if (typeof window !== "undefined") {
            setIsOnline(navigator.onLine);
            var goOnline_1 = function () { return setIsOnline(true); };
            var goOffline_1 = function () { return setIsOnline(false); };
            window.addEventListener("online", goOnline_1);
            window.addEventListener("offline", goOffline_1);
            return function () {
                window.removeEventListener("online", goOnline_1);
                window.removeEventListener("offline", goOffline_1);
            };
        }
    }, []);
    var handleLanguageChange = function (lang) {
        setLanguage(lang);
    };
    var handleSave = function () {
        dispatch(userSlice_1.updateProfile(draft));
        setIsEditing(false);
    };
    var handleClear = function () {
        dispatch(userSlice_1.clearProfile());
        setIsEditing(false);
    };
    var topContributors = __spreadArrays(volunteers).sort(function (a, b) { return b.rescues - a.rescues; })
        .slice(0, 3);
    if (!mounted)
        return null;
    var hasProfile = profile.name.trim() !== "";
    return (React.createElement("div", { className: "flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-20" },
        React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("h1", { className: "text-2xl font-semibold tracking-tight" }, t("settings.title"))),
        React.createElement("div", { className: "space-y-3" },
            React.createElement("h3", { className: "font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2" },
                React.createElement(fa_1.FaUserCircle, { className: "w-4 h-4 text-primary" }),
                " My Profile"),
            React.createElement(card_1.Card, { className: "overflow-hidden" },
                React.createElement(card_1.CardContent, { className: "p-4" }, !isEditing ? (
                /* ── View Mode: Side-by-side ── */
                React.createElement("div", { className: "flex items-center gap-5 animate-in fade-in duration-300" },
                    React.createElement("div", { className: "relative shrink-0" },
                        React.createElement("div", { className: "w-20 h-20 rounded-full overflow-hidden border-4 border-black/60 dark:border-white/60 bg-muted shadow-md" },
                            React.createElement(image_1["default"], { src: profile.avatar, alt: "Profile avatar", width: 80, height: 80, className: "w-full h-full object-cover", unoptimized: true })),
                        React.createElement("div", { className: utils_1.cn("absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background shadow-md transition-all duration-300", isOnline
                                ? "bg-emerald-500 text-white animate-pulse"
                                : "bg-slate-400 text-white"), title: isOnline ? "Active (Online)" : "Offline" },
                            React.createElement(fa_2.FaPaw, { className: "w-3 h-3" })),
                        React.createElement("button", { onClick: function () { return setIsEditing(true); }, className: "absolute -bottom-1 -right-1 w-7 h-7 bg-black hover:bg-black/90 text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all border border-white/20", "aria-label": "Edit profile" },
                            React.createElement(tb_1.TbPhotoEdit, { className: "w-4 h-4" }))),
                    React.createElement("div", { className: "flex-1 min-w-0 flex flex-col justify-center gap-1.5" },
                        !hasProfile && (React.createElement("p", { className: "text-sm font-semibold text-foreground leading-snug" }, "Set up profile")),
                        React.createElement("div", { className: "flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 min-w-0" },
                            React.createElement("span", { className: "text-xs font-medium text-muted-foreground shrink-0" }, "\uD83D\uDC64"),
                            React.createElement("span", { className: utils_1.cn("text-xs truncate", profile.name
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground italic") }, profile.name || "Enter your name")),
                        React.createElement("div", { className: "flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 min-w-0" },
                            React.createElement("span", { className: "text-xs font-medium text-muted-foreground shrink-0" }, "\u26A7"),
                            React.createElement("span", { className: utils_1.cn("text-xs capitalize truncate", profile.gender
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground italic") }, profile.gender || "Select gender")),
                        React.createElement("div", { className: "flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 min-w-0" },
                            React.createElement("span", { className: "text-xs font-medium text-muted-foreground shrink-0" }, "\uD83D\uDCCD"),
                            React.createElement("span", { className: utils_1.cn("text-xs truncate", profile.address
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground italic") }, profile.address || "Mirpur, Dhaka"))))) : (
                /* ── Edit Mode Form ── */
                React.createElement("div", { className: "flex flex-col gap-4 animate-in fade-in duration-200" },
                    React.createElement("div", { className: "flex items-center gap-4 border-b pb-3" },
                        React.createElement("div", { className: "relative shrink-0" },
                            React.createElement("div", { className: "w-14 h-14 rounded-full overflow-hidden border-2 border-black/60 dark:border-white/60 bg-muted shadow-sm" },
                                React.createElement(image_1["default"], { src: draft.avatar, alt: "Profile avatar preview", width: 56, height: 56, className: "w-full h-full object-cover", unoptimized: true })),
                            React.createElement("div", { className: utils_1.cn("absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center border border-background shadow-sm transition-all duration-300", isOnline
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-400 text-white") },
                                React.createElement(fa_2.FaPaw, { className: "w-2 h-2" }))),
                        React.createElement("div", { className: "flex flex-col" },
                            React.createElement("span", { className: "font-semibold text-sm text-foreground" }, "Editing Profile"),
                            React.createElement("span", { className: "text-xs text-muted-foreground" }, "Select an avatar and fill details below"))),
                    React.createElement("div", null,
                        React.createElement(label_1.Label, { className: "text-xs text-muted-foreground mb-2 block" }, "Choose Avatar"),
                        React.createElement("div", { className: "grid grid-cols-5 gap-2" }, AVATARS.map(function (src) { return (React.createElement("button", { key: src, onClick: function () { return setDraft(function (d) { return (__assign(__assign({}, d), { avatar: src })); }); }, className: utils_1.cn("w-full aspect-square rounded-full overflow-hidden border-2 transition-all active:scale-95", draft.avatar === src
                                ? "border-primary ring-2 ring-primary/30 scale-105"
                                : "border-muted hover:border-primary/40"), "aria-label": "Select " + src },
                            React.createElement(image_1["default"], { src: src, alt: "avatar", width: 48, height: 48, className: "w-full h-full", unoptimized: true }))); }))),
                    React.createElement("div", { className: "flex flex-col gap-1.5" },
                        React.createElement(label_1.Label, { htmlFor: "profile-name", className: "text-xs text-muted-foreground" }, "Full Name"),
                        React.createElement(input_1.Input, { id: "profile-name", placeholder: "Enter your name", value: draft.name, onChange: function (e) {
                                return setDraft(function (d) { return (__assign(__assign({}, d), { name: e.target.value })); });
                            }, className: "h-9 text-sm" })),
                    React.createElement("div", { className: "flex flex-col gap-1.5" },
                        React.createElement(label_1.Label, { className: "text-xs text-muted-foreground" }, "Gender"),
                        React.createElement(select_1.Select, { value: draft.gender, onValueChange: function (v) {
                                return setDraft(function (d) { return (__assign(__assign({}, d), { gender: v })); });
                            } },
                            React.createElement(select_1.SelectTrigger, { className: "h-9 text-sm" },
                                React.createElement(select_1.SelectValue, { placeholder: "Select gender" })),
                            React.createElement(select_1.SelectContent, null,
                                React.createElement(select_1.SelectItem, { value: "male" }, "Male"),
                                React.createElement(select_1.SelectItem, { value: "female" }, "Female"),
                                React.createElement(select_1.SelectItem, { value: "other" }, "Prefer not to say")))),
                    React.createElement("div", { className: "flex flex-col gap-1.5" },
                        React.createElement(label_1.Label, { htmlFor: "profile-address", className: "text-xs text-muted-foreground" }, "Address"),
                        React.createElement(input_1.Input, { id: "profile-address", placeholder: "Mirpur, Dhaka", value: draft.address, onChange: function (e) {
                                return setDraft(function (d) { return (__assign(__assign({}, d), { address: e.target.value })); });
                            }, className: "h-9 text-sm" })),
                    React.createElement("div", { className: "flex gap-2 pt-1" },
                        React.createElement("button", { onClick: handleSave, className: "flex-1 flex items-center justify-center gap-2 h-9 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all" },
                            React.createElement(fa_1.FaCheck, { className: "w-3.5 h-3.5" }),
                            " Save"),
                        React.createElement("button", { onClick: function () {
                                setDraft(profile);
                                setIsEditing(false);
                            }, className: "flex-1 flex items-center justify-center gap-2 h-9 border text-sm font-semibold rounded-lg hover:bg-muted/50 active:scale-95 transition-all" }, "Cancel")),
                    hasProfile && (React.createElement("button", { onClick: handleClear, className: "flex items-center justify-center gap-2 text-xs text-destructive hover:underline pt-1" },
                        React.createElement(fa_1.FaTrash, { className: "w-3 h-3" }),
                        " Clear profile"))))))),
        React.createElement("div", { className: "space-y-3" },
            React.createElement("h3", { className: "font-semibold text-sm text-muted-foreground uppercase tracking-wider" }, t("settings.appearance")),
            React.createElement(card_1.Card, null,
                React.createElement(card_1.CardContent, { className: "p-4 flex flex-col gap-4" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("span", { className: "font-semibold text-sm" }, t("settings.themeMode"))),
                    React.createElement("div", { className: "grid grid-cols-3 gap-2" },
                        React.createElement("button", { onClick: function () { return setTheme("light"); }, className: utils_1.cn("flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95 text-xs font-semibold", theme === "light"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-muted hover:border-primary/50 text-muted-foreground") },
                            React.createElement(fa_1.FaSun, { className: "w-5 h-5" }),
                            t("settings.light")),
                        React.createElement("button", { onClick: function () { return setTheme("dark"); }, className: utils_1.cn("flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95 text-xs font-semibold", theme === "dark"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-muted hover:border-primary/50 text-muted-foreground") },
                            React.createElement(fa_1.FaMoon, { className: "w-5 h-5" }),
                            t("settings.dark")),
                        React.createElement("button", { onClick: function () { return setTheme("system"); }, className: utils_1.cn("flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95 text-xs font-semibold", theme === "system"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-muted hover:border-primary/50 text-muted-foreground") },
                            React.createElement(fa_1.FaDesktop, { className: "w-5 h-5" }),
                            t("settings.system")))))),
        React.createElement("div", { className: "space-y-3" },
            React.createElement("h3", { className: "font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2" },
                React.createElement(image_1["default"], { src: "/assets/languages.png", alt: "Language", width: 20, height: 20, className: "w-5 h-5", unoptimized: true }),
                " ",
                t("settings.language")),
            React.createElement(card_1.Card, { className: "overflow-hidden" },
                React.createElement("button", { onClick: function () { return setIsAccordionOpen(!isAccordionOpen); }, className: "w-full flex items-center justify-between p-4 bg-transparent hover:bg-muted/50 transition-colors focus:outline-none" },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        React.createElement("div", { className: "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center" },
                            React.createElement(image_1["default"], { src: "/assets/languages.png", alt: "Language", width: 32, height: 32, className: "w-full h-full object-cover", unoptimized: true })),
                        React.createElement("div", { className: "flex flex-col items-start" },
                            React.createElement("span", { className: "font-semibold text-sm" }, t("settings.selectLang")),
                            React.createElement("span", { className: "text-xs text-muted-foreground" },
                                "Active:",
                                " ",
                                ((_a = LANGUAGE_LIST.find(function (l) { return l.name === language; })) === null || _a === void 0 ? void 0 : _a.label) ||
                                    language))),
                    React.createElement(fa_1.FaChevronRight, { className: utils_1.cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-200", isAccordionOpen && "rotate-90") })),
                React.createElement("div", { className: utils_1.cn("grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-in-out", isAccordionOpen && "grid-rows-[1fr]") },
                    React.createElement("div", { className: "overflow-hidden bg-muted/20 border-t border-border/10" },
                        React.createElement("div", { className: "p-4 grid grid-cols-2 gap-2 max-h-80 overflow-y-auto" }, LANGUAGE_LIST.map(function (lang) { return (React.createElement("button", { key: lang.name, onClick: function () {
                                handleLanguageChange(lang.name);
                                setIsAccordionOpen(false);
                            }, className: utils_1.cn("flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all active:scale-95 text-xs font-bold", language === lang.name
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-muted hover:border-primary/50 text-muted-foreground") }, lang.label)); })))))),
        React.createElement("div", { className: "space-y-3" },
            React.createElement("h3", { className: "font-semibold text-sm text-muted-foreground uppercase tracking-wider" }, t("settings.preferences")),
            React.createElement(card_1.Card, null,
                React.createElement(card_1.CardContent, { className: "p-0" },
                    React.createElement(link_1["default"], { href: "/settings/notifications", className: "w-full flex items-center justify-between p-4 border-b hover:bg-muted/50 transition-colors" },
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement("div", { className: "w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400" },
                                React.createElement(fa_1.FaBell, { className: "w-4 h-4" })),
                            React.createElement("div", { className: "flex flex-col items-start" },
                                React.createElement("span", { className: "font-semibold text-sm" }, t("settings.notifications")),
                                React.createElement("span", { className: "text-xs text-muted-foreground" }, t("settings.notificationsSub")))),
                        React.createElement(fa_1.FaChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground" })),
                    React.createElement(link_1["default"], { href: "/settings/privacy", className: "w-full flex items-center justify-between p-4 border-b hover:bg-muted/50 transition-colors" },
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement("div", { className: "w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400" },
                                React.createElement(fa_1.FaShieldAlt, { className: "w-4 h-4" })),
                            React.createElement("div", { className: "flex flex-col items-start" },
                                React.createElement("span", { className: "font-semibold text-sm" }, t("settings.privacy")),
                                React.createElement("span", { className: "text-xs text-muted-foreground" }, t("settings.privacySub")))),
                        React.createElement(fa_1.FaChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground" })),
                    React.createElement("div", { className: "w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors" },
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement("div", { className: "w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400" },
                                React.createElement(fa_1.FaInfoCircle, { className: "w-4 h-4" })),
                            React.createElement("div", { className: "flex flex-col items-start" },
                                React.createElement("span", { className: "font-semibold text-sm" }, t("settings.about")),
                                React.createElement("span", { className: "text-xs text-muted-foreground" }, t("settings.aboutSub")))),
                        React.createElement(fa_1.FaChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground" }))))),
        React.createElement("div", { className: "space-y-3" },
            React.createElement("h3", { className: "font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2" },
                React.createElement(fa_1.FaTrophy, { className: "text-amber-500" }),
                " ",
                t("settings.contributors")),
            React.createElement(card_1.Card, null,
                React.createElement(card_1.CardContent, { className: "p-0" },
                    topContributors.map(function (user, i) { return (React.createElement("div", { key: user.id, className: utils_1.cn("flex items-center gap-3 p-4 hover:bg-muted/40 transition-colors", i < 2 && "border-b") },
                        React.createElement("div", { className: "w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0" }, i + 1),
                        React.createElement("div", { className: "flex flex-col flex-1 min-w-0" },
                            React.createElement("span", { className: "font-semibold text-sm truncate" }, user.name),
                            React.createElement("span", { className: "text-xs text-muted-foreground" }, user.role === "Senior Volunteer"
                                ? t("settings.seniorVolunteer")
                                : user.role === "Transport Specialist"
                                    ? t("settings.transportSpecialist")
                                    : user.role === "Foster Parent"
                                        ? t("settings.fosterParent")
                                        : user.role)),
                        React.createElement("div", { className: "flex items-center gap-1 text-amber-500 shrink-0" },
                            React.createElement(fa_1.FaStar, { className: "w-3.5 h-3.5" }),
                            React.createElement("span", { className: "text-sm font-bold" }, user.rescues)))); }),
                    React.createElement(link_1["default"], { href: "/community", className: "w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-t" },
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement("div", { className: "w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600" },
                                React.createElement(fa_1.FaUsers, { className: "w-4 h-4" })),
                            React.createElement("div", { className: "flex flex-col items-start" },
                                React.createElement("span", { className: "font-semibold text-sm" }, t("settings.viewCommunity")),
                                React.createElement("span", { className: "text-xs text-muted-foreground" }, t("settings.communitySub")))),
                        React.createElement(fa_1.FaChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground" })))))));
}
exports["default"] = SettingsPage;
