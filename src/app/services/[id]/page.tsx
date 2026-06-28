import Link from "next/link";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaStar, FaGlobe, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { fetchPlaceDetails } from "@/lib/api";

export const metadata = {
  title: "Service Details - Rescue Connect",
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await fetchPlaceDetails(id);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center gap-4 pb-20">
        <FaExclamationTriangle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-bold">Service Facility Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          The requested service facility could not be retrieved from OpenStreetMap tags.
        </p>
        <Link href="/map">
          <Button>Back to Map View</Button>
        </Link>
      </div>
    );
  }

  // dynamic type tags
  const typeLabelMap = {
    veterinary: "Veterinary Clinic",
    shelter: "Animal Shelter",
    pet_shop: "Pet Store",
    hospital: "Animal Hospital",
  };

  const formattedType = typeLabelMap[service.type] || "Rescue Service";
  
  // mock rating details derived deterministically from ID
  const rating = (3.8 + (Number(service.id) % 12) / 10).toFixed(1);
  const reviews = 20 + (Number(service.id) % 80);

  return (
    <div className="flex flex-col flex-1 bg-muted/10 pb-20 animate-in fade-in duration-500 p-5 gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold leading-tight">{service.name}</h1>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">{formattedType}</span>
          {(service.type === "hospital" || service.hours?.toLowerCase().includes("24")) && (
            <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <FaExclamationTriangle /> 24/7 Emergency
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 w-fit px-3 py-1.5 rounded-xl">
        <FaStar className="w-5 h-5" />
        <span className="font-bold text-lg">{rating}</span>
        <span className="text-sm">({reviews} reviews)</span>
      </div>

      <div className="flex flex-col gap-3 bg-card border rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-medium text-sm">Coordinates: {service.lat.toFixed(5)}, {service.lng.toFixed(5)}</span>
            <span className="text-xs text-muted-foreground">Nearby services map</span>
          </div>
        </div>
        <div className="w-full h-px bg-border my-1" />
        <div className="flex items-center gap-3">
          <FaClock className="w-5 h-5 text-primary shrink-0" />
          <span className="font-medium text-sm">{service.hours || "Open (Hours unlisted)"}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-lg border-b pb-1">Services Offered</h3>
        <div className="grid grid-cols-2 gap-2">
          {service.type === "veterinary" || service.type === "hospital" ? (
            <>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>Emergency Surgery</span></div>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>X-Ray & Diagnostics</span></div>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>Vaccinations</span></div>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>Stray Intake</span></div>
            </>
          ) : service.type === "shelter" ? (
            <>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>Temporary Foster</span></div>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>Adoption Boarding</span></div>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>Lost & Found Registry</span></div>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>Feeding Station</span></div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>Pet Food Supplies</span></div>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>Rescue Gears</span></div>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>OTC Medicines</span></div>
              <div className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border"><FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" /><span>First Aid Kits</span></div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 mt-auto">
        {service.phone && (
          <a href={`tel:${service.phone}`} className="w-full">
            <Button size="lg" className="w-full text-base font-semibold shadow-md h-14 rounded-xl">
              <FaPhone className="w-5 h-5 mr-2" /> Call {service.phone}
            </Button>
          </a>
        )}
        <div className="flex gap-3">
          {service.website && (
            <a href={service.website} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" size="lg" className="w-full text-base h-12 rounded-xl">
                <FaGlobe className="w-4 h-4 mr-2" /> Website
              </Button>
            </a>
          )}
          <Link href={`/map?lat=${service.lat}&lng=${service.lng}`} className="flex-1">
            <Button variant="outline" size="lg" className="w-full text-base h-12 rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50">
              <FaMapMarkerAlt className="w-4 h-4 mr-2" /> Navigate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
