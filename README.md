# Customer Service Portal

A modern web application for managing, viewing, and updating service requests. This project was designed with a focus on strict type safety, concurrency protection, and an optimized user experience.

---

## Architectural Overview and Design Decisions

The application follows a clean Separation of Concerns through distinct architectural layers:

1. **Presentation Layer (UI):** Built with React 18+, TypeScript, Tailwind CSS, and accessible UI components based on shadcn/ui and Base UI primitives.
2. **Form State Management:** Complex form state is decoupled using React Hook Form paired with Zod for runtime schema validation.
3. **Server State Management & API Mocking:** Asynchronous state, caching, cache invalidation, and mutation handling are managed via TanStack Query (React Query), backed by Mock Service Worker (MSW) for seamless network-level REST API simulation.
4. **API Client & Networking Layer:** API calls are structured using an Axios client instance, providing centralized request/response handling and unified error normalization.

---

## API Integration & Mocking Strategy

### 1. Mock Service Worker (MSW)

Rather than mocking API calls in memory or replacing global fetch methods, the application leverages **MSW** to intercept network requests at the Service Worker level:

- **OAS3 Contract Fidelity:** MSW intercepts outgoing network traffic and matches OpenAPI 3.0 route paths (e.g., `/requests/{id}`, `/requests/{id}/status`).
- **Realistic Network Simulation:** Simulates realistic network latencies, random/edge-case errors, and accurate status codes (`200 OK`, `404 Not Found`, `409 Conflict`).
- **Seamless Transition to Production:** Switching from the mock layer to a live production backend requires zero code changes in application components—only updating the `API_BASE_URL` environment variable.

### 2. Axios Client Configuration

HTTP interactions are encapsulated within a dedicated Axios instance (`src/lib/apiClient.ts`):

- **Base Configuration:** Centralizes host base URLs, default timeout thresholds, and required JSON headers.
- **Error Normalization:** Axios interceptors capture network, validation, and HTTP error payloads, normalizing them into predictable domain exception objects before reaching the UI layer.

---

## Security Architecture & Best Practices

Security is integrated at both the application and network communication layers:

1. Input Validation & Injection Protection
   - Runtime Schema Validation: All form payloads and API parameters are validated using Zod schemas before being dispatched to the server, preventing malformed inputs and data pollution.
   - XSS Mitigation: React's automatic JSX escaping combined with strict input sanitization prevents Cross-Site Scripting (XSS) attacks.

2. Authentication & Access Control
   - Route Protection: Protected views require valid session credentials managed via OpenID Connect (OIDC) / OAuth2 authentication flows.
   - Access Restriction Fallbacks: Unauthenticated users attempting to access restricted resources are intercepted and redirected to explicit authentication prompts.

3. Concurrency & Data Integrity
   - Version-Based Race Condition Prevention: Mutating request statuses requires passing the current client-side version token. If a concurrent modification occurs on the backend, the mutation is rejected with a 409 Conflict status code to prevent data corruption ("lost updates").

4. Secrets & Environment Management
   - Zero Credential Exposure: All sensitive API endpoints, client secrets, and third-party keys are isolated in environment variables (`.env.example` provided) and excluded from version control via `.gitignore`.

---

## OpenAPI 3.0 (OAS3) Mapping and Compliance

The application structure directly maps to the OpenAPI 3.0 specification contracts:

### 1. Data Schema Mapping

- **ServiceRequest:** Fully defined in `src/types/serviceRequest.ts`. It contains all required properties: `id`, `title`, `description`, `status`, `category`, `priority`, `requesterName`, `requesterEmail`, `version`, `createdAt`, and `updatedAt`.
- **ServiceRequestStatus:** Strict enum consisting of `'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'`.

### 2. Endpoints and Request/Response Handling

- **GET /requests/{id}**:
  - **200 OK:** Returns the full `ServiceRequest` object.
  - **404 Not Found:** Handled in the view layer with an intuitive fallback UI and navigation back to the main request list.
- **PATCH /requests/{id}/status**:
  - **Request Body:** Validated via the Zod schema (`updateStatusSchema`).
  - **200 OK:** Returns the updated `ServiceRequest` containing an incremented `version` counter.
  - **409 Conflict:** Handled by transmitting the current client-side `version` to prevent lost updates caused by concurrent edits.

---

## Concurrency Control and Business Rules

### 1. Optimistic Concurrency Control

To prevent data overwrite when multiple operators inspect or edit the same request simultaneously:

- Every request record includes a numeric `version` field.
- Submitting a status update (`PATCH`) sends the current local `version` in the payload.
- If the version on the backend is higher than the client version, the update is rejected, and an error message prompts the user to refresh their view.

### 2. Finite State Machine and Allowed Transitions

