import Link from 'next/link';
import { FaHome, FaPlusCircle, FaMap, FaCog, FaUsers } from 'react-icons/fa';
import { MdPets } from 'react-icons/md';

export function BottomNav() {
 return (
 <nav className="fixed bottom-0 z-50 w-full border-t bg-background max-w-md mx-auto left-0 right-0">
 <div className="flex justify-around items-center h-16 px-2">
 <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary active:text-primary transition-colors">
 <FaHome className="h-5 w-5 mb-1" />
 <span className="text-[10px] ">Home</span>
 </Link>
 <Link href="/map" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary active:text-primary transition-colors">
 <FaMap className="h-5 w-5 mb-1" />
 <span className="text-[10px] ">Map</span>
 </Link>
 <Link href="/report" className="flex flex-col items-center justify-center w-full h-full text-primary relative top-[-10px]">
 <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg active:scale-95 transition-transform">
 <FaPlusCircle className="h-7 w-7" />
 </div>
 <span className="text-[10px] mt-1">Report</span>
 </Link>
 <Link href="/rescues" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary active:text-primary transition-colors">
 <MdPets className="h-5 w-5 mb-1" />
 <span className="text-[10px] ">Rescues</span>
 </Link>
 <Link href="/community" className="flex flex-col items-center justify-center w-full h-full text-muted-foreground hover:text-primary active:text-primary transition-colors">
 <FaUsers className="h-5 w-5 mb-1" />
 <span className="text-[10px] ">Community</span>
 </Link>
 </div>
 </nav>
 );
}
