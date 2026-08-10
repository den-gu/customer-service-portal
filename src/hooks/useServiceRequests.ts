import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  serviceRequestsApi,
  type GetRequestsParams,
} from '../api/serviceRequestsApi';
import type {
  CreateServiceRequestPayload,
  UpdateServiceRequestStatusPayload,
} from '../types/serviceRequest';

// Key Factory para organizar a cache do Tanstack
export const requestKeys = {
  all: ['service-requests'] as const,
  lists: () => [...requestKeys.all, 'list'] as const,
  list: (params: GetRequestsParams) => [...requestKeys.lists(), params] as const,
  details: () => [...requestKeys.all, 'detail'] as const,
  detail: (id: string) => [...requestKeys.details(), id] as const,
};

// Hook para procurar a lista de solicitações
export function useServiceRequests(params: GetRequestsParams) {
  return useQuery({
    queryKey: requestKeys.list(params),
    queryFn: () => serviceRequestsApi.getRequests(params),
  });
}

// Hook para consultar os detalhes de uma solicitação
export function useServiceRequestDetail(requestId: string) {
  return useQuery({
    queryKey: requestKeys.detail(requestId),
    queryFn: () => serviceRequestsApi.getRequestById(requestId),
    enabled: Boolean(requestId),
  });
}

// Hook para criar nova solicitação
export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServiceRequestPayload) =>
      serviceRequestsApi.createRequest(payload),
    onSuccess: () => {
      // Invalida a lista para forçar o recarregamento com a nova solicitação
      void queryClient.invalidateQueries({ queryKey: requestKeys.lists() });
    },
  });
}

// Hook para actualizar o status
export function useUpdateServiceRequestStatus(requestId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateServiceRequestStatusPayload) =>
      serviceRequestsApi.updateRequestStatus(requestId, payload),
    onSuccess: (updatedItem) => {
      // Actualiza a cache do detalhe e invalida as listas
      queryClient.setQueryData(requestKeys.detail(requestId), updatedItem);
      void queryClient.invalidateQueries({ queryKey: requestKeys.lists() });
    },
  });
}