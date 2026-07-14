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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.MapClusterLayer = exports.MapArc = exports.MapRoute = exports.MapControls = exports.MapPopup = exports.MarkerLabel = exports.MarkerTooltip = exports.MarkerPopup = exports.MarkerContent = exports.MapMarker = exports.useMap = exports.Map = void 0;
var maplibre_gl_1 = require("maplibre-gl");
require("maplibre-gl/dist/maplibre-gl.css");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var lucide_react_1 = require("lucide-react");
var utils_1 = require("@/lib/utils");
var defaultStyles = {
    dark: "https://tiles.openfreemap.org/styles/dark",
    light: "https://tiles.openfreemap.org/styles/liberty"
};
// Check document class for theme (works with next-themes, etc.)
function getDocumentTheme() {
    if (typeof document === "undefined")
        return null;
    if (document.documentElement.classList.contains("dark"))
        return "dark";
    if (document.documentElement.classList.contains("light"))
        return "light";
    return null;
}
// Get system preference
function getSystemTheme() {
    if (typeof window === "undefined")
        return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}
function useResolvedTheme(themeProp) {
    var _a = react_1.useState(function () { var _a; return (_a = getDocumentTheme()) !== null && _a !== void 0 ? _a : getSystemTheme(); }), detectedTheme = _a[0], setDetectedTheme = _a[1];
    react_1.useEffect(function () {
        if (themeProp)
            return; // Skip detection if theme is provided via prop
        // Watch for document class changes ( , next-themes toggling dark class)
        var observer = new MutationObserver(function () {
            var docTheme = getDocumentTheme();
            if (docTheme) {
                setDetectedTheme(docTheme);
            }
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });
        // Also watch for system preference changes
        var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        var handleSystemChange = function (e) {
            // Only use system preference if no document class is set
            if (!getDocumentTheme()) {
                setDetectedTheme(e.matches ? "dark" : "light");
            }
        };
        mediaQuery.addEventListener("change", handleSystemChange);
        return function () {
            observer.disconnect();
            mediaQuery.removeEventListener("change", handleSystemChange);
        };
    }, [themeProp]);
    return themeProp !== null && themeProp !== void 0 ? themeProp : detectedTheme;
}
var MapContext = react_1.createContext(null);
function useMap() {
    var context = react_1.useContext(MapContext);
    if (!context) {
        throw new Error("useMap must be used within a Map component");
    }
    return context;
}
exports.useMap = useMap;
function DefaultLoader() {
    return (React.createElement("div", { className: "bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-xs" },
        React.createElement("div", { className: "flex gap-1" },
            React.createElement("span", { className: "bg-muted-foreground/60 size-1.5 animate-pulse rounded-full" }),
            React.createElement("span", { className: "bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:150ms]" }),
            React.createElement("span", { className: "bg-muted-foreground/60 size-1.5 animate-pulse rounded-full [animation-delay:300ms]" }))));
}
function getViewport(map) {
    var center = map.getCenter();
    return {
        center: [center.lng, center.lat],
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch()
    };
}
var Map = react_1.forwardRef(function Map(_a, ref) {
    var children = _a.children, className = _a.className, themeProp = _a.theme, styles = _a.styles, projection = _a.projection, viewport = _a.viewport, onViewportChange = _a.onViewportChange, _b = _a.loading, loading = _b === void 0 ? false : _b, props = __rest(_a, ["children", "className", "theme", "styles", "projection", "viewport", "onViewportChange", "loading"]);
    var containerRef = react_1.useRef(null);
    var _c = react_1.useState(null), mapInstance = _c[0], setMapInstance = _c[1];
    var _d = react_1.useState(false), isLoaded = _d[0], setIsLoaded = _d[1];
    var _e = react_1.useState(false), isStyleLoaded = _e[0], setIsStyleLoaded = _e[1];
    var currentStyleRef = react_1.useRef(null);
    var styleTimeoutRef = react_1.useRef(null);
    var internalUpdateRef = react_1.useRef(false);
    var resolvedTheme = useResolvedTheme(themeProp);
    var isControlled = viewport !== undefined && onViewportChange !== undefined;
    var onViewportChangeRef = react_1.useRef(onViewportChange);
    onViewportChangeRef.current = onViewportChange;
    var mapStyles = react_1.useMemo(function () {
        var _a, _b;
        return ({
            dark: (_a = styles === null || styles === void 0 ? void 0 : styles.dark) !== null && _a !== void 0 ? _a : defaultStyles.dark,
            light: (_b = styles === null || styles === void 0 ? void 0 : styles.light) !== null && _b !== void 0 ? _b : defaultStyles.light
        });
    }, [styles]);
    // Expose the map instance to the parent component
    react_1.useImperativeHandle(ref, function () { return mapInstance; }, [mapInstance]);
    var clearStyleTimeout = react_1.useCallback(function () {
        if (styleTimeoutRef.current) {
            clearTimeout(styleTimeoutRef.current);
            styleTimeoutRef.current = null;
        }
    }, []);
    // Initialize the map
    react_1.useEffect(function () {
        if (!containerRef.current)
            return;
        var initialStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
        currentStyleRef.current = initialStyle;
        var map = new maplibre_gl_1["default"].Map(__assign(__assign({ container: containerRef.current, style: initialStyle, renderWorldCopies: false, attributionControl: {
                compact: true
            } }, props), viewport));
        var styleDataHandler = function () {
            clearStyleTimeout();
            // Delay to ensure style is fully processed before allowing layer operations
            // This is a workaround to avoid race conditions with the style loading
            // else we have to force update every layer on setStyle change
            styleTimeoutRef.current = setTimeout(function () {
                setIsStyleLoaded(true);
                if (projection) {
                    map.setProjection(projection);
                }
            }, 100);
        };
        var loadHandler = function () { return setIsLoaded(true); };
        // Viewport change handler - skip if triggered by internal update
        var handleMove = function () {
            var _a;
            if (internalUpdateRef.current)
                return;
            (_a = onViewportChangeRef.current) === null || _a === void 0 ? void 0 : _a.call(onViewportChangeRef, getViewport(map));
        };
        map.on("load", loadHandler);
        map.on("styledata", styleDataHandler);
        map.on("move", handleMove);
        setMapInstance(map);
        return function () {
            clearStyleTimeout();
            map.off("load", loadHandler);
            map.off("styledata", styleDataHandler);
            map.off("move", handleMove);
            map.remove();
            setIsLoaded(false);
            setIsStyleLoaded(false);
            setMapInstance(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Sync controlled viewport to map
    react_1.useEffect(function () {
        var _a, _b, _c, _d;
        if (!mapInstance || !isControlled || !viewport)
            return;
        if (mapInstance.isMoving())
            return;
        var current = getViewport(mapInstance);
        var next = {
            center: (_a = viewport.center) !== null && _a !== void 0 ? _a : current.center,
            zoom: (_b = viewport.zoom) !== null && _b !== void 0 ? _b : current.zoom,
            bearing: (_c = viewport.bearing) !== null && _c !== void 0 ? _c : current.bearing,
            pitch: (_d = viewport.pitch) !== null && _d !== void 0 ? _d : current.pitch
        };
        if (next.center[0] === current.center[0] &&
            next.center[1] === current.center[1] &&
            next.zoom === current.zoom &&
            next.bearing === current.bearing &&
            next.pitch === current.pitch) {
            return;
        }
        internalUpdateRef.current = true;
        mapInstance.jumpTo(next);
        internalUpdateRef.current = false;
    }, [mapInstance, isControlled, viewport]);
    // Handle style change
    react_1.useEffect(function () {
        if (!mapInstance || !resolvedTheme)
            return;
        var newStyle = resolvedTheme === "dark" ? mapStyles.dark : mapStyles.light;
        if (currentStyleRef.current === newStyle)
            return;
        clearStyleTimeout();
        currentStyleRef.current = newStyle;
        setIsStyleLoaded(false);
        mapInstance.setStyle(newStyle, { diff: true });
    }, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout]);
    var contextValue = react_1.useMemo(function () { return ({
        map: mapInstance,
        isLoaded: isLoaded && isStyleLoaded
    }); }, [mapInstance, isLoaded, isStyleLoaded]);
    return (React.createElement(MapContext.Provider, { value: contextValue },
        React.createElement("div", { ref: containerRef, className: utils_1.cn("relative h-full w-full", className) },
            (!isLoaded || loading) && React.createElement(DefaultLoader, null),
            mapInstance && children)));
});
exports.Map = Map;
var MarkerContext = react_1.createContext(null);
function useMarkerContext() {
    var context = react_1.useContext(MarkerContext);
    if (!context) {
        throw new Error("Marker components must be used within MapMarker");
    }
    return context;
}
function MapMarker(_a) {
    var _b, _c, _d, _e;
    var longitude = _a.longitude, latitude = _a.latitude, children = _a.children, onClick = _a.onClick, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, onDragStart = _a.onDragStart, onDrag = _a.onDrag, onDragEnd = _a.onDragEnd, _f = _a.draggable, draggable = _f === void 0 ? false : _f, markerOptions = __rest(_a, ["longitude", "latitude", "children", "onClick", "onMouseEnter", "onMouseLeave", "onDragStart", "onDrag", "onDragEnd", "draggable"]);
    var map = useMap().map;
    var callbacksRef = react_1.useRef({
        onClick: onClick,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        onDragStart: onDragStart,
        onDrag: onDrag,
        onDragEnd: onDragEnd
    });
    callbacksRef.current = {
        onClick: onClick,
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave,
        onDragStart: onDragStart,
        onDrag: onDrag,
        onDragEnd: onDragEnd
    };
    var marker = react_1.useMemo(function () {
        var _a, _b, _c;
        var markerInstance = new maplibre_gl_1["default"].Marker(__assign(__assign({}, markerOptions), { element: document.createElement("div"), draggable: draggable })).setLngLat([longitude, latitude]);
        var handleClick = function (e) { var _a, _b; return (_b = (_a = callbacksRef.current).onClick) === null || _b === void 0 ? void 0 : _b.call(_a, e); };
        var handleMouseEnter = function (e) { var _a, _b; return (_b = (_a = callbacksRef.current).onMouseEnter) === null || _b === void 0 ? void 0 : _b.call(_a, e); };
        var handleMouseLeave = function (e) { var _a, _b; return (_b = (_a = callbacksRef.current).onMouseLeave) === null || _b === void 0 ? void 0 : _b.call(_a, e); };
        (_a = markerInstance.getElement()) === null || _a === void 0 ? void 0 : _a.addEventListener("click", handleClick);
        (_b = markerInstance
            .getElement()) === null || _b === void 0 ? void 0 : _b.addEventListener("mouseenter", handleMouseEnter);
        (_c = markerInstance
            .getElement()) === null || _c === void 0 ? void 0 : _c.addEventListener("mouseleave", handleMouseLeave);
        var handleDragStart = function () {
            var _a, _b;
            var lngLat = markerInstance.getLngLat();
            (_b = (_a = callbacksRef.current).onDragStart) === null || _b === void 0 ? void 0 : _b.call(_a, { lng: lngLat.lng, lat: lngLat.lat });
        };
        var handleDrag = function () {
            var _a, _b;
            var lngLat = markerInstance.getLngLat();
            (_b = (_a = callbacksRef.current).onDrag) === null || _b === void 0 ? void 0 : _b.call(_a, { lng: lngLat.lng, lat: lngLat.lat });
        };
        var handleDragEnd = function () {
            var _a, _b;
            var lngLat = markerInstance.getLngLat();
            (_b = (_a = callbacksRef.current).onDragEnd) === null || _b === void 0 ? void 0 : _b.call(_a, { lng: lngLat.lng, lat: lngLat.lat });
        };
        markerInstance.on("dragstart", handleDragStart);
        markerInstance.on("drag", handleDrag);
        markerInstance.on("dragend", handleDragEnd);
        return markerInstance;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    react_1.useEffect(function () {
        if (!map)
            return;
        marker.addTo(map);
        return function () {
            marker.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);
    if (marker.getLngLat().lng !== longitude ||
        marker.getLngLat().lat !== latitude) {
        marker.setLngLat([longitude, latitude]);
    }
    if (marker.isDraggable() !== draggable) {
        marker.setDraggable(draggable);
    }
    var currentOffset = marker.getOffset();
    var newOffset = (_b = markerOptions.offset) !== null && _b !== void 0 ? _b : [0, 0];
    var _g = Array.isArray(newOffset)
        ? newOffset
        : [newOffset.x, newOffset.y], newOffsetX = _g[0], newOffsetY = _g[1];
    if (currentOffset.x !== newOffsetX || currentOffset.y !== newOffsetY) {
        marker.setOffset(newOffset);
    }
    if (marker.getRotation() !== markerOptions.rotation) {
        marker.setRotation((_c = markerOptions.rotation) !== null && _c !== void 0 ? _c : 0);
    }
    if (marker.getRotationAlignment() !== markerOptions.rotationAlignment) {
        marker.setRotationAlignment((_d = markerOptions.rotationAlignment) !== null && _d !== void 0 ? _d : "auto");
    }
    if (marker.getPitchAlignment() !== markerOptions.pitchAlignment) {
        marker.setPitchAlignment((_e = markerOptions.pitchAlignment) !== null && _e !== void 0 ? _e : "auto");
    }
    return (React.createElement(MarkerContext.Provider, { value: { marker: marker, map: map } }, children));
}
exports.MapMarker = MapMarker;
function MarkerContent(_a) {
    var children = _a.children, className = _a.className;
    var marker = useMarkerContext().marker;
    return react_dom_1.createPortal(React.createElement("div", { className: utils_1.cn("relative cursor-pointer", className) }, children || React.createElement(DefaultMarkerIcon, null)), marker.getElement());
}
exports.MarkerContent = MarkerContent;
function DefaultMarkerIcon() {
    return (React.createElement("div", { className: "relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" }));
}
function PopupCloseButton(_a) {
    var onClick = _a.onClick;
    return (React.createElement("button", { type: "button", onClick: onClick, "aria-label": "Close popup", className: "focus-visible:ring-ring hover:bg-muted text-foreground absolute top-0.5 right-0.5 z-10 inline-flex size-5 cursor-pointer items-center justify-center rounded-sm transition-colors focus:outline-none focus-visible:ring-2" },
        React.createElement(lucide_react_1.X, { className: "size-3.5" })));
}
function MarkerPopup(_a) {
    var _b, _c;
    var children = _a.children, className = _a.className, _d = _a.closeButton, closeButton = _d === void 0 ? false : _d, popupOptions = __rest(_a, ["children", "className", "closeButton"]);
    var _e = useMarkerContext(), marker = _e.marker, map = _e.map;
    var container = react_1.useMemo(function () { return document.createElement("div"); }, []);
    var prevPopupOptions = react_1.useRef(popupOptions);
    var popup = react_1.useMemo(function () {
        var popupInstance = new maplibre_gl_1["default"].Popup(__assign(__assign({ offset: 16 }, popupOptions), { closeButton: false }))
            .setMaxWidth("none")
            .setDOMContent(container);
        return popupInstance;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    react_1.useEffect(function () {
        if (!map)
            return;
        popup.setDOMContent(container);
        marker.setPopup(popup);
        return function () {
            marker.setPopup(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);
    if (popup.isOpen()) {
        var prev = prevPopupOptions.current;
        if (prev.offset !== popupOptions.offset) {
            popup.setOffset((_b = popupOptions.offset) !== null && _b !== void 0 ? _b : 16);
        }
        if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
            popup.setMaxWidth((_c = popupOptions.maxWidth) !== null && _c !== void 0 ? _c : "none");
        }
        prevPopupOptions.current = popupOptions;
    }
    var handleClose = function () { return popup.remove(); };
    return react_dom_1.createPortal(React.createElement("div", { className: utils_1.cn("bg-popover text-popover-foreground relative max-w-62 rounded-md border p-3 shadow-md", "animate-in fade-in-0 zoom-in-95 duration-200 ease-out", className) },
        closeButton && React.createElement(PopupCloseButton, { onClick: handleClose }),
        children), container);
}
exports.MarkerPopup = MarkerPopup;
function MarkerTooltip(_a) {
    var _b, _c;
    var children = _a.children, className = _a.className, popupOptions = __rest(_a, ["children", "className"]);
    var _d = useMarkerContext(), marker = _d.marker, map = _d.map;
    var container = react_1.useMemo(function () { return document.createElement("div"); }, []);
    var prevTooltipOptions = react_1.useRef(popupOptions);
    var tooltip = react_1.useMemo(function () {
        var tooltipInstance = new maplibre_gl_1["default"].Popup(__assign(__assign({ offset: 16 }, popupOptions), { closeOnClick: true, closeButton: false })).setMaxWidth("none");
        return tooltipInstance;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    react_1.useEffect(function () {
        var _a, _b;
        if (!map)
            return;
        tooltip.setDOMContent(container);
        var handleMouseEnter = function () {
            tooltip.setLngLat(marker.getLngLat()).addTo(map);
        };
        var handleMouseLeave = function () { return tooltip.remove(); };
        (_a = marker.getElement()) === null || _a === void 0 ? void 0 : _a.addEventListener("mouseenter", handleMouseEnter);
        (_b = marker.getElement()) === null || _b === void 0 ? void 0 : _b.addEventListener("mouseleave", handleMouseLeave);
        return function () {
            var _a, _b;
            (_a = marker.getElement()) === null || _a === void 0 ? void 0 : _a.removeEventListener("mouseenter", handleMouseEnter);
            (_b = marker.getElement()) === null || _b === void 0 ? void 0 : _b.removeEventListener("mouseleave", handleMouseLeave);
            tooltip.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);
    if (tooltip.isOpen()) {
        var prev = prevTooltipOptions.current;
        if (prev.offset !== popupOptions.offset) {
            tooltip.setOffset((_b = popupOptions.offset) !== null && _b !== void 0 ? _b : 16);
        }
        if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
            tooltip.setMaxWidth((_c = popupOptions.maxWidth) !== null && _c !== void 0 ? _c : "none");
        }
        prevTooltipOptions.current = popupOptions;
    }
    return react_dom_1.createPortal(React.createElement("div", { className: utils_1.cn("bg-foreground text-background pointer-events-none rounded-md px-2 py-1 text-xs text-balance shadow-md", "animate-in fade-in-0 zoom-in-95 duration-200 ease-out", className) }, children), container);
}
exports.MarkerTooltip = MarkerTooltip;
function MarkerLabel(_a) {
    var children = _a.children, className = _a.className, _b = _a.position, position = _b === void 0 ? "top" : _b;
    var positionClasses = {
        top: "bottom-full mb-1",
        bottom: "top-full mt-1"
    };
    return (React.createElement("div", { className: utils_1.cn("absolute left-1/2 -translate-x-1/2 whitespace-nowrap", "text-foreground text-[10px] ", positionClasses[position], className) }, children));
}
exports.MarkerLabel = MarkerLabel;
var positionClasses = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
    "bottom-left": "bottom-2 left-2",
    "bottom-right": "bottom-10 right-2"
};
function ControlGroup(_a) {
    var children = _a.children;
    return (React.createElement("div", { className: "border-border bg-background [&>button:not(:last-child)]:border-border flex flex-col overflow-hidden rounded-md border shadow-sm [&>button:not(:last-child)]:border-b" }, children));
}
function ControlButton(_a) {
    var onClick = _a.onClick, label = _a.label, children = _a.children, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    return (React.createElement("button", { onClick: onClick, "aria-label": label, type: "button", className: utils_1.cn("flex size-8 items-center justify-center transition-all", "first:rounded-t-md last:rounded-b-md", "hover:bg-accent dark:hover:bg-accent/40", "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset", "disabled:pointer-events-none disabled:opacity-50"), disabled: disabled }, children));
}
function MapControls(_a) {
    var _b = _a.position, position = _b === void 0 ? "bottom-right" : _b, _c = _a.showZoom, showZoom = _c === void 0 ? true : _c, _d = _a.showCompass, showCompass = _d === void 0 ? false : _d, _e = _a.showLocate, showLocate = _e === void 0 ? false : _e, _f = _a.showFullscreen, showFullscreen = _f === void 0 ? false : _f, className = _a.className, onLocate = _a.onLocate;
    var map = useMap().map;
    var _g = react_1.useState(false), waitingForLocation = _g[0], setWaitingForLocation = _g[1];
    var handleZoomIn = react_1.useCallback(function () {
        map === null || map === void 0 ? void 0 : map.zoomTo(map.getZoom() + 1, { duration: 300 });
    }, [map]);
    var handleZoomOut = react_1.useCallback(function () {
        map === null || map === void 0 ? void 0 : map.zoomTo(map.getZoom() - 1, { duration: 300 });
    }, [map]);
    var handleResetBearing = react_1.useCallback(function () {
        map === null || map === void 0 ? void 0 : map.resetNorthPitch({ duration: 300 });
    }, [map]);
    var handleLocate = react_1.useCallback(function () {
        setWaitingForLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                var coords = {
                    longitude: pos.coords.longitude,
                    latitude: pos.coords.latitude
                };
                map === null || map === void 0 ? void 0 : map.flyTo({
                    center: [coords.longitude, coords.latitude],
                    zoom: 14,
                    duration: 1500
                });
                onLocate === null || onLocate === void 0 ? void 0 : onLocate(coords);
                setWaitingForLocation(false);
            }, function (error) {
                console.error("Error getting location:", error);
                setWaitingForLocation(false);
            });
        }
    }, [map, onLocate]);
    var handleFullscreen = react_1.useCallback(function () {
        var container = map === null || map === void 0 ? void 0 : map.getContainer();
        if (!container)
            return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            container.requestFullscreen();
        }
    }, [map]);
    return (React.createElement("div", { className: utils_1.cn("absolute z-10 flex flex-col gap-1.5", positionClasses[position], className) },
        showZoom && (React.createElement(ControlGroup, null,
            React.createElement(ControlButton, { onClick: handleZoomIn, label: "Zoom in" },
                React.createElement(lucide_react_1.Plus, { className: "size-4" })),
            React.createElement(ControlButton, { onClick: handleZoomOut, label: "Zoom out" },
                React.createElement(lucide_react_1.Minus, { className: "size-4" })))),
        showCompass && (React.createElement(ControlGroup, null,
            React.createElement(CompassButton, { onClick: handleResetBearing }))),
        showLocate && (React.createElement(ControlGroup, null,
            React.createElement(ControlButton, { onClick: handleLocate, label: "Find my location", disabled: waitingForLocation }, waitingForLocation ? (React.createElement(lucide_react_1.Loader2, { className: "size-4 animate-spin" })) : (React.createElement(lucide_react_1.Locate, { className: "size-4" }))))),
        showFullscreen && (React.createElement(ControlGroup, null,
            React.createElement(ControlButton, { onClick: handleFullscreen, label: "Toggle fullscreen" },
                React.createElement(lucide_react_1.Maximize, { className: "size-4" }))))));
}
exports.MapControls = MapControls;
function CompassButton(_a) {
    var onClick = _a.onClick;
    var map = useMap().map;
    var compassRef = react_1.useRef(null);
    react_1.useEffect(function () {
        if (!map || !compassRef.current)
            return;
        var compass = compassRef.current;
        var updateRotation = function () {
            var bearing = map.getBearing();
            var pitch = map.getPitch();
            compass.style.transform = "rotateX(" + pitch + "deg) rotateZ(" + -bearing + "deg)";
        };
        map.on("rotate", updateRotation);
        map.on("pitch", updateRotation);
        updateRotation();
        return function () {
            map.off("rotate", updateRotation);
            map.off("pitch", updateRotation);
        };
    }, [map]);
    return (React.createElement(ControlButton, { onClick: onClick, label: "Reset bearing to north" },
        React.createElement("svg", { ref: compassRef, viewBox: "0 0 24 24", className: "size-5 transition-transform duration-200", style: { transformStyle: "preserve-3d" } },
            React.createElement("path", { d: "M12 2L16 12H12V2Z", className: "fill-red-500" }),
            React.createElement("path", { d: "M12 2L8 12H12V2Z", className: "fill-red-300" }),
            React.createElement("path", { d: "M12 22L16 12H12V22Z", className: "fill-muted-foreground/60" }),
            React.createElement("path", { d: "M12 22L8 12H12V22Z", className: "fill-muted-foreground/30" }))));
}
function MapPopup(_a) {
    var _b, _c;
    var longitude = _a.longitude, latitude = _a.latitude, onClose = _a.onClose, children = _a.children, className = _a.className, _d = _a.closeButton, closeButton = _d === void 0 ? false : _d, popupOptions = __rest(_a, ["longitude", "latitude", "onClose", "children", "className", "closeButton"]);
    var map = useMap().map;
    var popupOptionsRef = react_1.useRef(popupOptions);
    var onCloseRef = react_1.useRef(onClose);
    onCloseRef.current = onClose;
    var container = react_1.useMemo(function () { return document.createElement("div"); }, []);
    var popup = react_1.useMemo(function () {
        var popupInstance = new maplibre_gl_1["default"].Popup(__assign(__assign({ offset: 16 }, popupOptions), { closeButton: false }))
            .setMaxWidth("none")
            .setLngLat([longitude, latitude]);
        return popupInstance;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    react_1.useEffect(function () {
        if (!map)
            return;
        var onCloseProp = function () { var _a; return (_a = onCloseRef.current) === null || _a === void 0 ? void 0 : _a.call(onCloseRef); };
        popup.on("close", onCloseProp);
        popup.setDOMContent(container);
        popup.addTo(map);
        return function () {
            popup.off("close", onCloseProp);
            if (popup.isOpen()) {
                popup.remove();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);
    if (popup.isOpen()) {
        var prev = popupOptionsRef.current;
        if (popup.getLngLat().lng !== longitude ||
            popup.getLngLat().lat !== latitude) {
            popup.setLngLat([longitude, latitude]);
        }
        if (prev.offset !== popupOptions.offset) {
            popup.setOffset((_b = popupOptions.offset) !== null && _b !== void 0 ? _b : 16);
        }
        if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
            popup.setMaxWidth((_c = popupOptions.maxWidth) !== null && _c !== void 0 ? _c : "none");
        }
        popupOptionsRef.current = popupOptions;
    }
    var handleClose = function () {
        popup.remove();
    };
    return react_dom_1.createPortal(React.createElement("div", { className: utils_1.cn("bg-popover text-popover-foreground relative max-w-62 rounded-md border p-3 shadow-md", "animate-in fade-in-0 zoom-in-95 duration-200 ease-out", className) },
        closeButton && React.createElement(PopupCloseButton, { onClick: handleClose }),
        children), container);
}
exports.MapPopup = MapPopup;
function MapRoute(_a) {
    var propId = _a.id, coordinates = _a.coordinates, _b = _a.color, color = _b === void 0 ? "#4285F4" : _b, _c = _a.width, width = _c === void 0 ? 3 : _c, _d = _a.opacity, opacity = _d === void 0 ? 0.8 : _d, dashArray = _a.dashArray, onClick = _a.onClick, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, _e = _a.interactive, interactive = _e === void 0 ? true : _e;
    var _f = useMap(), map = _f.map, isLoaded = _f.isLoaded;
    var autoId = react_1.useId();
    var id = propId !== null && propId !== void 0 ? propId : autoId;
    var sourceId = "route-source-" + id;
    var layerId = "route-layer-" + id;
    // Add source and layer on mount
    react_1.useEffect(function () {
        if (!isLoaded || !map)
            return;
        map.addSource(sourceId, {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: { type: "LineString", coordinates: [] }
            }
        });
        map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: __assign({ "line-color": color, "line-width": width, "line-opacity": opacity }, (dashArray && { "line-dasharray": dashArray }))
        });
        return function () {
            try {
                if (map.getLayer(layerId))
                    map.removeLayer(layerId);
                if (map.getSource(sourceId))
                    map.removeSource(sourceId);
            }
            catch (_a) {
                // ignore
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, map]);
    // When coordinates change, update the source data
    react_1.useEffect(function () {
        if (!isLoaded || !map || coordinates.length < 2)
            return;
        var source = map.getSource(sourceId);
        if (source) {
            source.setData({
                type: "Feature",
                properties: {},
                geometry: { type: "LineString", coordinates: coordinates }
            });
        }
    }, [isLoaded, map, coordinates, sourceId]);
    react_1.useEffect(function () {
        if (!isLoaded || !map || !map.getLayer(layerId))
            return;
        map.setPaintProperty(layerId, "line-color", color);
        map.setPaintProperty(layerId, "line-width", width);
        map.setPaintProperty(layerId, "line-opacity", opacity);
        if (dashArray) {
            map.setPaintProperty(layerId, "line-dasharray", dashArray);
        }
    }, [isLoaded, map, layerId, color, width, opacity, dashArray]);
    // Handle click and hover events
    react_1.useEffect(function () {
        if (!isLoaded || !map || !interactive)
            return;
        var handleClick = function () {
            onClick === null || onClick === void 0 ? void 0 : onClick();
        };
        var handleMouseEnter = function () {
            map.getCanvas().style.cursor = "pointer";
            onMouseEnter === null || onMouseEnter === void 0 ? void 0 : onMouseEnter();
        };
        var handleMouseLeave = function () {
            map.getCanvas().style.cursor = "";
            onMouseLeave === null || onMouseLeave === void 0 ? void 0 : onMouseLeave();
        };
        map.on("click", layerId, handleClick);
        map.on("mouseenter", layerId, handleMouseEnter);
        map.on("mouseleave", layerId, handleMouseLeave);
        return function () {
            map.off("click", layerId, handleClick);
            map.off("mouseenter", layerId, handleMouseEnter);
            map.off("mouseleave", layerId, handleMouseLeave);
        };
    }, [
        isLoaded,
        map,
        layerId,
        onClick,
        onMouseEnter,
        onMouseLeave,
        interactive,
    ]);
    return null;
}
exports.MapRoute = MapRoute;
var DEFAULT_ARC_CURVATURE = 0.2;
var DEFAULT_ARC_SAMPLES = 64;
var ARC_HIT_MIN_WIDTH = 12;
var ARC_HIT_PADDING = 6;
var DEFAULT_ARC_PAINT = {
    "line-color": "#4285F4",
    "line-width": 2,
    "line-opacity": 0.85
};
var DEFAULT_ARC_LAYOUT = {
    "line-join": "round",
    "line-cap": "round"
};
function mergeArcPaint(paint, hoverPaint) {
    if (!hoverPaint)
        return paint;
    var merged = __assign({}, paint);
    for (var _i = 0, _a = Object.entries(hoverPaint); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], hoverValue = _b[1];
        if (hoverValue === undefined)
            continue;
        var baseValue = merged[key];
        merged[key] =
            baseValue === undefined
                ? hoverValue
                : [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    hoverValue,
                    baseValue,
                ];
    }
    return merged;
}
function buildArcCoordinates(from, to, curvature, samples) {
    var x0 = from[0], y0 = from[1];
    var xTo = to[0], y2 = to[1];
    // Unwrap the destination longitude so |dx| <= 180. This makes arcs that
    // straddle the antimeridian (  Tokyo -> San Francisco) bow the short way
    // across the Pacific instead of the long way around the globe. Resulting
    // longitudes may fall outside [-180, 180]; MapLibre renders them correctly
    // on the globe projection, and on mercator when world copies are enabled.
    var rawDx = xTo - x0;
    var x2 = rawDx > 180 ? xTo - 360 : rawDx < -180 ? xTo + 360 : xTo;
    var dx = x2 - x0;
    var dy = y2 - y0;
    var distance = Math.hypot(dx, dy);
    if (distance === 0 || curvature === 0)
        return [from, [x2, y2]];
    var mx = (x0 + x2) / 2;
    var my = (y0 + y2) / 2;
    var nx = -dy / distance;
    var ny = dx / distance;
    var offset = distance * curvature;
    var cx = mx + nx * offset;
    var cy = my + ny * offset;
    var points = [];
    var segments = Math.max(2, Math.floor(samples));
    for (var i = 0; i <= segments; i += 1) {
        var t = i / segments;
        var inv = 1 - t;
        var x = inv * inv * x0 + 2 * inv * t * cx + t * t * x2;
        var y = inv * inv * y0 + 2 * inv * t * cy + t * t * y2;
        points.push([x, y]);
    }
    return points;
}
function MapArc(_a) {
    var data = _a.data, propId = _a.id, _b = _a.curvature, curvature = _b === void 0 ? DEFAULT_ARC_CURVATURE : _b, _c = _a.samples, samples = _c === void 0 ? DEFAULT_ARC_SAMPLES : _c, paint = _a.paint, layout = _a.layout, hoverPaint = _a.hoverPaint, onClick = _a.onClick, onHover = _a.onHover, _d = _a.interactive, interactive = _d === void 0 ? true : _d, beforeId = _a.beforeId;
    var _e = useMap(), map = _e.map, isLoaded = _e.isLoaded;
    var autoId = react_1.useId();
    var id = propId !== null && propId !== void 0 ? propId : autoId;
    var sourceId = "arc-source-" + id;
    var layerId = "arc-layer-" + id;
    var hitLayerId = "arc-hit-layer-" + id;
    var mergedPaint = react_1.useMemo(function () { return mergeArcPaint(__assign(__assign({}, DEFAULT_ARC_PAINT), paint), hoverPaint); }, [paint, hoverPaint]);
    var mergedLayout = react_1.useMemo(function () { return (__assign(__assign({}, DEFAULT_ARC_LAYOUT), layout)); }, [layout]);
    var hitWidth = react_1.useMemo(function () {
        var _a;
        var w = (_a = paint === null || paint === void 0 ? void 0 : paint["line-width"]) !== null && _a !== void 0 ? _a : DEFAULT_ARC_PAINT["line-width"];
        var base = typeof w === "number" ? w : ARC_HIT_MIN_WIDTH;
        return Math.max(base + ARC_HIT_PADDING, ARC_HIT_MIN_WIDTH);
    }, [paint]);
    var geoJSON = react_1.useMemo(function () { return ({
        type: "FeatureCollection",
        features: data.map(function (arc) {
            var from = arc.from, to = arc.to, properties = __rest(arc, ["from", "to"]);
            return {
                type: "Feature",
                properties: properties,
                geometry: {
                    type: "LineString",
                    coordinates: buildArcCoordinates(from, to, curvature, samples)
                }
            };
        })
    }); }, [data, curvature, samples]);
    var latestRef = react_1.useRef({ data: data, onClick: onClick, onHover: onHover });
    latestRef.current = { data: data, onClick: onClick, onHover: onHover };
    // Add source and layers on mount.
    react_1.useEffect(function () {
        if (!isLoaded || !map)
            return;
        map.addSource(sourceId, {
            type: "geojson",
            data: geoJSON,
            promoteId: "id"
        });
        map.addLayer({
            id: hitLayerId,
            type: "line",
            source: sourceId,
            layout: DEFAULT_ARC_LAYOUT,
            paint: {
                "line-color": "rgba(0, 0, 0, 0)",
                "line-width": hitWidth,
                "line-opacity": 1
            }
        }, beforeId);
        map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: mergedLayout,
            paint: mergedPaint
        }, beforeId);
        return function () {
            try {
                if (map.getLayer(layerId))
                    map.removeLayer(layerId);
                if (map.getLayer(hitLayerId))
                    map.removeLayer(hitLayerId);
                if (map.getSource(sourceId))
                    map.removeSource(sourceId);
            }
            catch (_a) {
                // ignore
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, map]);
    // Sync features when data / curvature / samples change.
    react_1.useEffect(function () {
        if (!isLoaded || !map)
            return;
        var source = map.getSource(sourceId);
        source === null || source === void 0 ? void 0 : source.setData(geoJSON);
    }, [isLoaded, map, geoJSON, sourceId]);
    // Sync paint/layout when they change.
    react_1.useEffect(function () {
        if (!isLoaded || !map || !map.getLayer(layerId))
            return;
        for (var _i = 0, _a = Object.entries(mergedPaint); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            map.setPaintProperty(layerId, key, value);
        }
        for (var _c = 0, _d = Object.entries(mergedLayout); _c < _d.length; _c++) {
            var _e = _d[_c], key = _e[0], value = _e[1];
            map.setLayoutProperty(layerId, key, value);
        }
        if (map.getLayer(hitLayerId)) {
            map.setPaintProperty(hitLayerId, "line-width", hitWidth);
        }
    }, [isLoaded, map, layerId, hitLayerId, mergedPaint, mergedLayout, hitWidth]);
    // Interaction handlers
    react_1.useEffect(function () {
        if (!isLoaded || !map || !interactive)
            return;
        var hoveredId = null;
        var setHover = function (next) {
            if (next === hoveredId)
                return;
            var sourceExists = !!map.getSource(sourceId);
            if (hoveredId != null && sourceExists) {
                map.setFeatureState({ source: sourceId, id: hoveredId }, { hover: false });
            }
            hoveredId = next;
            if (next != null && sourceExists) {
                map.setFeatureState({ source: sourceId, id: next }, { hover: true });
            }
        };
        var findArc = function (featureId) {
            return featureId == null
                ? undefined
                : latestRef.current.data.find(function (arc) { return String(arc.id) === String(featureId); });
        };
        var handleMouseMove = function (e) {
            var _a, _b, _c, _d;
            var featureId = (_b = (_a = e.features) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id;
            if (featureId == null || featureId === hoveredId)
                return;
            setHover(featureId);
            map.getCanvas().style.cursor = "pointer";
            var arc = findArc(featureId);
            if (arc) {
                (_d = (_c = latestRef.current).onHover) === null || _d === void 0 ? void 0 : _d.call(_c, {
                    arc: arc,
                    longitude: e.lngLat.lng,
                    latitude: e.lngLat.lat,
                    originalEvent: e
                });
            }
        };
        var handleMouseLeave = function () {
            var _a, _b;
            setHover(null);
            map.getCanvas().style.cursor = "";
            (_b = (_a = latestRef.current).onHover) === null || _b === void 0 ? void 0 : _b.call(_a, null);
        };
        var handleClick = function (e) {
            var _a, _b, _c, _d;
            var arc = findArc((_b = (_a = e.features) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id);
            if (!arc)
                return;
            (_d = (_c = latestRef.current).onClick) === null || _d === void 0 ? void 0 : _d.call(_c, {
                arc: arc,
                longitude: e.lngLat.lng,
                latitude: e.lngLat.lat,
                originalEvent: e
            });
        };
        map.on("mousemove", hitLayerId, handleMouseMove);
        map.on("mouseleave", hitLayerId, handleMouseLeave);
        map.on("click", hitLayerId, handleClick);
        return function () {
            map.off("mousemove", hitLayerId, handleMouseMove);
            map.off("mouseleave", hitLayerId, handleMouseLeave);
            map.off("click", hitLayerId, handleClick);
            setHover(null);
            map.getCanvas().style.cursor = "";
        };
    }, [isLoaded, map, hitLayerId, sourceId, interactive]);
    return null;
}
exports.MapArc = MapArc;
function MapClusterLayer(_a) {
    var _this = this;
    var data = _a.data, _b = _a.clusterMaxZoom, clusterMaxZoom = _b === void 0 ? 14 : _b, _c = _a.clusterRadius, clusterRadius = _c === void 0 ? 50 : _c, _d = _a.clusterColors, clusterColors = _d === void 0 ? ["#22c55e", "#eab308", "#ef4444"] : _d, _e = _a.clusterThresholds, clusterThresholds = _e === void 0 ? [100, 750] : _e, _f = _a.pointColor, pointColor = _f === void 0 ? "#3b82f6" : _f, onPointClick = _a.onPointClick, onClusterClick = _a.onClusterClick;
    var _g = useMap(), map = _g.map, isLoaded = _g.isLoaded;
    var id = react_1.useId();
    var sourceId = "cluster-source-" + id;
    var clusterLayerId = "clusters-" + id;
    var clusterCountLayerId = "cluster-count-" + id;
    var unclusteredLayerId = "unclustered-point-" + id;
    var stylePropsRef = react_1.useRef({
        clusterColors: clusterColors,
        clusterThresholds: clusterThresholds,
        pointColor: pointColor
    });
    // Add source and layers on mount
    react_1.useEffect(function () {
        if (!isLoaded || !map)
            return;
        // Add clustered GeoJSON source
        map.addSource(sourceId, {
            type: "geojson",
            data: data,
            cluster: true,
            clusterMaxZoom: clusterMaxZoom,
            clusterRadius: clusterRadius
        });
        // Add cluster circles layer
        map.addLayer({
            id: clusterLayerId,
            type: "circle",
            source: sourceId,
            filter: ["has", "point_count"],
            paint: {
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    clusterColors[0],
                    clusterThresholds[0],
                    clusterColors[1],
                    clusterThresholds[1],
                    clusterColors[2],
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    20,
                    clusterThresholds[0],
                    30,
                    clusterThresholds[1],
                    40,
                ],
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff",
                "circle-opacity": 0.85
            }
        });
        // Add cluster count text layer
        map.addLayer({
            id: clusterCountLayerId,
            type: "symbol",
            source: sourceId,
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["Open Sans"],
                "text-size": 12
            },
            paint: {
                "text-color": "#fff"
            }
        });
        // Add unclustered point layer
        map.addLayer({
            id: unclusteredLayerId,
            type: "circle",
            source: sourceId,
            filter: ["!", ["has", "point_count"]],
            paint: {
                "circle-color": pointColor,
                "circle-radius": 5,
                "circle-stroke-width": 2,
                "circle-stroke-color": "#fff"
            }
        });
        return function () {
            try {
                if (map.getLayer(clusterCountLayerId))
                    map.removeLayer(clusterCountLayerId);
                if (map.getLayer(unclusteredLayerId))
                    map.removeLayer(unclusteredLayerId);
                if (map.getLayer(clusterLayerId))
                    map.removeLayer(clusterLayerId);
                if (map.getSource(sourceId))
                    map.removeSource(sourceId);
            }
            catch (_a) {
                // ignore
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, map, sourceId]);
    // Update source data when data prop changes (only for non-URL data)
    react_1.useEffect(function () {
        if (!isLoaded || !map || typeof data === "string")
            return;
        var source = map.getSource(sourceId);
        if (source) {
            source.setData(data);
        }
    }, [isLoaded, map, data, sourceId]);
    // Update layer styles when props change
    react_1.useEffect(function () {
        if (!isLoaded || !map)
            return;
        var prev = stylePropsRef.current;
        var colorsChanged = prev.clusterColors !== clusterColors ||
            prev.clusterThresholds !== clusterThresholds;
        // Update cluster layer colors and sizes
        if (map.getLayer(clusterLayerId) && colorsChanged) {
            map.setPaintProperty(clusterLayerId, "circle-color", [
                "step",
                ["get", "point_count"],
                clusterColors[0],
                clusterThresholds[0],
                clusterColors[1],
                clusterThresholds[1],
                clusterColors[2],
            ]);
            map.setPaintProperty(clusterLayerId, "circle-radius", [
                "step",
                ["get", "point_count"],
                20,
                clusterThresholds[0],
                30,
                clusterThresholds[1],
                40,
            ]);
        }
        // Update unclustered point layer color
        if (map.getLayer(unclusteredLayerId) && prev.pointColor !== pointColor) {
            map.setPaintProperty(unclusteredLayerId, "circle-color", pointColor);
        }
        stylePropsRef.current = { clusterColors: clusterColors, clusterThresholds: clusterThresholds, pointColor: pointColor };
    }, [
        isLoaded,
        map,
        clusterLayerId,
        unclusteredLayerId,
        clusterColors,
        clusterThresholds,
        pointColor,
    ]);
    // Handle click events
    react_1.useEffect(function () {
        if (!isLoaded || !map)
            return;
        // Cluster click handler - zoom into cluster
        var handleClusterClick = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var features, feature, clusterId, pointCount, coordinates, source, zoom;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        features = map.queryRenderedFeatures(e.point, {
                            layers: [clusterLayerId]
                        });
                        if (!features.length)
                            return [2 /*return*/];
                        feature = features[0];
                        clusterId = (_a = feature.properties) === null || _a === void 0 ? void 0 : _a.cluster_id;
                        pointCount = (_b = feature.properties) === null || _b === void 0 ? void 0 : _b.point_count;
                        coordinates = feature.geometry.coordinates;
                        if (!onClusterClick) return [3 /*break*/, 1];
                        onClusterClick(clusterId, coordinates, pointCount);
                        return [3 /*break*/, 3];
                    case 1:
                        source = map.getSource(sourceId);
                        return [4 /*yield*/, source.getClusterExpansionZoom(clusterId)];
                    case 2:
                        zoom = _c.sent();
                        map.easeTo({
                            center: coordinates,
                            zoom: zoom
                        });
                        _c.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        // Unclustered point click handler
        var handlePointClick = function (e) {
            var _a;
            if (!onPointClick || !((_a = e.features) === null || _a === void 0 ? void 0 : _a.length))
                return;
            var feature = e.features[0];
            var coordinates = feature.geometry.coordinates.slice();
            // Handle world copies
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            onPointClick(feature, coordinates);
        };
        // Cursor style handlers
        var handleMouseEnterCluster = function () {
            map.getCanvas().style.cursor = "pointer";
        };
        var handleMouseLeaveCluster = function () {
            map.getCanvas().style.cursor = "";
        };
        var handleMouseEnterPoint = function () {
            if (onPointClick) {
                map.getCanvas().style.cursor = "pointer";
            }
        };
        var handleMouseLeavePoint = function () {
            map.getCanvas().style.cursor = "";
        };
        map.on("click", clusterLayerId, handleClusterClick);
        map.on("click", unclusteredLayerId, handlePointClick);
        map.on("mouseenter", clusterLayerId, handleMouseEnterCluster);
        map.on("mouseleave", clusterLayerId, handleMouseLeaveCluster);
        map.on("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
        map.on("mouseleave", unclusteredLayerId, handleMouseLeavePoint);
        return function () {
            map.off("click", clusterLayerId, handleClusterClick);
            map.off("click", unclusteredLayerId, handlePointClick);
            map.off("mouseenter", clusterLayerId, handleMouseEnterCluster);
            map.off("mouseleave", clusterLayerId, handleMouseLeaveCluster);
            map.off("mouseenter", unclusteredLayerId, handleMouseEnterPoint);
            map.off("mouseleave", unclusteredLayerId, handleMouseLeavePoint);
        };
    }, [
        isLoaded,
        map,
        clusterLayerId,
        unclusteredLayerId,
        sourceId,
        onClusterClick,
        onPointClick,
    ]);
    return null;
}
exports.MapClusterLayer = MapClusterLayer;
