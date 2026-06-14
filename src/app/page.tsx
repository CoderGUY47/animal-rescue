import Link from 'next/link';
import Image from 'next/image';
import { FaExclamationCircle, FaArrowRight, FaHeart, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
export default function HomePage() {
 return (
 <div className="flex flex-col flex-1 p-4 gap-6 animate-in fade-in duration-500 pb-8">
 {/* Hero Section */}
 <section className="flex flex-col gap-4">
 <div className="flex flex-col gap-2">
 <h1 className="text-3xl font-semibold tracking-tight">Help Animals <br/><span className="text-primary">In Need</span></h1>
 <p className="text-muted-foreground text-sm">
 Quickly report sick, injured, or abandoned animals to nearby rescues and volunteers.
 </p>
 </div>

 <Link href="/report" className="w-full block">
 <div className="bg-rose-500 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3 active:scale-[0.98] transition-transform">
 <div className="bg-white/20 p-4 rounded-full">
 <FaShieldAlt className="w-10 h-10" />
 </div>
 <div className="text-center">
 <h2 className="text-xl font-semibold">Report Emergency</h2>
 <p className="text-sm opacity-90">Send a rescue request instantly</p>
 </div>
 </div>
 </Link>
 </section>

 {/* Quick Actions */}
 <section className="grid grid-cols-3 gap-3">
 <Link href="/map" className="block">
 <Card className="active:scale-[0.98] transition-transform bg-primary/5 border-primary/20">
 <CardContent className="p-3 flex flex-col items-center justify-center gap-2 text-center h-full">
 <FaMapMarkerAlt className="w-5 h-5 text-primary" />
 <span className="font-semibold text-[11px]">Vets</span>
 </CardContent>
 </Card>
 </Link>
 <Link href="/volunteer" className="block">
 <Card className="active:scale-[0.98] transition-transform bg-amber-500/5 border-amber-500/20">
 <CardContent className="p-3 flex flex-col items-center justify-center gap-2 text-center h-full">
 <FaHeart className="w-5 h-5 text-amber-500" />
 <span className="font-semibold text-[11px]">Volunteer</span>
 </CardContent>
 </Card>
 </Link>
 <Link href="/analytics" className="block">
 <Card className="active:scale-[0.98] transition-transform bg-blue-500/5 border-blue-500/20">
 <CardContent className="p-3 flex flex-col items-center justify-center gap-2 text-center h-full">
 <FaShieldAlt className="w-5 h-5 text-blue-500" />
 <span className="font-semibold text-[11px]">Analytics</span>
 </CardContent>
 </Card>
 </Link>
 </section>

 {/* Active Rescues Near You */}
 <section className="flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <h3 className="font-semibold text-lg flex items-center gap-2">
 <FaExclamationCircle className="w-5 h-5 text-orange-500" />
 Urgent Rescues
 </h3>
 <Link href="/rescues" className="text-sm text-primary flex items-center">
 See all <FaArrowRight className="w-4 h-4 ml-1" />
 </Link>
 </div>

 <div className="flex flex-col gap-3">
 {/* Mock Item 1 */}
 <Link href="/rescues/1" className="block">
 <Card className="overflow-hidden active:scale-[0.99] transition-transform">
 <div className="flex h-28">
 <div className="w-2/5 bg-muted relative">
 <Image 
 src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=400&auto=format&fit=crop"
 alt="Injured cat"
 fill
 className="object-cover"
 unoptimized
 />
 <div className="absolute top-2 left-2 bg-destructive text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
 Critical
 </div>
 </div>
 <div className="w-3/5 p-3 flex flex-col justify-between">
 <div>
 <h4 className="font-semibold text-sm leading-tight line-clamp-1">Injured Stray Cat</h4>
 <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 line-clamp-1">
 <FaMapMarkerAlt className="w-3 h-3" />
 Downtown Alley, 0.5m
 </p>
 </div>
 <div className="text-xs text-orange-600">
 Needs transportation
 </div>
 </div>
 </div>
 </Card>
 </Link>

          {/* Mock Item 2 */}
          <Link href="/rescues/2" className="block">
            <Card className="overflow-hidden active:scale-[0.99] transition-transform">
              <div className="flex h-28">
                <div className="w-2/5 bg-muted relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?q=80&w=400&auto=format&fit=crop"
                    alt="Abandoned puppy"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    Moderate
                  </div>
                </div>
                <div className="w-3/5 p-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm leading-tight line-clamp-1 font-semibold">Abandoned Puppy</h4>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 line-clamp-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      City Park, 1.2m
                    </p>
                  </div>
                  <div className="text-xs text-blue-600 font-semibold">
                    Needs foster home
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* How To Use Guide */}
      <section className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg flex items-center gap-2 font-semibold">
            How to Use RescueConnect
          </h3>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-semibold text-sm">1</div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Report an Emergency</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Fill out the quick emergency form and capture a clear image of the animal in need.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-semibold text-sm">2</div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Find Nearby Help</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Search the interactive map to locate rescue buildings, shelters, and veterinary clinics nearby.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-semibold text-sm">3</div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Track Progress</span>
                  <span className="text-xs text-muted-foreground mt-0.5">Check the rescues tab to see when help is on the way and communicate in real-time.</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
 );
}
