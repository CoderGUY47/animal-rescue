"use client";

import {
 Map,
 MapControls,
 MapMarker,
 MarkerContent,
 MarkerPopup,
 MapRoute,
} from "@/components/ui/map";
import { FaSearch, FaSpinner, FaMapMarkerAlt, FaMapPin, FaCrosshairs, FaClinicMedical, FaHome, FaStore, FaHospital, FaStar, FaPaperPlane } from "react-icons/fa";
import { useState, useEffect, useRef, useMemo } from "react";
import { fetchNearbyPlaces, reverseGeocode, searchLocation, fetchRoute } from "@/lib/api";
import type { Place, PlaceType, SearchResult } from "@/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { useLanguage } from "@/components/providers/language-provider";

const TYPE_CONFIG: Record<PlaceType, { label: string; color: string; Icon: React.ElementType }> = {
  veterinary: { label: "Veterinary", color: "bg-blue-600", Icon: () => <FaClinicMedical className="w-3 h-3 text-white" /> },
  shelter: { label: "Animal Shelter", color: "bg-amber-500", Icon: () => <FaHome className="w-3 h-3 text-white" /> },
  pet_shop: { label: "Pet Shop", color: "bg-green-600", Icon: () => <FaStore className="w-3 h-3 text-white" /> },
  hospital: { label: "Animal Hospital", color: "bg-rose-600", Icon: () => <FaHospital className="w-3 h-3 text-white" /> },
};

const getPlaceTypeTranslation = (type: PlaceType, t: (k: string) => string) => {
  switch (type) {
    case "veterinary": return t("map.veterinary");
    case "shelter": return t("map.animalShelter");
    case "pet_shop": return t("map.petShop");
    case "hospital": return t("map.animalHospital");
    default: return type;
  }
};

const DEFAULT_CENTER: [number, number] = [-74.006, 40.7128]; // nyc fallback
// cache location across page navigations
let cachedCoords: [number, number] | null = null;

