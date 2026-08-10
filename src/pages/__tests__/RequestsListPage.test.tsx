import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RequestsListPage } from '../RequestsListPage';

// Mock do hook de autenticação do OIDC
vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    user: { profile: { name: 'Engenheiro Teste', email: 'teste@exemplo.com' } },
    removeUser: vi.fn(),
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('RequestsListPage', () => {
  it('deve renderizar o cabeçalho e os filtros do portal', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RequestsListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Verifica se os elementos principais estão presentes no ecrã
    expect(screen.getByText(/Welcome to CSR - Portal!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by title or requester name/i)).toBeInTheDocument();
  });
});