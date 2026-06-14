"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var link_1 = require("next/link");
var image_1 = require("next/image");
var fa_1 = require("react-icons/fa");
var card_1 = require("@/components/ui/card");
var react_toastify_1 = require("react-toastify");
var dialog_1 = require("@/components/ui/dialog");
function HomePage() {
    var _a = react_1.useState(false), donateOpen = _a[0], setDonateOpen = _a[1];
    var _b = react_1.useState("25"), donateAmount = _b[0], setDonateAmount = _b[1];
    var _c = react_1.useState(""), customAmount = _c[0], setCustomAmount = _c[1];
    var _d = react_1.useState("card"), paymentMethod = _d[0], setPaymentMethod = _d[1];
    // Pointer dragging refs for categories swiper (matches map filter scroll exactly)
    var categoriesRef = react_1.useRef(null);
    var dragInfo = react_1.useRef({
        isDragging: false,
        startX: 0,
        scrollLeft: 0,
        dragged: false
    });
    var handlePointerDown = function (e) {
        var _a, _b;
        dragInfo.current.isDragging = true;
        dragInfo.current.startX =
            e.pageX - (((_a = categoriesRef.current) === null || _a === void 0 ? void 0 : _a.offsetLeft) || 0);
        dragInfo.current.scrollLeft = ((_b = categoriesRef.current) === null || _b === void 0 ? void 0 : _b.scrollLeft) || 0;
        dragInfo.current.dragged = false;
    };
    var handlePointerMove = function (e) {
        if (!dragInfo.current.isDragging || !categoriesRef.current)
            return;
        var x = e.pageX - categoriesRef.current.offsetLeft;
        var walk = (x - dragInfo.current.startX) * 1.5;
        categoriesRef.current.scrollLeft = dragInfo.current.scrollLeft - walk;
        if (Math.abs(walk) > 4) {
            dragInfo.current.dragged = true;
        }
    };
    var handlePointerUp = function () {
        dragInfo.current.isDragging = false;
    };
    var handleLinkClick = function (e) {
        if (dragInfo.current.dragged) {
            e.preventDefault();
        }
    };
    var handleDonateSubmit = function (e) {
        e.preventDefault();
        var finalAmount = donateAmount === "custom" ? customAmount : donateAmount;
        if (!finalAmount ||
            isNaN(Number(finalAmount)) ||
            Number(finalAmount) <= 0) {
            react_toastify_1.toast.error("Please enter a valid donation amount.");
            return;
        }
        react_toastify_1.toast.success("Thank you! A donation of $" + finalAmount + " has been processed successfully.");
        setDonateOpen(false);
        setCustomAmount("");
    };
    return (React.createElement("div", { className: "flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-8" },
        React.createElement("section", { className: "w-full" },
            React.createElement(link_1["default"], { href: "/report", className: "block w-full overflow-hidden rounded-2xl shadow-md active:scale-[0.99] hover:scale-[1.01] transition-all relative" },
                React.createElement("div", { className: "relative w-full aspect-[16/7]" },
                    React.createElement(image_1["default"], { src: "/assets/emergency.png", alt: "Emergency Alert Banner", fill: true, className: "object-cover object-center", priority: true, unoptimized: true }),
                    React.createElement("div", { className: "absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent z-[1]" }),
                    React.createElement("div", { className: "absolute bg-white/80 top-0 left-0 right-0 p-5 flex flex-col items-center text-center gap-1 z-[2]" },
                        React.createElement("h2", { className: "pt-10 text-3xl font-extrabold tracking-tight text-black drop-shadow-lg" },
                            "Alert ",
                            React.createElement("span", { className: "text-rose-500" }, "Emergency")),
                        React.createElement("p", { className: "text-sm text-black font-semibold drop-shadow-sm" }, "Quickly send a rescue request. Help is just a tap away."))))),
        React.createElement("section", null,
            React.createElement("div", { className: "grid grid-cols-3 gap-3" },
                React.createElement(link_1["default"], { href: "/rescues", className: "group block" },
                    React.createElement(card_1.Card, { className: "h-[160px] border border-slate-100 dark:border-slate-800 bg-card rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200" },
                        React.createElement(card_1.CardContent, { className: "p-3 flex flex-col items-center justify-center text-center h-full gap-3" },
                            React.createElement("div", { className: "w-12 h-12 rounded-full bg-[#f43f5e] text-white flex items-center justify-center shadow-md shadow-[#f43f5e]/30 group-hover:scale-110 transition-transform duration-200" },
                                React.createElement(fa_1.FaHome, { className: "w-5 h-5" })),
                            React.createElement("div", { className: "flex flex-col gap-0.5" },
                                React.createElement("span", { className: "font-extrabold text-[12px] text-slate-800 dark:text-slate-200 leading-tight" }, "Adopt"),
                                React.createElement("span", { className: "text-[9px] text-muted-foreground leading-tight" }, "Find your companion"))))),
                React.createElement(link_1["default"], { href: "/volunteer", className: "group block" },
                    React.createElement(card_1.Card, { className: "h-[160px] border border-slate-100 dark:border-slate-800 bg-card rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200" },
                        React.createElement(card_1.CardContent, { className: "p-3 flex flex-col items-center justify-center text-center h-full gap-3" },
                            React.createElement("div", { className: "w-12 h-12 rounded-full bg-[#f59e0b] text-white flex items-center justify-center shadow-md shadow-[#f59e0b]/30 group-hover:scale-110 transition-transform duration-200" },
                                React.createElement(fa_1.FaHandHoldingHeart, { className: "w-5 h-5" })),
                            React.createElement("div", { className: "flex flex-col gap-0.5" },
                                React.createElement("span", { className: "font-extrabold text-[12px] text-slate-800 dark:text-slate-200 leading-tight" }, "Volunteer"),
                                React.createElement("span", { className: "text-[9px] text-muted-foreground leading-tight" }, "Make a difference"))))),
                React.createElement("button", { onClick: function () { return setDonateOpen(true); }, className: "group block w-full focus:outline-none" },
                    React.createElement(card_1.Card, { className: "h-[160px] border border-slate-100 dark:border-slate-800 bg-card rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 pointer-events-none w-full" },
                        React.createElement(card_1.CardContent, { className: "p-3 flex flex-col items-center justify-center text-center h-full gap-3" },
                            React.createElement("div", { className: "w-12 h-12 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-md shadow-[#3b82f6]/30 group-hover:scale-110 transition-transform duration-200" },
                                React.createElement(fa_1.FaHeart, { className: "w-5 h-5" })),
                            React.createElement("div", { className: "flex flex-col gap-0.5" },
                                React.createElement("span", { className: "font-extrabold text-[12px] text-slate-800 dark:text-slate-200 leading-tight" }, "Donate"),
                                React.createElement("span", { className: "text-[9px] text-muted-foreground leading-tight" }, "Support rescues"))))))),
        React.createElement("section", { className: "flex flex-col gap-3" },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("h3", { className: "font-semibold text-lg flex items-center gap-2" },
                    React.createElement(fa_1.FaExclamationCircle, { className: "w-5 h-5 text-orange-500" }),
                    "Urgent Rescues"),
                React.createElement(link_1["default"], { href: "/rescues", className: "text-sm text-primary flex items-center" },
                    "See all ",
                    React.createElement(fa_1.FaArrowRight, { className: "w-4 h-4 ml-1" }))),
            React.createElement("div", { className: "flex flex-col gap-3" },
                React.createElement(link_1["default"], { href: "/rescues/1", className: "block" },
                    React.createElement(card_1.Card, { className: "overflow-hidden active:scale-[0.99] transition-transform" },
                        React.createElement("div", { className: "flex h-28" },
                            React.createElement("div", { className: "w-2/5 bg-muted relative" },
                                React.createElement(image_1["default"], { src: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400&auto=format&fit=crop", alt: "Injured cat", fill: true, className: "object-cover", unoptimized: true }),
                                React.createElement("div", { className: "absolute top-2 left-2 bg-destructive text-white text-[10px] font-semibold px-2 py-0.5 rounded-full" }, "Critical")),
                            React.createElement("div", { className: "w-3/5 p-3 flex flex-col justify-between" },
                                React.createElement("div", null,
                                    React.createElement("h4", { className: "font-semibold text-sm leading-tight line-clamp-1" }, "Injured Stray Cat"),
                                    React.createElement("p", { className: "text-xs text-muted-foreground mt-1 flex items-center gap-1 line-clamp-1" },
                                        React.createElement(fa_1.FaMapMarkerAlt, { className: "w-3 h-3" }),
                                        "Downtown Alley, 0.5m")),
                                React.createElement("div", { className: "text-xs text-orange-600" }, "Needs transportation"))))),
                React.createElement(link_1["default"], { href: "/rescues/2", className: "block" },
                    React.createElement(card_1.Card, { className: "overflow-hidden active:scale-[0.99] transition-transform" },
                        React.createElement("div", { className: "flex h-28" },
                            React.createElement("div", { className: "w-2/5 bg-muted relative" },
                                React.createElement(image_1["default"], { src: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=400&auto=format&fit=crop", alt: "Abandoned puppy", fill: true, className: "object-cover", unoptimized: true }),
                                React.createElement("div", { className: "absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold" }, "Moderate")),
                            React.createElement("div", { className: "w-3/5 p-3 flex flex-col justify-between" },
                                React.createElement("div", null,
                                    React.createElement("h4", { className: "text-sm leading-tight line-clamp-1 font-semibold" }, "Abandoned Puppy"),
                                    React.createElement("p", { className: "text-xs text-muted-foreground mt-1 flex items-center gap-1 line-clamp-1" },
                                        React.createElement(fa_1.FaMapMarkerAlt, { className: "w-3 h-3" }),
                                        "City Park, 1.2m")),
                                React.createElement("div", { className: "text-xs text-blue-600 font-semibold" }, "Needs foster home"))))))),
        React.createElement("section", { className: "flex flex-col gap-3 mt-2" },
            React.createElement("div", { className: "flex items-center justify-between" },
                React.createElement("h3", { className: "text-lg flex items-center gap-2 font-semibold" }, "How to Use RescueConnect")),
            React.createElement(card_1.Card, null,
                React.createElement(card_1.CardContent, { className: "p-4" },
                    React.createElement("div", { className: "flex flex-col gap-4" },
                        React.createElement("div", { className: "flex items-start gap-3" },
                            React.createElement("div", { className: "w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-semibold text-sm" }, "1"),
                            React.createElement("div", { className: "flex flex-col" },
                                React.createElement("span", { className: "font-semibold text-sm" }, "Report an Emergency"),
                                React.createElement("span", { className: "text-xs text-muted-foreground mt-0.5" }, "Fill out the quick emergency form and capture a clear image of the animal in need."))),
                        React.createElement("div", { className: "flex items-start gap-3" },
                            React.createElement("div", { className: "w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-semibold text-sm" }, "2"),
                            React.createElement("div", { className: "flex flex-col" },
                                React.createElement("span", { className: "font-semibold text-sm" }, "Find Nearby Help"),
                                React.createElement("span", { className: "text-xs text-muted-foreground mt-0.5" }, "Search the interactive map to locate rescue buildings, shelters, and veterinary clinics nearby."))),
                        React.createElement("div", { className: "flex items-start gap-3" },
                            React.createElement("div", { className: "w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-semibold text-sm" }, "3"),
                            React.createElement("div", { className: "flex flex-col" },
                                React.createElement("span", { className: "font-semibold text-sm" }, "Track Progress"),
                                React.createElement("span", { className: "text-xs text-muted-foreground mt-0.5" }, "Check the rescues tab to see when help is on the way and communicate in real-time."))))))),
        React.createElement(dialog_1.Dialog, { open: donateOpen, onOpenChange: setDonateOpen },
            React.createElement(dialog_1.DialogContent, { className: "max-w-xs p-5 rounded-3xl overflow-hidden bg-card border shadow-2xl relative" },
                React.createElement("button", { onClick: function () { return setDonateOpen(false); }, className: "absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1" },
                    React.createElement(fa_1.FaTimes, { className: "w-3.5 h-3.5" })),
                React.createElement(dialog_1.DialogHeader, { className: "mb-4" },
                    React.createElement("div", { className: "w-12 h-12 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center mb-2 mx-auto" },
                        React.createElement(fa_1.FaDonate, { className: "w-6 h-6" })),
                    React.createElement(dialog_1.DialogTitle, { className: "text-center text-lg font-bold font-fredoka text-slate-800 dark:text-slate-100" }, "Support Stray Animals"),
                    React.createElement("p", { className: "text-center text-xs text-muted-foreground px-2" }, "Your donation directly funds veterinary care, shelter meals, and rescue logistics.")),
                React.createElement("form", { onSubmit: handleDonateSubmit, className: "flex flex-col gap-4" },
                    React.createElement("div", { className: "grid grid-cols-4 gap-2" }, ["10", "25", "50", "100"].map(function (amt) { return (React.createElement("button", { key: amt, type: "button", onClick: function () {
                            setDonateAmount(amt);
                            setCustomAmount("");
                        }, className: "py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all " + (donateAmount === amt
                            ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                            : "bg-muted/30 border-muted-foreground/10 hover:bg-muted text-slate-800 dark:text-slate-200") },
                        "$",
                        amt)); })),
                    React.createElement("div", { className: "flex flex-col gap-2" },
                        React.createElement("button", { type: "button", onClick: function () { return setDonateAmount("custom"); }, className: "py-2 px-3 rounded-xl text-xs font-bold text-center border transition-all " + (donateAmount === "custom"
                                ? "bg-teal-600 border-teal-600 text-white"
                                : "bg-muted/30 border-muted-foreground/10 hover:bg-muted text-slate-800 dark:text-slate-200") }, "Custom Amount"),
                        donateAmount === "custom" && (React.createElement("div", { className: "relative mt-1" },
                            React.createElement("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground" }, "$"),
                            React.createElement("input", { type: "number", value: customAmount, onChange: function (e) { return setCustomAmount(e.target.value); }, placeholder: "Enter amount", min: "1", className: "w-full bg-muted/50 border border-muted-foreground/10 rounded-xl py-2 pl-7 pr-3 text-xs font-semibold focus:outline-none focus:border-teal-500 transition-colors", required: true })))),
                    React.createElement("div", { className: "flex flex-col gap-1.5" },
                        React.createElement("span", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider" }, "Payment Method"),
                        React.createElement("div", { className: "grid grid-cols-3 gap-2" }, [
                            { id: "card", label: "Card" },
                            { id: "paypal", label: "PayPal" },
                            { id: "gpay", label: "G-Pay" },
                        ].map(function (method) { return (React.createElement("button", { key: method.id, type: "button", onClick: function () { return setPaymentMethod(method.id); }, className: "py-1.5 rounded-lg text-[10px] font-extrabold border transition-all text-center " + (paymentMethod === method.id
                                ? "bg-slate-800 dark:bg-slate-200 dark:text-slate-900 text-white border-transparent"
                                : "bg-muted/10 border-muted-foreground/10 hover:bg-muted/30 text-slate-700 dark:text-slate-300") }, method.label)); }))),
                    React.createElement("button", { type: "submit", className: "w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md shadow-teal-600/10 active:scale-[0.98] mt-2 flex items-center justify-center gap-1.5" },
                        React.createElement(fa_1.FaHeart, { className: "w-3.5 h-3.5" }),
                        "Complete Donation"))))));
}
exports["default"] = HomePage;
