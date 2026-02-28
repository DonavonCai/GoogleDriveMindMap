// Shared types used by both client and server

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface HealthCheckResponse {
  status: 'ok';
  timestamp: string;
}

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  parentId: string | null;
  modifiedTime: string;
}
