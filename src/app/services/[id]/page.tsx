import Link from "next/link";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaStar, FaGlobe, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Service Details - Rescue Connect",
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // mock data since we do not have a real backend to fetch by id
  const service = {
    id,
    name: "Citywide Emergency Veterinary",
    type: "Veterinary Hospital",
    address: "412 West Medical Blvd, NYC",
    distance: "1.2 km away",
    phone: "+1 555-0899",
    website: "https://citywidevet.example.com",
    hours: "Open 24/7",
    rating: 4.8,
    reviews: 124,
    emergencySupport: true,
    services: ["Emergency Surgery", "X-Ray", "Vaccinations", "Stray Intake"],
  };

  return (
    <div className="flex flex-col flex-1 bg-muted/10 pb-20 animate-in fade-in duration-500 p-5 gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold leading-tight">{service.name}</h1>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{service.type}</span>
          {service.emergencySupport && (
            <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <FaExclamationTriangle /> 24/7 Emergency
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-amber-50 text-amber-600 w-fit px-3 py-1.5 rounded-xl">
        <FaStar className="w-5 h-5" />
        <span className="font-bold text-lg">{service.rating}</span>
        <span className="text-sm">({service.reviews} reviews)</span>
      </div>

      <div className="flex flex-col gap-3 bg-card border rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-medium">{service.address}</span>
            <span className="text-xs text-muted-foreground">{service.distance}</span>
          </div>
        </div>
        <div className="w-full h-px bg-border my-1" />
        <div className="flex items-center gap-3">
          <FaClock className="w-5 h-5 text-primary shrink-0" />
          <span className="font-medium">{service.hours}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-lg border-b pb-1">Services Offered</h3>
        <div className="grid grid-cols-2 gap-2">
          {service.services.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded-lg border">
              <FaCheckCircle className="text-green-500 w-4 h-4 shrink-0" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 mt-auto">
        <a href={`tel:${service.phone}`} className="w-full">
          <Button size="lg" className="w-full text-base font-semibold shadow-md h-14 rounded-xl">
            <FaPhone className="w-5 h-5 mr-2" /> Call {service.phone}
          </Button>
        </a>
        <div className="flex gap-3">
          <a href={service.website} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="lg" className="w-full text-base h-12 rounded-xl">
              <FaGlobe className="w-4 h-4 mr-2" /> Website
            </Button>
          </a>
          <Link href="/map" className="flex-1">
            <Button variant="outline" size="lg" className="w-full text-base h-12 rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50">
              <FaMapMarkerAlt className="w-4 h-4 mr-2" /> Navigate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
