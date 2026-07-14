"use strict";
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
exports.__esModule = true;
exports.fetchPlaceDetails = exports.fetchRoute = exports.searchLocation = exports.reverseGeocode = exports.fetchNearbyPlaces = void 0;
var axios_1 = require("axios");
// internal: http client for the overpass openstreetmap api
var overpassApi = axios_1["default"].create({
    baseURL: "https://overpass-api.de/api",
    timeout: 15000,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
});
// internal: http client for reverse geocoding and location search
var nominatimApi = axios_1["default"].create({
    baseURL: "https://nominatim.openstreetmap.org",
    timeout: 10000,
    headers: {
        Accept: "application/json",
        // nominatim requires a user-agent string
        "User-Agent": "AnimalRescueConnect/1.0 (contact@rescueconnect.app)"
    }
});
// helper: find nearby animal-related places via overpass
function fetchNearbyPlaces(lat, lng, radiusMeters) {
    if (radiusMeters === void 0) { radiusMeters = 5000; }
    return __awaiter(this, void 0, void 0, function () {
        var query, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = "\n [out:json][timeout:25];\n (\n node[\"amenity\"=\"veterinary\"](around:" + radiusMeters + "," + lat + "," + lng + ");\n node[\"amenity\"=\"animal_shelter\"](around:" + radiusMeters + "," + lat + "," + lng + ");\n node[\"shop\"=\"pet\"](around:" + radiusMeters + "," + lat + "," + lng + ");\n node[\"amenity\"=\"hospital\"][\"animal\"](around:" + radiusMeters + "," + lat + "," + lng + ");\n );\n out body;\n ";
                    return [4 /*yield*/, overpassApi.post("/interpreter", "data=" + encodeURIComponent(query))];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data.elements
                            .filter(function (el) { var _a; return (_a = el.tags) === null || _a === void 0 ? void 0 : _a.name; })
                            .map(function (el) { return ({
                            id: el.id,
                            lat: el.lat,
                            lng: el.lon,
                            name: el.tags.name,
                            type: resolveType(el.tags),
                            phone: el.tags.phone,
                            hours: el.tags["opening_hours"],
                            website: el.tags.website
                        }); })];
            }
        });
    });
}
exports.fetchNearbyPlaces = fetchNearbyPlaces;
// helper: reverse geocode a lat/lng into a readable address
function reverseGeocode(lat, lng) {
    var _a;
    return __awaiter(this, void 0, Promise, function () {
        var data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, nominatimApi.get("/reverse", {
                        params: { lat: lat, lon: lng, format: "json" }
                    })];
                case 1:
                    data = (_b.sent()).data;
                    return [2 /*return*/, (_a = data.display_name) !== null && _a !== void 0 ? _a : lat.toFixed(4) + ", " + lng.toFixed(4)];
            }
        });
    });
}
exports.reverseGeocode = reverseGeocode;
// helper: search for a location by query string
function searchLocation(query) {
    return __awaiter(this, void 0, Promise, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, nominatimApi.get("/search", {
                        params: { q: query, format: "json", limit: 5 }
                    })];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data.map(function (item) { return ({
                            name: item.display_name,
                            lat: parseFloat(item.lat),
                            lng: parseFloat(item.lon)
                        }); })];
            }
        });
    });
}
exports.searchLocation = searchLocation;
// helper: fetch a driving route via osrm
function fetchRoute(startLng, startLat, endLng, endLat) {
    return __awaiter(this, void 0, Promise, function () {
        var data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].get("https://router.project-osrm.org/route/v1/driving/" + startLng + "," + startLat + ";" + endLng + "," + endLat + "?overview=full&geometries=geojson")];
                case 1:
                    data = (_a.sent()).data;
                    if (data.routes && data.routes.length > 0) {
                        return [2 /*return*/, data.routes[0].geometry.coordinates];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.error("Route fetch failed", e_1);
                    return [3 /*break*/, 3];
                case 3: 
                // fallback to straight line
                return [2 /*return*/, [
                        [startLng, startLat],
                        [endLng, endLat],
                    ]];
            }
        });
    });
}
exports.fetchRoute = fetchRoute;
// helper: fetch place details by OSM node ID
function fetchPlaceDetails(id) {
    return __awaiter(this, void 0, Promise, function () {
        var query, data, el, tags, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = "\n    [out:json][timeout:15];\n    node(" + id + ");\n    out body;\n    ";
                    return [4 /*yield*/, overpassApi.post("/interpreter", "data=" + encodeURIComponent(query))];
                case 1:
                    data = (_a.sent()).data;
                    if (data.elements && data.elements.length > 0) {
                        el = data.elements[0];
                        tags = (el.tags || {});
                        return [2 /*return*/, {
                                id: el.id,
                                lat: el.lat,
                                lng: el.lon,
                                name: tags.name || "Verified Rescue Facility",
                                type: resolveType(el.tags || {}),
                                phone: tags.phone || tags["contact:phone"],
                                hours: tags.opening_hours || "Open (Hours unlisted)",
                                website: tags.website || tags["contact:website"]
                            }];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_2 = _a.sent();
                    console.error("Failed to fetch place details", e_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, null];
            }
        });
    });
}
exports.fetchPlaceDetails = fetchPlaceDetails;
// helper: resolve types
function resolveType(tags) {
    if (tags.amenity === "veterinary")
        return "veterinary";
    if (tags.amenity === "animal_shelter")
        return "shelter";
    if (tags.shop === "pet")
        return "pet_shop";
    return "hospital";
}
