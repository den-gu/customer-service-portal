import React from 'react';
import type { ServiceRequestStatus, ServiceRequestPriority } from '../types/serviceRequest';

export const StatusBadge: React.FC<{ status: ServiceRequestStatus }> = ({ status }) => {
  const styles: Record<ServiceRequestStatus, string> = {
    OPEN: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-200',
    RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CLOSED: 'bg-slate-200 text-slate-700 border-slate-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: ServiceRequestPriority }> = ({ priority }) => {
  const styles: Record<ServiceRequestPriority, string> = {
    LOW: 'bg-slate-100 text-slate-700',
    MEDIUM: 'bg-blue-50 text-blue-700',
    HIGH: 'bg-orange-100 text-orange-800 font-medium',
    CRITICAL: 'bg-rose-100 text-rose-800 font-bold animate-pulse',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs uppercase tracking-wider ${styles[priority]}`}>
      {priority}
    </span>
  );
};