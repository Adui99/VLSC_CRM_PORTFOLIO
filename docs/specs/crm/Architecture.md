# ARCHITECTURE: System Architecture, Data Flow & DB Schema Specification - CRM Pipeline

> **Tài liệu Kiến trúc Hệ thống, Luồng Dữ liệu & Cơ sở Dữ liệu - Phân hệ CRM**  
> **Phiên bản**: 3.0.0 (Audited Source of Truth Edition)  
> **Mục tiêu**: Định nghĩa toàn bộ kiến trúc mô-đun CRM Pipeline, Hợp đồng API (API Contracts), Mô hình dữ liệu PostgreSQL ERD Schema, và Cơ chế Auto-Pruning Ring Buffer 1.000 bản ghi.

---

## 1. CRM Architecture Overview (Tổng quan Kiến trúc CRM)

```mermaid
graph TD
    subgraph Client Presentation Layer (CRM Shell & Views)
        LoginView[CrmLoginModal.tsx]
        SettingsView[CrmUserSettings.tsx]
        WorkspaceView[CrmLeadManager.tsx - Kanban Board & Table View]
        AnalyticsView[CrmExecutiveAnalytics.tsx - Super Admin Only]
        RbacView[CrmRbacManager.tsx]
        AuditView[CrmAuditLog.tsx]
        HeaderView[CrmHeader.tsx & Notification Bell Dropdown]
        SidebarView[CrmSidebar.tsx]
    end

    subgraph State Management & Persistence
        ZustandCRM[features/crm/store/useCrmStore.ts]
        LocalStoragePersist[LocalStorage: vlsc_crm_storage]
    end

    subgraph API Gateway & Service Layer (Server Side)
        AuthGuard[core/auth/auth.ts - Header-based Auth Guard]
        StateMachine[features/crm/services/lead-state-machine.ts]
        ScoringEngine[features/crm/utils/calculateLeadScore.ts]
        LeadsRoute[app/api/crm/leads/route.ts]
        StaffRoute[app/api/crm/staff/route.ts]
        PermsRoute[app/api/crm/permissions/route.ts]
        AuditRoute[app/api/crm/audit-logs/route.ts]
    end

    subgraph PostgreSQL Database (Authoritative Source of Truth)
        LeadsTable[(leads Table)]
        NotesTable[(lead_notes Table)]
        StaffTable[(staff_members Table)]
        PermsTable[(permissions Table)]
        AuditTable[(crm_audit_logs Table - Ring Buffer Max 1000)]
    end

    LoginView --> ZustandCRM
    SettingsView --> ZustandCRM
    WorkspaceView --> ZustandCRM
    AnalyticsView --> ZustandCRM
    RbacView --> ZustandCRM
    AuditView --> ZustandCRM

    ZustandCRM <--> LocalStoragePersist
    ZustandCRM -->|REST API Calls| LeadsRoute
    ZustandCRM -->|REST API Calls| StaffRoute
    ZustandCRM -->|REST API Calls| PermsRoute
    ZustandCRM -->|REST API Calls| AuditRoute

    LeadsRoute --> AuthGuard
    LeadsRoute --> StateMachine
    LeadsRoute --> ScoringEngine
    LeadsRoute --> LeadsTable
    LeadsRoute --> NotesTable

    StaffRoute --> AuthGuard
    StaffRoute --> StaffTable

    PermsRoute --> AuthGuard
    PermsRoute --> PermsTable

    AuditRoute --> AuthGuard
    AuditRoute --> AuditTable
```

---

## 2. Directory Structure & Module Breakdown (Cấu trúc Mô-đun CRM)