export function MapView({ searchQuery }: { searchQuery: string }) {
  const searchParams = useSearchParams();
  const reports = useAppSelector((state) => state.reports.items);
  const { t } = useLanguage();

 const latParam = searchParams.get("lat");
 const lngParam = searchParams.get("lng");

 const [center, setCenter] = useState<[number, number]>(() => {
   if (latParam && lngParam) {
     const lat = parseFloat(latParam);
     const lng = parseFloat(lngParam);
     if (!isNaN(lat) && !isNaN(lng)) {
       return [lng, lat];
     }
   }
   return cachedCoords ?? DEFAULT_CENTER;
 });
 const [address, setAddress] = useState<string>("");
 const [places, setPlaces] = useState<Place[]>([]);
 const [loading, setLoading] = useState(false); // don't block map render
 const [locating, setLocating] = useState(() => {
   if (latParam && lngParam) return false;
   return !cachedCoords;
 });
 const [query, setQuery] = useState(searchQuery);
 const [locationSuggestions, setLocationSuggestions] = useState<SearchResult[]>([]);
 const [isSearchingLocations, setIsSearchingLocations] = useState(false);
 const [showSuggestions, setShowSuggestions] = useState(false);
 const [activeFilter, setActiveFilter] = useState<PlaceType | "all" | "emergency">("all");
 const [routeData, setRouteData] = useState<{ coordinates: [number, number][], color: string } | null>(null);
 const hasFetched = useRef(false); // guard: runs only once
 const mapRef = useRef<import("maplibre-gl").Map | null>(null);

 // Fly to coordinates if query parameters change
 useEffect(() => {
   if (latParam && lngParam) {
     const lat = parseFloat(latParam);
     const lng = parseFloat(lngParam);
     if (!isNaN(lat) && !isNaN(lng)) {
       cachedCoords = [lng, lat];
       setCenter([lng, lat]);
       setLocating(false);
       mapRef.current?.flyTo({ center: [lng, lat], zoom: 15, duration: 1200 });
       loadData(lat, lng);
     }
   }
 }, [latParam, lngParam]);

 // filter scrolling logic
 const filtersRef = useRef<HTMLDivElement>(null);

 // swipe to scroll logic for filters
 const filterDrag = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

 const handleFilterPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
 filterDrag.current.isDragging = true;
 filterDrag.current.startX = e.pageX - (filtersRef.current?.offsetLeft || 0);
 filterDrag.current.scrollLeft = filtersRef.current?.scrollLeft || 0;
 };

 const handleFilterPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
 if (!filterDrag.current.isDragging || !filtersRef.current) return;
 e.preventDefault();
 const x = e.pageX - filtersRef.current.offsetLeft;
 const walk = (x - filterDrag.current.startX) * 1.5;
 filtersRef.current.scrollLeft = filterDrag.current.scrollLeft - walk;
 };

 const handleFilterPointerUp = () => {
 filterDrag.current.isDragging = false;
 };

 // dragging logic for legend
 const legendRef = useRef<HTMLDivElement>(null);
 const dragPos = useRef({ x: 0, y: 0 });
 const isDragging = useRef(false);
 const startPos = useRef({ x: 0, y: 0 });

 const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
 isDragging.current = true;
 startPos.current = { x: e.clientX - dragPos.current.x, y: e.clientY - dragPos.current.y };
 e.currentTarget.setPointerCapture(e.pointerId);
 };

 const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
 if (!isDragging.current || !legendRef.current) return;
 dragPos.current = { x: e.clientX - startPos.current.x, y: e.clientY - startPos.current.y };
 legendRef.current.style.transform = `translate(${dragPos.current.x}px, ${dragPos.current.y}px)`;
 };

 const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
 isDragging.current = false;
 e.currentTarget.releasePointerCapture(e.pointerId);
 };

 useEffect(() => {
 if (hasFetched.current) return;
 hasFetched.current = true;

 // if we already have cached coords, load data immediately
 if (cachedCoords) {
 const [lng, lat] = cachedCoords;
 setLocating(false);
 loadData(lat, lng);
 return;
 }

 navigator.geolocation.getCurrentPosition(
 async ({ coords }) => {
 const { latitude, longitude } = coords;
 cachedCoords = [longitude, latitude];
 setCenter([longitude, latitude]);
 setLocating(false);
 await loadData(latitude, longitude);
 },
 async () => {
 // Fallback to NYC
 setLocating(false);
 await loadData(DEFAULT_CENTER[1], DEFAULT_CENTER[0]);
 },
 { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
 );
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 // Separate function so it can be called from both paths
 async function loadData(lat: number, lng: number) {
 setLoading(true);
 const [addr, results] = await Promise.allSettled([
 reverseGeocode(lat, lng),
 fetchNearbyPlaces(lat, lng, 100000),
 ]);
 if (addr.status === "fulfilled") setAddress(addr.value);
 if (results.status === "fulfilled") setPlaces(results.value);
 setLoading(false);
 }

 const filteredPlaces = useMemo(() => {
 let result = places;
 if (activeFilter !== "all") {
 if (activeFilter === "emergency") {
 result = result.filter(p => p.hours?.toLowerCase().includes("24") || p.type === "hospital");
 } else {
 result = result.filter(p => p.type === activeFilter);
 }
 }
 if (!query.trim()) return result;
 const q = query.toLowerCase();
 return result.filter(
 (p) =>
 p.name.toLowerCase().includes(q) ||
 p.type.toLowerCase().includes(q) ||
 TYPE_CONFIG[p.type].label.toLowerCase().includes(q)
 );
 }, [places, query, activeFilter]);

 useEffect(() => {
 if (!query.trim() || query.length < 3) {
 setLocationSuggestions([]);
 setShowSuggestions(false);
 return;
 }
 const timeoutId = setTimeout(async () => {
 setIsSearchingLocations(true);
 try {
 const results = await searchLocation(query);
 setLocationSuggestions(results);
 setShowSuggestions(true);
 } catch (e) {
 console.error(e);
 } finally {
 setIsSearchingLocations(false);
 }
 }, 500);
 return () => clearTimeout(timeoutId);
 }, [query]);

 const handleLocationSelect = async (loc: SearchResult) => {
 setShowSuggestions(false);
 setQuery("");
 setLocationSuggestions([]);
 cachedCoords = [loc.lng, loc.lat];
 setCenter([loc.lng, loc.lat]);
 setLocating(false);
 mapRef.current?.flyTo({ center: [loc.lng, loc.lat], zoom: 14, duration: 1500 });
 await loadData(loc.lat, loc.lng);
 };

 const handleLocateClick = async (coords: { latitude: number, longitude: number }) => {
 cachedCoords = [coords.longitude, coords.latitude];
 setCenter([coords.longitude, coords.latitude]);
 setLocating(false);
 await loadData(coords.latitude, coords.longitude);
 };

 const handleGetDirections = async (destLng: number, destLat: number) => {
 const startLng = center[0];
 const startLat = center[1];
 const coords = await fetchRoute(startLng, startLat, destLng, destLat);

 // Mock traffic levels (Low: Green, Mid: Red, High: Red)
 // User specifically requested: "if traffice show red color line, it not show green line. use this 2 colors"
 const rand = Math.random();
 const color = rand > 0.4 ? "#ef4444" : "#22c55e"; // 60% chance of traffic (Red), 40% chance of clear (Green)

 setRouteData({ coordinates: coords, color });
 };

 return (
 <div style={{ position: "absolute", inset: 0 }}>

 {/* ── Search bar overlay ─────────────────────────────── */}
 <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2">
 <div className="flex bg-background rounded-full shadow-lg border overflow-hidden items-center px-3 gap-2">
 <FaSearch className="w-4 h-4 shrink-0 text-muted-foreground" />
 {/* suppressHydrationWarning prevents browser autofill extensions causing hydration mismatch */}
 <input
 suppressHydrationWarning
 value={query}
 onChange={(e) => {
 setQuery(e.target.value);
 setShowSuggestions(true);
 }}
 onFocus={() => { if (locationSuggestions.length > 0) setShowSuggestions(true); }}
 placeholder={t("map.searchPlaceholder")}
 className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
 />
 {(loading || isSearchingLocations) && (
 <FaSpinner className="w-4 h-4 shrink-0 animate-spin text-muted-foreground" />
 )}
 </div>

 {/* Advanced Filters */}
 <div 
 ref={filtersRef}
 onPointerDown={handleFilterPointerDown}
 onPointerMove={handleFilterPointerMove}
 onPointerUp={handleFilterPointerUp}
 onPointerLeave={handleFilterPointerUp}
 className="flex gap-2 overflow-x-auto pb-1 snap-x scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full px-1 cursor-grab active:cursor-grabbing select-none"
 >
 <button
 onClick={() => setActiveFilter("all")}
 className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap snap-start transition-colors border ${activeFilter === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-background/90 backdrop-blur border-border text-muted-foreground hover:bg-muted"}`}
 >
 {t("map.filterAll")}
 </button>
 <button
 onClick={() => setActiveFilter("emergency")}
 className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap snap-start transition-colors border ${activeFilter === "emergency" ? "bg-rose-600 text-white border-rose-600" : "bg-background/90 backdrop-blur border-border text-rose-600 hover:bg-rose-50"}`}
 >
 🚨 {t("map.filterEmergency")}
 </button>
 {(Object.entries(TYPE_CONFIG) as [PlaceType, typeof TYPE_CONFIG[PlaceType]][]).map(([type]) => (
 <button
 key={type}
 onClick={() => setActiveFilter(type)}
 className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap snap-start transition-colors border ${activeFilter === type ? "bg-primary text-primary-foreground border-primary" : "bg-background/90 backdrop-blur border-border text-muted-foreground hover:bg-muted"}`}
 >
 {getPlaceTypeTranslation(type, t)}
 </button>
 ))}
 </div>
 
 {/* Suggestions Dropdown */}
 {showSuggestions && locationSuggestions.length > 0 && (
 <div className="bg-background rounded-xl shadow-xl border overflow-hidden flex flex-col mt-1 divide-y max-h-60 overflow-y-auto">
 {locationSuggestions.map((loc, i) => (
 <button
 key={i}
 onClick={() => handleLocationSelect(loc)}
 className="flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
 >
 <FaMapPin className="w-4 h-4 shrink-0 text-muted-foreground" />
 <div className="flex flex-col overflow-hidden">
 <span className="text-sm font-medium truncate">{loc.name.split(",")[0]}</span>
 <span className="text-xs text-muted-foreground truncate">{loc.name.split(",").slice(1).join(",")}</span>
 </div>
 </button>
 ))}
 </div>
 )}

 {/* Location address pill */}
 {address && (
 <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur rounded-full px-3 py-1.5 text-xs text-muted-foreground self-start shadow border max-w-full truncate">
 <FaMapPin className="w-3 h-3 shrink-0 text-primary" />
 <span className="truncate">{address.split(",").slice(0, 3).join(", ")}</span>
 </div>
 )}

 {/* Result count */}
 {!loading && (
 <div className="bg-background/90 backdrop-blur rounded-full px-3 py-1 text-xs text-muted-foreground self-start shadow border">
 {filteredPlaces.length} {t("map.placesFound")}
 </div>
 )}
 </div>

 {/* ── Legend ─────────────────────────────────────────── */}
 <div
 ref={legendRef}
 onPointerDown={handlePointerDown}
 onPointerMove={handlePointerMove}
 onPointerUp={handlePointerUp}
 className="absolute bottom-20 left-3 z-10 bg-background/95 backdrop-blur rounded-xl border shadow-lg p-3 flex flex-col gap-1.5 text-xs cursor-grab active:cursor-grabbing touch-none select-none"
 >
 <span className="font-semibold text-[10px] uppercase text-muted-foreground tracking-wider mb-1">{t("map.places")}</span>
 {(Object.entries(TYPE_CONFIG) as [PlaceType, typeof TYPE_CONFIG[PlaceType]][]).map(([type, { color, Icon }]) => (
 <div key={type} className="flex items-center gap-2">
 <div className={`${color} p-1 rounded-full`}>
 <Icon className="w-3 h-3 text-white" />
 </div>
 <span className="text-muted-foreground">{getPlaceTypeTranslation(type, t)}</span>
 </div>
 ))}
 
 <div className="h-px w-full bg-border my-1" />
 <span className="font-semibold text-[10px] uppercase text-muted-foreground tracking-wider mb-0.5">{t("map.traffic")}</span>
 <div className="flex items-center gap-2">
 <div className="w-5 h-1.5 bg-[#22c55e] rounded-full" />
 <span className="text-muted-foreground">{t("map.trafficClear")}</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-5 h-1.5 bg-[#ef4444] rounded-full" />
 <span className="text-muted-foreground">{t("map.trafficHeavy")}</span>
 </div>
 </div>

 {/* ── Map ────────────────────────────────────────────── */}
 <Map
 ref={mapRef}
 center={center}
 zoom={13}
 loading={loading} // Only blur while fetching places, NOT during geolocation
 className="w-full h-full"
 >
 <MapControls position="bottom-right" showZoom showLocate onLocate={handleLocateClick} />

 {/* User location pulse marker */}
 {!locating && (
 <MapMarker latitude={center[1]} longitude={center[0]}>
 <MarkerContent>
 <div className="relative flex items-center justify-center">
 <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg z-10" />
 <div className="absolute w-8 h-8 bg-blue-400 rounded-full animate-ping opacity-40" />
 </div>
 </MarkerContent>
 <MarkerPopup>
 <p className="text-xs font-semibold flex items-center gap-1">
 <FaCrosshairs className="w-3 h-3 text-blue-600" /> Your Location
 </p>
 {address && (
 <p className="text-[10px] text-muted-foreground mt-1 max-w-40">
 {address.split(",").slice(0, 3).join(", ")}
 </p>
 )}
 </MarkerPopup>
 </MapMarker>
 )}

 {/* Nearby place markers */}
 {filteredPlaces.map((place) => {
    const cfg = TYPE_CONFIG[place.type];
    const numericId = typeof place.id === "number" ? place.id : place.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const rating = (3.5 + (numericId % 15) / 10).toFixed(1); // Mock pseudo-random deterministic rating
    return (
 <MapMarker key={place.id} latitude={place.lat} longitude={place.lng}>
 <MarkerContent>
 <div className={`p-1.5 rounded-full shadow-lg border-2 border-white ${cfg.color}`}>
 <cfg.Icon className="w-4 h-4 text-white" />
 </div>
 </MarkerContent>
 <MarkerPopup closeButton className="w-52">
 <div className="flex flex-col gap-1.5">
 <div className="flex items-center justify-between">
 <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white self-start ${cfg.color}`}>
 {cfg.label}
 </span>
 <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-md">
 <FaStar className="w-3 h-3" />
 <span className="text-xs font-bold">{rating}</span>
 </div>
 </div>
 <Link href={`/services/${place.id}`} className="hover:underline">
 <h3 className="font-semibold text-sm leading-tight mt-1 text-blue-600 dark:text-blue-400">{place.name}</h3>
 </Link>
 {place.phone && (
 <a href={`tel:${place.phone}`} className="text-xs text-primary font-medium hover:underline">
 📞 {place.phone}
 </a>
 )}
 {place.website && (
 <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline truncate">
 🌐 Website
 </a>
 )}
 {place.hours && (
 <p className="text-xs text-muted-foreground">🕐 {place.hours}</p>
 )}
 <button
 onClick={() => handleGetDirections(place.lng, place.lat)}
 className="mt-2 w-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5"
 >
 <FaPaperPlane className="w-3 h-3" /> Get Directions
 </button>
 </div>
 </MarkerPopup>
 </MapMarker>
 );
 })}

  {/* Active Redux Rescue Markers */}
  {reports.filter(r => r.lat && r.lng && r.status !== "resolved").map((rescue) => {
    const isCritical = rescue.severity === "critical";
    const statusColor = rescue.status === "in-progress" ? "bg-blue-500" : "bg-rose-500";
    return (
      <MapMarker key={rescue.id} latitude={rescue.lat!} longitude={rescue.lng!}>
        <MarkerContent>
          <div className="relative flex items-center justify-center cursor-pointer">
            <div className={`w-6 h-6 ${statusColor} border-2 border-white rounded-full shadow-lg z-10 flex items-center justify-center text-white text-[10px]`}>
              🐾
            </div>
            <div className={`absolute w-10 h-10 ${isCritical ? "bg-rose-400" : "bg-blue-400"} rounded-full animate-ping opacity-45`} />
          </div>
        </MarkerContent>
        <MarkerPopup closeButton className="w-52">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full text-white",
                rescue.severity === "critical" ? "bg-rose-600" : "bg-amber-500"
              )}>
                {rescue.severity}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize font-medium">{rescue.status}</span>
            </div>
            <Link href={`/rescues/${rescue.id}`} className="hover:underline">
              <h3 className="font-semibold text-xs leading-tight capitalize text-blue-600 dark:text-blue-400">{rescue.animalType} in distress</h3>
            </Link>
            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">{rescue.condition}</p>
            <p className="text-[10px] font-semibold text-muted-foreground">📍 {rescue.locationInfo}</p>
            <Link href={`/rescues/${rescue.id}`} className="w-full">
              <Button size="sm" className="mt-1.5 w-full text-[10px] h-7 font-bold">
                View Rescue Details &rarr;
              </Button>
            </Link>
          </div>
        </MarkerPopup>
      </MapMarker>
    );
  })}

 {/* Route Line */}
 {routeData && (
 <MapRoute
 id="directions-route"
 coordinates={routeData.coordinates}
 color={routeData.color}
 width={3}
 />
 )}

 {/* Paper Plane Start Icon */}
 {routeData && routeData.coordinates.length > 0 && (
 <MapMarker latitude={routeData.coordinates[0][1]} longitude={routeData.coordinates[0][0]}>
 <MarkerContent>
 <div className="bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-lg border-2 border-blue-500 animate-bounce">
 <FaPaperPlane className="w-4 h-4 text-blue-500" />
 </div>
 </MarkerContent>
 </MapMarker>
 )}
 </Map>
 </div>
 );
}
