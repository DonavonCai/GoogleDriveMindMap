import { useEffect, useState } from 'react';
import type { ApiResponse, DriveItem } from '@gdmm/shared';

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; items: DriveItem[] };

async function fetchItems(): Promise<DriveItem[]> {
  const response = await fetch('/api/items');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const body: ApiResponse<DriveItem[]> = await response.json();
  if (!body.success) {
    throw new Error(body.message ?? 'Unknown error');
  }
  return body.data;
}

function ItemsList() {
  const [state, setState] = useState<FetchState>({ status: 'idle' });

  useEffect(() => {
    setState({ status: 'loading' });
    fetchItems()
      .then((items) => setState({ status: 'success', items }))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setState({ status: 'error', message });
      });
  }, []);

  if (state.status === 'idle' || state.status === 'loading') {
    return <p className="p-4 text-base text-gray-600">Loading items...</p>;
  }

  if (state.status === 'error') {
    return <p className="p-4 text-base text-gray-600">Error: {state.message}</p>;
  }

  return (
    <ul className="flex flex-col gap-3 list-none" aria-label="Drive items">
      {state.items.map((item) => (
        <li key={item.id} className="bg-white border border-gray-200 rounded-lg px-5 py-4">
          <h3 className="text-base font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{item.mimeType}</p>
          <p className="text-sm text-gray-500 mt-1">
            Modified: {new Date(item.modifiedTime).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default ItemsList;
