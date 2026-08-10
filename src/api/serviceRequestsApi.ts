import { apiClient } from './client';
import type{
  ServiceRequest,
  ServiceRequestPage,
  ServiceRequestStatus,
  ServiceRequestPriority,
  CreateServiceRequestPayload,
  UpdateServiceRequestStatusPayload,
} from '../types/serviceRequest';

export interface GetRequestsParams {
  search?: string;
  status?: ServiceRequestStatus;
  priority?: ServiceRequestPriority;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export const serviceRequestsApi = {
  // GET /requests (Listagem com filtros, ordenação e paginação)
  getRequests: async (params: GetRequestsParams): Promise<ServiceRequestPage> => {
    const response = await apiClient.get<ServiceRequestPage>('/requests', { params });
    return response.data;
  },

  // GET /requests/:requestId (Detalhes)
  getRequestById: async (requestId: string): Promise<ServiceRequest> => {
    const response = await apiClient.get<ServiceRequest>(`/requests/${requestId}`);
    return response.data;
  },

  // POST /requests (Criar solicitação)
  createRequest: async (payload: CreateServiceRequestPayload): Promise<ServiceRequest> => {
    const response = await apiClient.post<ServiceRequest>('/requests', payload);
    return response.data;
  },

  // PATCH /requests/:requestId/status (Actualizar status com validação de versão)
  updateRequestStatus: async (
    requestId: string,
    payload: UpdateServiceRequestStatusPayload
  ): Promise<ServiceRequest> => {
    const response = await apiClient.patch<ServiceRequest>(
      `/requests/${requestId}/status`,
      payload
    );
    return response.data;
  },
};