State transitions inside the `UpdateStatusSection` enforce the required business logic lifecycle:

| Current Status  | Allowed Target Statuses |
| :-------------- | :---------------------- |
| **OPEN**        | `IN_PROGRESS`, `CLOSED` |
| **IN_PROGRESS** | `RESOLVED`, `OPEN`      |
| **RESOLVED**    | `CLOSED`, `IN_PROGRESS` |
| **CLOSED**      | _None (Terminal State)_ |

If a request reaches the **CLOSED** status, the update form is automatically disabled.

---

## Tech Stack

- **Core:** React, TypeScript, Vite
- **Styling & Motion:** Tailwind CSS, Framer Motion
- **UI Components:** Base UI / shadcn/ui, Hugeicons React
- **Forms & Validation:** React Hook Form, Zod, `@hookform/resolvers`
- **Networking & State:** Axios, MSW (Mock Service Worker), TanStack React Query
- **Testing & CI/CD:** Vitest, React Testing Library, GitHub Actions

---

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- Package manager (`npm`, `yarn`, or `bun`)

### Installation & Execution

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/den-gu/customer-service-portal.git](https://github.com/den-gu/customer-service-portal.git)
   cd customer-service-portal

   ```

2. **Install dependencies:**
   npm install

3. **Build for production:**
   npm run dev

4. **Install dependencies:**
   npm run build

---

## Testing Strategy

The application adopts a pyramid testing strategy to ensure high reliability across unit, integration, and component levels:

1. Component & Integration Testing (Vitest & React Testing Library)
   - Verifies component rendering, user interactions, and state transitions in isolation.
   - Tests mock server responses via MSW during integration flows to validate end-to-end data fetching and form mutations without calling real network endpoints.

2. Static Analysis & Type Checking
   - TypeScript Strict Mode: Enforces strict type compliance (`noImplicitAny`, `strictNullChecks`) across all source files.
   - ESLint Analysis: Ensures code quality and enforces React Best Practices, Hooks rules, and React Refresh compliance.

3. Executing Tests
   - Run unit/integration tests: `npm run test`
   - Run tests with coverage: `npm run coverage`
   - Run static analysis: `npm run lint`

---

## CI/CD Pipeline: GitHub Actions Workflow Description

Continuous Integration is powered by GitHub Actions through the `.github/workflows/build-and-test.yml` workflow. On every push or pull request to the `main` branch, the automated pipeline executes the following stages:

1. Environment Provisioning: Spins up an `ubuntu-latest` runner configured with the Node.js 22 LTS runtime and caching enabled for package dependencies.
2. Dependency Installation: Runs `npm ci` for fast, deterministic, and reproducible dependency resolution.
3. Code Linting & Static Inspection: Executes `npm run lint` to enforce formatting, code style rules, and React/TypeScript best practices.
4. Type Safety Verification: Invokes `npx tsc --noEmit` to validate complete TypeScript compilation without producing build artifacts.
5. Unit & Integration Test Suite: Runs `npm run test` using Vitest to ensure all tests pass cleanly.
6. Production Build Construction: Executes `npm run build` to verify that Vite bundles production assets without bundling errors or missing dependencies.

---

## Security & Accessibility Considerations

### 1. Security Architecture

- Input Sanitization & Injection Protection: All inputs undergo runtime schema validation via Zod, eliminating malicious payloads before they hit business logic.
- Cross-Site Scripting (XSS) Mitigation: Relies on React's built-in JSX auto-escaping alongside strict input handling.
- Optimistic Concurrency Protection: Uses version tokens in request updates to prevent race conditions and unintentional overwrites ("lost updates").
- Zero Credential Exposure: Environment variables are strictly managed via `.env` files and excluded from Git version control.

### 2. Accessibility (a11y)

- Accessible UI Primitives: Components are built on top of Radix/Base UI primitives, ensuring native keyboard navigation support, focus management, and compliance with WAI-ARIA guidelines.
- Screen Reader Support: Form fields, dialogs, and alert banners include explicit ARIA roles (`aria-live`, `aria-describedby`, `aria-invalid`) to inform screen readers of state updates and validation errors.
- Color Contrast & Focus Indicators: Tailored with high-contrast color palettes and prominent focus rings (`focus-visible`) for enhanced visual navigation.

---

## Known Limitations

- In-Memory MSW Persistence: Since MSW simulates API interactions client-side, state mutations (such as updating a request status) are persisted in browser memory. Refreshing the browser page resets the mock dataset to its initial state.
- Real-Time Updates: The current implementation relies on on-demand queries and manual refetching rather than WebSockets or Server-Sent Events (SSE) for live multi-user streaming.
- Single Role Access: The application does not currently feature granular role-based access control (RBAC) screens (e.g., distinguishing between end-user requesters and admin agents in the same interface).

---
