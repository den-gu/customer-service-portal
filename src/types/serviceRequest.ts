export type ServiceRequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type ServiceRequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  requesterName: string;
  requesterEmail: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface CreateServiceRequestPayload {
  title: string;
  description: string;
  category: string;
  priority: ServiceRequestPriority;
  requesterName: string;
  requesterEmail: string;
}

export interface UpdateServiceRequestStatusPayload {
  status: ServiceRequestStatus;
  version: number;
  note?: string;
}

export interface ServiceRequestPage {
  items: ServiceRequest[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  traceId?: string;
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors: Record<string, string[]>;
}