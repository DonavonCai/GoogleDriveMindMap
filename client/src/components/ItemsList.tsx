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
    return <p className="status-message">Loading items...</p>;
  }

  if (state.status === 'error') {
    return <p className="status-message">Error: {state.message}</p>;
  }

  return (
    <ul className="items-list" aria-label="Drive items">
      {state.items.map((item) => (
        <li key={item.id} className="item-card">
          <h3>{item.name}</h3>
          <p>{item.mimeType}</p>
          <p>Modified: {new Date(item.modifiedTime).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}

export default ItemsList;
