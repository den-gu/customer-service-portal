# Customer Service Portal

A modern web application for managing, viewing, and updating service requests. This project was designed with a focus on strict type safety, concurrency protection, and an optimized user experience.

---

## Architectural Overview and Design Decisions

The application follows a clean Separation of Concerns through distinct architectural layers:

1. **Presentation Layer (UI):** Built with React 18+, TypeScript, Tailwind CSS, and accessible UI components based on shadcn/ui and Base UI primitives.
2. **Form State Management:** Complex form state is decoupled using React Hook Form paired with Zod for runtime schema validation.
3. **Server State Management:** Asynchronous state, caching, cache invalidation, and mutation handling are managed via TanStack Query (React Query).

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
- **Data Fetching:** TanStack React Query

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
