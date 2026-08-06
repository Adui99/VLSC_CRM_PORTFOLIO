# RULE: Engineering Standards, Security & AI Governance Rules - Internal CRM System

> **Tài liệu Quy chuẩn Kỹ thuật, An ninh & Quản trị AI - Phân hệ CRM**  
> **Phiên bản**: 3.0.0 (Audited Source of Truth Edition)  
> **Mục tiêu**: Thiết lập các quy tắc bắt buộc về lập trình, kiểm thử (TDD), bảo mật dữ liệu, phân quyền RBAC và quy trình phát triển cho các kỹ sư và trợ lý AI khi làm việc trên CRM.

---

## 1. Coding & Engineering Conventions

1. **TypeScript Strict Mode**:
   - Nghiêm cấm sử dụng kiểu `any`. Mọi dữ liệu phải khai báo Interface/Type rõ ràng trong `@/features/crm/types/crm.ts`.
   - Tất cả tham số hàm và dữ liệu phản hồi API phải được định kiểu tường minh.
2. **Quy tắc Đặt tên (Naming Rules)**:
   - Components CRM: PascalCase (Ví dụ: `CrmLeadManager.tsx`, `CrmExecutiveAnalytics.tsx`, `CrmUserSettings.tsx`).
   - Store / Hooks: camelCase bắt đầu bằng `use` (`useCrmStore.ts`).
   - Utilities / Service Logic: camelCase (`calculateLeadScore.ts`, `lead-state-machine.ts`).
   - Constant Rules: UPPER_SNAKE_CASE (`ALLOWED_STATE_TRANSITIONS`, `PRESET_AVATARS`).
3. **Phân tách Trách nhiệm (Surgical Responsibility)**:
   - Các file Giao diện CRM (`.tsx`) chỉ chịu trách nhiệm Render và nhận sự kiện.
   - Logic nghiệp vụ (Chấm điểm Lead, Chuyển trạng thái State Machine, Tính toán Báo cáo) phải nằm tại tầng `utils/` hoặc `services/` để viết Unit Test độc lập.

---

## 2. Testing Rules & TDD Workflow (Quy tắc Kiểm thử & TDD)

1. **Nghiêm cấm Bỏ qua Test (No Bypassing Tests)**:
   - Mọi thay đổi logic tại `calculateLeadScore.ts`, `lead-state-machine.ts`, `analytics-math.ts`, hoặc `audit-logs/route.ts` bắt buộc phải cập nhật và pass 100% các file unit test tương ứng trong `src/features/crm/services/` và `utils/`.
2. **Quy tắc An toàn Toán học (Zero Division Protection)**:
   - Các hàm tính toán báo cáo (như Tỷ lệ chuyển đổi số $DCR$) bắt buộc phải có câu lệnh kiểm tra mẫu số $= 0$ để trả về `0.0%` an toàn thay vì gây ra lỗi `NaN` hay `Infinity`.
3. **Lệnh Chạy Suite Test Bắt buộc**:
   ```bash
   npx tsx --test src/features/crm/utils/calculateLeadScore.test.ts src/features/crm/services/lead-state-machine.test.ts src/features/crm/utils/analytics-math.test.ts src/features/crm/services/audit-log.test.ts
   ```
4. **Tiêu chuẩn Kiểm tra TypeScript**:
   - Bắt buộc chạy `npx tsc --noEmit` và không được có bất kỳ lỗi biên dịch nào (`0 errors`).

---

## 3. Security, Privacy & RBAC Rules (Quy tắc Bảo mật)

1. **Server-Side Authorization Enforcement**:
   - Không bao giờ tin tưởng Client State. Mọi API Route Handler (`/api/crm/*`) bắt buộc phải gọi `validateServerRole(req, allowedRoles)` ở đầu hàm xử lý.
2. **Phòng chống SQL Injection**:
   - Tất cả câu lệnh truy vấn CSDL phải sử dụng parameterized SQL template literals (Ví dụ: `sql`UPDATE leads SET status = ${status} WHERE id = ${leadId};``). Nghiêm cấm nối chuỗi SQL thủ công.
3. **Quy tắc Bảo mật Dữ liệu Nhạy cảm**:
   - Mật khẩu hoặc token không được trả về trong kết quả truy vấn `GET /api/crm/staff`.
   - Toàn bộ thông tin Audit Log nhạy cảm (như thay đổi quyền RBAC) chỉ được phép xóa bởi vai trò `super_admin`.

---

## 4. Rules for AI Agents Modifying or Rebuilding this Project

1. **Surgical Changes**: AI chỉ chỉnh sửa đúng vị trí mã nguồn phục vụ cho yêu cầu của người dùng, không làm hỏng logic State Machine hay Scoring Engine.
2. **Simplicity First**: Không thêm các lớp trừu tượng hóa phức tạp cho code dùng 1 lần.
3. **Keep Docs in Sync with Code**: Khi thay đổi logic CRM, AI có trách nhiệm cập nhật đồng bộ bộ tài liệu `docs/specs/crm/`.
