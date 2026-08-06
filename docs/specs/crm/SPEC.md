# SPEC: Functional Requirements & Behavioral Specification - Internal CRM System

> **Tài liệu Đặc tả Chức năng & Hành vi - Phân hệ CRM**  
> **Phiên bản**: 3.0.0 (Audited Source of Truth Edition)  
> **Mục tiêu**: Định nghĩa toàn bộ yêu cầu chức năng, kịch bản kiểm thử (Acceptance Criteria), quy tắc dữ liệu và xử lý ngoại lệ cho Phân hệ Quản trị CRM Pipeline.

---

## 1. Functional Requirements (Yêu cầu Chức năng CRM)

### F2: Lead Auto-Scoring Engine (Ma trận Chấm điểm 100 điểm)
- **Mô tả**: Mọi Lead tiếp nhận (từ Landing Page Inbound hoặc tạo thủ công tại CRM) đều đi qua Scoring Engine (`calculateLeadScore.ts`) để tính toán điểm số từ 0 đến 100 và gán nhãn Phân loại (`hot`, `warm`, `cold`) trên RAM.
- **Ma trận Cộng điểm (11 Tiêu chí)**:
  1. **Họ tên**: $+5$ điểm nếu có nhập.
  2. **Loại Email**: Corporate Email VÀ domain là Corporate Domain ($+15$), Corporate Email HOẶC domain là Corporate Domain ($+10$), Email cá nhân ($+5$).
  3. **Số điện thoại**: $+15$ điểm nếu độ dài $\ge 8$ ký tự.
  4. **Tên Doanh nghiệp**: $+15$ điểm nếu có nhập.
  5. **Quy mô Doanh nghiệp**: `50+` ($+15$), `11-50` ($+10$), `1-10` ($+5$).
  6. **Chức vụ (Role)**: CEO/Founder/Director ($+20$), Manager ($+15$), Khác ($+5$).
  7. **Số lượng Dịch vụ quan tâm**: $\ge 4$ dịch vụ ($+15$), $\ge 2$ dịch vụ ($+10$), $1$ dịch vụ ($+5$).
  8. **Ý định & Mức độ Khẩn cấp trong Lời nhắn**: Chứa từ khóa khẩn cấp ($+15$), Lời nhắn chi tiết $>15$ ký tự ($+5$).
  9. **Giá trị Deal (Deal Value)**: $\ge \$50,000$ ($+20$), $\$20,000 - \$50,000$ ($+10$), $<\$20,000$ ($+5$).
  10. **Nguồn Lead (Lead Source)**: Referral/Giới thiệu/Cold Email ($+15$), Event/Social ($+10$), Website/Landing ($+5$).
  11. **Thưởng Deal Doanh nghiệp lớn (Enterprise Bonus)**: Corporate Domain $+$ Deal Value $\ge \$50,000$ ($+10$ điểm thưởng).
- **Quy tắc An toàn (Score Caps)**: Email cá nhân (`personal`) KHÔNG có Tên Doanh nghiệp bị chặn điểm tối đa ở `75` (tránh báo động giả).
- **Phân loại**: $\ge 80$ điểm: **HOT** (`hot` 🔥), $50 - 79$ điểm: **WARM** (`warm` ☀️), $< 50$ điểm: **COLD** (`cold` ❄️).

---

### F3: Pipeline Workspace (Kanban Board & Table View)
- **Mô tả**: Không gian làm việc cho Sales & Manager quản lý danh sách Lead.
- **Tính năng**: Chuyển đổi Kanban/Table, Kéo-Thả đổi trạng thái, Kéo-Thả sắp xếp thứ tự trong cột (Within-Column Drag Reordering - Update `orderIndex`), Bộ lọc đa tiêu chí (Search, Status, Source).

---

### F4: Sales Funnel State Machine & Notification Center
- **Luồng Trạng thái Chuẩn**: `new` $\rightarrow$ `contacted` $\rightarrow$ `in_negotiation` $\rightarrow$ `closed_won` hoặc `closed_lost`.
- **Quy tắc Quyền hạn Override**: Sales Rep bị khóa khi ở `closed_won`/`closed_lost`. CRM Manager / Super Admin có quyền mở lại (Re-open).
- **Tự động Ghi vết**: Chèn Note với tiền tố `[System Audit Trail]` ghi nhận trạng thái cũ, mới và người thực hiện.
- **Trung tâm Thông báo (Notification Center)**: Cảnh báo chuông thời gian thực khi có HOT Lead, cho phép `dismissNotification(id)` và `clearAllNotifications()`.

---

