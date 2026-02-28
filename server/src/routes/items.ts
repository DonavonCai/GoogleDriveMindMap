import { Router } from 'express';
import type { ApiResponse, DriveItem } from '@gdmm/shared';

export const itemsRouter = Router();

// Placeholder items — replace with real Google Drive API calls later
const SAMPLE_ITEMS: DriveItem[] = [
  {
    id: '1',
    name: 'My Drive',
    mimeType: 'application/vnd.google-apps.folder',
    parentId: null,
    modifiedTime: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Projects',
    mimeType: 'application/vnd.google-apps.folder',
    parentId: '1',
    modifiedTime: '2026-01-15T12:00:00.000Z',
  },
  {
    id: '3',
    name: 'README.md',
    mimeType: 'text/markdown',
    parentId: '2',
    modifiedTime: '2026-02-01T09:30:00.000Z',
  },
];

itemsRouter.get('/items', (_req, res) => {
  const payload: ApiResponse<DriveItem[]> = {
    data: SAMPLE_ITEMS,
    success: true,
  };
  res.json(payload);
});