```text
src/
├── app/
│   ├── admin/crm/page.tsx      # Main CRM Route (/admin/crm)
│   └── api/crm/                # Serverless API Handlers
│       ├── audit-logs/route.ts # Audit Log API (GET, POST, DELETE ring buffer)
│       ├── leads/route.ts      # Lead API (GET, POST, PATCH, DELETE)
│       ├── permissions/route.ts# RBAC API (GET, POST)
│       └── staff/route.ts      # Staff Management API (GET, POST, PATCH, DELETE)
├── core/
│   ├── auth/auth.ts            # Server-side Header Auth Guard Validation
│   └── db/db.ts                # Database Connection Abstraction (PostgreSQL)
└── features/
    └── crm/                    # CRM Domain Feature Module
        ├── components/         # 10 CRM Components
        │   ├── CrmAuditLog.tsx
        │   ├── CrmExecutiveAnalytics.tsx
        │   ├── CrmHeader.tsx
        │   ├── CrmKpiStats.tsx
        │   ├── CrmLeadDetailModal.tsx
        │   ├── CrmLeadManager.tsx
        │   ├── CrmLoginModal.tsx
        │   ├── CrmRbacManager.tsx
        │   ├── CrmSidebar.tsx
        │   └── CrmUserSettings.tsx
        ├── services/           # Business Services & Tests
        │   ├── audit-log.test.ts
        │   ├── lead-state-machine.test.ts
        │   └── lead-state-machine.ts
        ├── store/
        │   └── useCrmStore.ts  # Zustand Global Store with persist
        ├── types/
        │   └── crm.ts          # Core TypeScript Interfaces & Types
        └── utils/              # Math & Scoring Helpers & Tests
            ├── analytics-math.test.ts
            └── calculateLeadScore.ts
```

---

## 3. Database Schema & ERD Specifications (Thiết kế Cơ sở Dữ liệu PostgreSQL)

### A. Bảng `leads` (Thông tin Lead)
```sql
CREATE TABLE IF NOT EXISTS leads (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  deal_value NUMERIC(15, 2) NOT NULL DEFAULT 0,
  source VARCHAR(100) NOT NULL DEFAULT 'Website',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_to VARCHAR(255)
);
```

### B. Bảng `lead_notes` (Ghi chú & System Audit Notes)
```sql
CREATE TABLE IF NOT EXISTS lead_notes (
  id VARCHAR(255) PRIMARY KEY,
  lead_id VARCHAR(255) NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### C. Bảng `staff_members` (Danh sách Nhân sự)
```sql
CREATE TABLE IF NOT EXISTS staff_members (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'sales_rep',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  avatar TEXT,
  joined_date DATE NOT NULL DEFAULT CURRENT_DATE
);
```

### D. Bảng `permissions` (Ma trận Phân quyền RBAC)
```sql
CREATE TABLE IF NOT EXISTS permissions (
  role VARCHAR(50) NOT NULL,
  permission_key VARCHAR(100) NOT NULL,
  permission_value BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (role, permission_key)
);
```

### E. Bảng `crm_audit_logs` (Nhật ký Hoạt động - Ring Buffer Max 1000)
```sql
CREATE TABLE IF NOT EXISTS crm_audit_logs (
  id VARCHAR(255) PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  performed_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 4. Auto-Pruning Ring Buffer Architecture (Cơ chế Ring Buffer 1.000 bản ghi)

API Route `/api/crm/audit-logs` thực thi cơ chế **Auto-Pruning Ring Buffer** mỗi khi có thao tác chèn log mới (`POST`):

```sql
INSERT INTO crm_audit_logs (id, action, description, performed_by, created_at)
VALUES ($1, $2, $3, $4, $5);

DELETE FROM crm_audit_logs 
WHERE id NOT IN (
  SELECT id FROM crm_audit_logs 
  ORDER BY created_at DESC 
  LIMIT 1000
);
```

- Kích thước 1.000 bản ghi Audit Log chiếm $\approx 300\text{KB}$ dung lượng DB, giữ hiệu năng câu lệnh `SELECT` luôn $< 10\text{ms}$.

---

## 5. Dual-Source Lead Ingestion & API Boundary Contracts

System tiếp nhận Lead từ **2 Nguồn (Dual-Source Ingestion)**:
1. **Inbound Source**: Khách hàng nộp form từ Public Landing Page Modal (`source: "Website"`).
2. **Internal Source**: Nhân sự khởi tạo Lead thủ công trực tiếp từ giao diện CRM (`source: "Referral" / "Manual" / "Event"`).

### API Endpoints
- `GET /api/crm/leads` $\rightarrow$ Trả về `{ success: true, leads: Lead[] }` (JOIN `lead_notes` tự động).
- `POST /api/crm/leads` $\rightarrow$ Tạo Lead mới từ 1 trong 2 nguồn.
- `PATCH /api/crm/leads` $\rightarrow$ Thao tác `update_status` (Kiểm định qua State Machine) hoặc `add_note`.
- `GET/POST/PATCH/DELETE /api/crm/staff` $\rightarrow$ Quản lý nhân sự & profile.
- `GET/POST/DELETE /api/crm/audit-logs` $\rightarrow$ Nhật ký hoạt động & Ring Buffer Auto-Pruning.
