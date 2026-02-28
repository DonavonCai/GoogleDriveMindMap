import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ItemsList from '../components/ItemsList';
import type { ApiResponse, DriveItem } from '@gdmm/shared';

const mockItems: DriveItem[] = [
  {
    id: '1',
    name: 'My Drive',
    mimeType: 'application/vnd.google-apps.folder',
    parentId: null,
    modifiedTime: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'README.md',
    mimeType: 'text/markdown',
    parentId: '1',
    modifiedTime: '2026-02-01T09:30:00.000Z',
  },
];

const mockSuccessResponse: ApiResponse<DriveItem[]> = {
  data: mockItems,
  success: true,
};

const mockErrorResponse: ApiResponse<DriveItem[]> = {
  data: [],
  success: false,
  message: 'Unauthorized',
};

describe('ItemsList', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a loading message while fetching', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(<ItemsList />);
    expect(screen.getByText('Loading items...')).toBeInTheDocument();
  });

  it('renders drive items on successful fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockSuccessResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<ItemsList />);

    await waitFor(() => {
      expect(screen.getByText('My Drive')).toBeInTheDocument();
      expect(screen.getByText('README.md')).toBeInTheDocument();
    });
  });

  it('renders an error message when the API returns success: false', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(mockErrorResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<ItemsList />);

    await waitFor(() => {
      expect(screen.getByText('Error: Unauthorized')).toBeInTheDocument();
    });
  });

  it('renders an error message when fetch throws a network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network failure'));

    render(<ItemsList />);

    await waitFor(() => {
      expect(screen.getByText('Error: Network failure')).toBeInTheDocument();
    });
  });
});
