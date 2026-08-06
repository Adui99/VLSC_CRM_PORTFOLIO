# 05 — Quy trình Làm việc & Timeline

## Quy trình chuẩn cho mỗi dự án

Mọi dự án đều trải qua **4 giai đoạn chính** theo thứ tự:

---

### Giai đoạn 1 — Tìm hiểu & Định hướng

**Mục tiêu**: Hiểu rõ nhu cầu, mục tiêu kinh doanh và đối tượng người dùng của khách hàng.

**Hoạt động**:
- Phỏng vấn khách hàng để nắm rõ yêu cầu
- Phân tích đối tượng khách hàng mục tiêu (Target Audience)
- Xác định mục tiêu đo lường thành công (KPIs)
- Thống nhất phạm vi dự án và deliverables

**Output**: Brief dự án và danh sách yêu cầu rõ ràng

---

### Giai đoạn 2 — Wireframing & Kiến trúc

**Mục tiêu**: Phác thảo cấu trúc thông tin và luồng người dùng trước khi thiết kế chi tiết.

**Hoạt động**:
- Vẽ wireframe thấp (low-fidelity) cho các màn hình chính
- Xác định cấu trúc điều hướng và user flow
- Phê duyệt với khách hàng trước khi tiến sang thiết kế

**Output**: Wireframe được khách hàng phê duyệt

---

### Giai đoạn 3 — UI Design cao cấp (Figma)

**Mục tiêu**: Thiết kế giao diện hoàn chỉnh, pixel-perfect với đầy đủ interactive prototype.

**Hoạt động**:
- Thiết kế high-fidelity UI trên Figma
- Xây dựng Design System (màu sắc, typography, components)
- Tạo interactive prototype để khách hàng trải nghiệm trước
- Feedback và chỉnh sửa theo yêu cầu

**Output**: Figma file hoàn chỉnh được phê duyệt

> **Lưu ý**: Nếu khách hàng đã có sẵn Figma file hoặc Brand Guidelines, có thể bỏ qua giai đoạn này và chuyển thẳng sang Giai đoạn 4.

---

### Giai đoạn 4 — Frontend Development & Launch

**Mục tiêu**: Chuyển đổi thiết kế thành code hoạt động, tối ưu hiệu năng và deploy.

**Hoạt động**:
- Phát triển với Next.js + Tailwind CSS + custom animations
- Tích hợp animation và 3D WebGL (nếu có trong scope)
- Kiểm thử hiệu năng (Lighthouse, FPS, CLS)
- Deploy lên Vercel hoặc infrastructure theo yêu cầu
- Bàn giao và hướng dẫn sử dụng

**Output**: Website live và tài liệu bàn giao

---

## Timeline ước tính

| Loại dự án | Thời gian |
|------------|-----------|
| Landing Page cơ bản | 2 – 3 tuần |
| Website phức tạp (nhiều section, animation) | 4 – 6 tuần |
| Web App tích hợp 3D WebGL hoặc animation nặng | 4 – 8 tuần |
| Tích hợp CRM & Automation | Tùy độ phức tạp, thường 4 – 8 tuần |
| Redesign & Tối ưu UI/UX | 3 – 5 tuần |

> **Lưu ý**: Timeline bắt đầu tính từ khi khách hàng **phê duyệt brief** và **cung cấp đầy đủ tài liệu cần thiết**.

---

## Điều khách hàng cần chuẩn bị

Để dự án tiến hành thuận lợi và đúng deadline, khách hàng nên chuẩn bị:

- **Tài liệu thương hiệu**: Logo, màu sắc, font chữ (nếu có)
- **Nội dung**: Văn bản, hình ảnh sản phẩm/dịch vụ
- **Tham khảo**: Các website/app mà khách hàng thích để định hướng phong cách
- **Người liên hệ chính**: 1 đầu mối phê duyệt từ phía khách hàng

---

## Cam kết chất lượng

- Tất cả dự án đều đạt **Lighthouse Performance ≥ 90**
- Animation chạy ở **≥ 60fps** trên Desktop và Mobile
- **Không CLS** (Cumulative Layout Shift = 0)
- API response time **< 150ms**
- Test coverage **100% pass** cho toàn bộ business logic