### F5: Team & RBAC Management Matrix, Staff Login & Profile Settings
- **F5.1 Staff Profile Self-Update (`CrmUserSettings.tsx`)**: Cho phép nhân sự chọn trong 6 preset avatar có sẵn hoặc nhập URL ảnh tùy chỉnh, đổi Email và Password. Thuộc tính Full Name bị khóa (System Field Read-only).
- **F5.2 Staff Login Modal (`CrmLoginModal.tsx`)**: Màn hình đăng nhập xác thực nhân sự qua Email. Kiểm tra danh sách `staffMembers` có trạng thái `active`. Nếu không hợp lệ $\rightarrow$ Trả về thông báo "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa".
- **F5.3 Ma trận Phân quyền Mặc định (Default RBAC Matrix)**: Phân quyền 7 hành vi thao tác theo 3 vai trò (`super_admin`, `crm_manager`, `sales_rep`).

---

### F6: Audit Log System & Auto-Pruning Ring Buffer
- Cơ chế **Auto-Pruning Ring Buffer 1.000 Bản ghi**: Tự động chạy câu lệnh SQL xóa bản ghi cũ vượt quá 1.000 bản ghi mới nhất. Hỗ trợ Super Admin dọn dẹp thủ công (`DELETE /api/crm/audit-logs?days=30`) và xuất CSV.

---

### F7: Executive Analytics Engine
- Dành riêng cho Super Admin (`super_admin`), gồm 5 Dashboard: Revenue Target & Forecast, Channel Performance & Velocity, Lead Score Donut Chart, Service Scope Bar Chart, và **Digital Conversion Rate & Realized Profit Cash Flow Matrix** ($CR = \frac{\text{Closed Won}}{\text{Total Leads}} \times 100\%$, Lợi nhuận gộp $= Revenue \times 35\%$).

---

## 2. User Stories & Acceptance Criteria (Dạng Given / When / Then)

### US-01: Staff Login & Profile Customization
```gherkin
Scenario: Đăng nhập Nhân sự thành công qua CrmLoginModal
  Given Nhân sự đang ở màn hình CrmLoginModal với email "admin@company.com"
  When Nhân sự nhấn "Đăng Nhập Hệ Thống"
  Then Hệ thống đối soát email hợp lệ với danh sách staffMembers active
  And Đăng nhập thành công, lưu thông tin vào currentUser và mở giao diện CRM Workspace
```

```gherkin
Scenario: Chọn Avatar từ Preset và Cập nhật Hồ sơ tại CrmUserSettings
  Given Nhân sự đang ở trang "Account & Profile Settings"
  When Nhân sự click chọn Preset Avatar số 2 và nhấn "Save Profile Changes"
  Then Ảnh Avatar cá nhân được cập nhật thành URL mới
  And Lệnh API PATCH /api/crm/staff đồng bộ thông tin thành công
```

```gherkin
Scenario: Nhập Mật khẩu không trùng khớp tại CrmUserSettings
  Given Nhân sự đang ở trang "Account & Profile Settings"
  When Nhân sự nhập Password "123456" nhưng Confirm Password "1234567"
  Then Hệ thống từ chối lưu và hiển thị thông báo lỗi "New Password and Confirm Password do not match. Please verify."
```

### US-02: State Machine Validation & Role Enforcement
```gherkin
Scenario: Sales Rep cố gắng Re-open Deal đã Closed Won
  Given Nhân sự đăng nhập vai trò "sales_rep"
  When Sales Rep thực hiện kéo thẻ Lead từ "closed_won" về "in_negotiation"
  Then API PATCH /api/crm/leads trả về lỗi HTTP 400 Bad Request
  And Frontend hiển thị Toast thông báo từ chối và đưa thẻ về vị trí cũ
```

---

## 3. Edge Cases & Error Handling (Trường hợp Biên & Xử lý Lỗi)

| Mã lỗi / Tình huống | Nguyên nhân | Hành vi Xử lý của Hệ thống |
| :--- | :--- | :--- |
| **Password Mismatch** | Mật khẩu xác nhận không khớp trong `CrmUserSettings`. | Chặn gửi Form và hiển thị thông báo lỗi cảnh báo màu đỏ. |
| **Inactive Staff Login** | Nhân sự đã bị khóa tài khoản cố gắng đăng nhập. | Hàm `login()` trả về `false`, hiển thị thông báo "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa". |
| **HTTP 400 Bad Request** | Cố tình chuyển trạng thái Lead sai State Machine quy định. | Trả về lỗi JSON `{ success: false, error: "Invalid status transition" }`. Frontend hiển thị toast và khôi phục vị trí thẻ cũ. |
| **HTTP 403 Forbidden** | User role `sales_rep` cố truy cập `/admin/crm` Analytics. | API từ chối xử lý, trả về `{ success: false, error: "Unauthorized role access" }`. Frontend điều hướng về màn hình Workspace mặc định. |
| **Audit Log Cap Exceeded** | Số lượng bản ghi Audit Log vượt quá 1.000. | SQL Subquery Auto-Pruning tự động thực thi xóa bản ghi cũ nhất, duy trì chính xác 1.000 bản ghi mới nhất. |
| **Zero Inbound Leads** | Hệ thống mới khởi tạo chưa có Lead nào. | Công thức $DCR$ trả về `0.0%` thay vì lỗi `NaN` hay `Infinity`. |
