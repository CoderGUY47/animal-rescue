import { Suspense } from 'react';
import { MapView } from '@/components/map/map-view';

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
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Loading map...</div>}>
      <MapView searchQuery={q} />
    </Suspense>
  </div>
 );
}

