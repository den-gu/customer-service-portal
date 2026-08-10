import { http, HttpResponse } from 'msw';
import type {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceRequestPriority,
  CreateServiceRequestPayload,
  UpdateServiceRequestStatusPayload,
  ProblemDetails,
  ValidationProblemDetails,
} from '../types/serviceRequest';

let nextId = 1003;

// Base de dados simulada em memória com os exemplos do OAS3
const mockRequests: ServiceRequest[] = [
  {
    id: 'REQ-1001',
    title: 'Unable to access customer portal',
    description: 'The customer receives "Account locked" after signing in with valid credentials.',
    category: 'Access',
    priority: 'HIGH',
    status: 'OPEN',
    requesterName: 'Example Customer',
    requesterEmail: 'customer@example.com',
    createdAt: '2026-02-10T08:15:00Z',
    updatedAt: '2026-02-10T08:15:00Z',
    version: 1,
  },
  {
    id: 'REQ-1002',
    title: 'Duplicate invoice on February statement',
    description: 'Invoice INV-88213 appears twice on the February billing statement.',
    category: 'Billing',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    requesterName: 'Second Customer',
    requesterEmail: 'second.customer@example.com',
    createdAt: '2026-02-09T13:42:11Z',
    updatedAt: '2026-02-11T09:05:30Z',
    version: 4,
  },
];

// Regras de transição de estado definidas no OAS3
const ALLOWED_TRANSITIONS: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
  OPEN: ['IN_PROGRESS', 'CLOSED'],
  IN_PROGRESS: ['RESOLVED', 'OPEN'],
  RESOLVED: ['CLOSED', 'IN_PROGRESS'],
  CLOSED: [], // Estado terminal
};

export const handlers = [
  // GET /requests
  http.get('/requests', ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get('search')?.toLowerCase();
    const status = url.searchParams.get('status') as ServiceRequestStatus | null;
    const priority = url.searchParams.get('priority') as ServiceRequestPriority | null;
    const sort = url.searchParams.get('sort') || '-createdAt';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    let filtered = [...mockRequests];

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.requesterName.toLowerCase().includes(search)
      );
    }

    if (status) filtered = filtered.filter((r) => r.status === status);
    if (priority) filtered = filtered.filter((r) => r.priority === priority);

    // Ordenação
    const isDesc = sort.startsWith('-');
    const field = (isDesc ? sort.slice(1) : sort) as 'createdAt' | 'updatedAt' | 'priority';

    filtered.sort((a, b) => {
      const valA = a[field] || '';
      const valB = b[field] || '';
      return isDesc
        ? String(valB).localeCompare(String(valA))
        : String(valA).localeCompare(String(valB));
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 0;
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    return HttpResponse.json({
      items,
      page,
      pageSize,
      total,
      totalPages,
    });
  }),

  // GET /requests/:requestId
  http.get('/requests/:requestId', ({ params }) => {
    const { requestId } = params;
    const item = mockRequests.find((r) => r.id === requestId);

    if (!item) {
      const problem: ProblemDetails = {
        title: 'Service request not found',
        status: 404,
        detail: `No service request exists with id ${requestId}.`,
        instance: `/requests/${requestId}`,
      };
      return HttpResponse.json(problem, { status: 404 });
    }

    return HttpResponse.json(item);
  }),

  // POST /requests
  http.post('/requests', async ({ request }) => {
    const body = (await request.json()) as CreateServiceRequestPayload;

    const newRequest: ServiceRequest = {
      ...body,
      id: `REQ-${nextId++}`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    mockRequests.unshift(newRequest);
    return HttpResponse.json(newRequest, {
      status: 201,
      headers: { Location: `/requests/${newRequest.id}` },
    });
  }),

  // PATCH /requests/:requestId/status
  http.patch('/requests/:requestId/status', async ({ params, request }) => {
    const { requestId } = params;
    const { status, version } = (await request.json()) as UpdateServiceRequestStatusPayload;

    const reqIndex = mockRequests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) {
      const problem: ProblemDetails = {
        title: 'Service request not found',
        status: 404,
        detail: `No service request exists with id ${requestId}.`,
      };
      return HttpResponse.json(problem, { status: 404 });
    }

    const currentReq = mockRequests[reqIndex];

    // Concorrência Otimista (Version Check)
    if (currentReq.version !== version) {
      const problem: ProblemDetails = {
        type: 'https://api.example.test/problems/version-conflict',
        title: 'Update conflict',
        status: 409,
        detail: 'The request was updated by someone else. Refresh and try again.',
        instance: `/requests/${requestId}/status`,
      };
      return HttpResponse.json(problem, { status: 409 });
    }

    // Validação de Transição Permitida
    const allowed = ALLOWED_TRANSITIONS[currentReq.status];
    if (!allowed.includes(status)) {
      const problem: ValidationProblemDetails = {
        type: 'https://api.example.test/problems/validation-error',
        title: 'Invalid status transition',
        status: 422,
        detail: `Transition from ${currentReq.status} to ${status} is not allowed.`,
        instance: `/requests/${requestId}/status`,
        errors: {
          status: [`Transition from ${currentReq.status} to ${status} is not allowed.`],
        },
      };
      return HttpResponse.json(problem, { status: 422 });
    }

    // Actualização com incremento de versão
    const updatedReq: ServiceRequest = {
      ...currentReq,
      status,
      version: currentReq.version + 1,
      updatedAt: new Date().toISOString(),
    };

    mockRequests[reqIndex] = updatedReq;
    return HttpResponse.json(updatedReq);
  }),
];