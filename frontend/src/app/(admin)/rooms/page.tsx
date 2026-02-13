'use client';

import { CrudPage } from '@/components/crud-page';
import { RoomForm } from '@/components/forms';
import type { Column } from '@/components/data-table';
import type { RoomEntity } from '@/lib/types';

const columns: Column<RoomEntity>[] = [
  {
    key: 'room_number',
    header: 'Room #',
    render: (v) => (
      <span className="font-medium text-gray-900">{String(v)}</span>
    ),
  },
  { key: 'building_name', header: 'Building' },
  { key: 'floor_number', header: 'Floor' },
  {
    key: 'geofence_coordinates',
    header: 'Geofence',
    render: (v) => {
      const coords = v as Array<{ lat: number; lng: number }>;
      return coords.length > 0 ? (
        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">
          {coords.length} point{coords.length !== 1 ? 's' : ''}
        </span>
      ) : (
        <span className="text-gray-400">Not set</span>
      );
    },
  },
  {
    key: 'base_altitude',
    header: 'Altitude',
    render: (v) => (v != null ? `${v}m` : <span className="text-gray-400">—</span>),
  },
  {
    key: 'createdAt',
    header: 'Created',
    render: (v) => (
      <span className="text-gray-500 text-xs">{new Date(v as string).toLocaleDateString()}</span>
    ),
  },
];

export default function RoomsPage() {
  return (
    <CrudPage<RoomEntity>
      endpoint="/rooms"
      columns={columns}
      title="Rooms"
      description="Manage classrooms and their geofence boundaries"
      entityLabel="Room"
      renderForm={(props) => <RoomForm {...props} />}
    />
  );
}
