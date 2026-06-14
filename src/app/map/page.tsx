import { MapView } from './map-view';

export const metadata = {
 title: 'Map - Rescue Connect',
};

export default async function MapPage({
 searchParams,
}: {
 searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
 const queryParams = await searchParams;
 const q = typeof queryParams.q === 'string' ? queryParams.q.toLowerCase() : '';

 return (
 <div className="relative" style={{ height: 'calc(100vh - 120px)' }}>
 <MapView searchQuery={q} />
 </div>
 );
}
