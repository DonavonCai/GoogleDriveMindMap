import { Router } from 'express';
import type { ApiResponse, HealthCheckResponse } from '@gdmm/shared';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  const payload: ApiResponse<HealthCheckResponse> = {
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
    success: true,
  };
  res.json(payload);
});
