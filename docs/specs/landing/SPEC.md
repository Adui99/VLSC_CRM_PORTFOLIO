# SPEC: Functional Requirements & Behavioral Specification - Public Inbound Landing Page

> **Tài liệu Đặc tả Chức năng & Hành vi - Phân hệ Landing Page**  
> **Phiên bản**: 3.0.0 (Audited Source of Truth Edition)  
> **Mục tiêu**: Định nghĩa yêu cầu chức năng, kịch bản kiểm thử (Acceptance Criteria), quy tắc dữ liệu và xử lý ngoại lệ cho Phân hệ Public Landing Page & 3D WebGL UI Engine.

---

## 1. Functional Requirements (Yêu cầu Chức năng)

### F0: Public Showcase Landing Page & Interactive 3D UI Engine
Phân hệ Landing Page (`/`) cung cấp giao diện giới thiệu thương hiệu và thu hút khách hàng tiềm năng gồm 10 Section nội dung và các linh kiện UI tương tác 3D WebGL:

- **F0.1 Sticky Navigation Bar (`Navbar.tsx`)**:
  - Thanh điều hướng cố định đỉnh trang (`sticky top-0 z-50 backdrop-blur-md`).
  - Hỗ trợ liên kết cuộn mượt (Smooth Scroll) tới các phần nội dung: `#tech-stack`, `#projects`, `#about`, `#contact`.
  - Nút CTA "Đăng ký Tư vấn" kích hoạt Lead Capture Modal (`useModalStore.openModal()`).
- **F0.2 Hero Section & Interactive Terminal (`HeroSection.tsx`, `Terminal.tsx`)**:
  - Hiển thị Tiêu đề chính với hiệu ứng `BlurText` và `TextReveal`.
  - Khung Terminal tương tác mô phỏng dòng lệnh hệ thống giới thiệu năng lực cốt lõi.
- **F0.3 Social Proof & Brand Trust (`TrustBySection.tsx`, `TestimonialsSection.tsx`)**:
  - Lưới/Carousel logo các đối tác tin tưởng và thẻ trích dẫn đánh giá khách hàng.
- **F0.4 Technical Arsenal (`TechStackSection.tsx`)**:
  - Hiển thị danh mục công nghệ kỹ thuật (Frontend, Backend, Database, Cloud) theo dạng thẻ phân loại.
- **F0.5 Portfolio & Selected Works (`ProjectsSection.tsx`, `TiltCard.tsx`)**:
  - Danh mục dự án tiêu biểu tích hợp hiệu ứng nghiêng 3D khi rê chuột (`TiltCard`).
- **F0.6 About, Stats & Experience (`AboutSection.tsx`, `StatsSection.tsx`, `ExperienceSection.tsx`)**:
  - Giới thiệu doanh nghiệp, chỉ số thống kê ấn tượng và mốc thời gian kinh nghiệm (Timeline).
- **F0.7 FAQ Accordion (`FAQSection.tsx`)**:
  - Danh sách câu hỏi thường gặp dạng đóng/mở (Accordion toggle) giải đáp thắc mắc.
- **F0.8 Contact Section & Footer (`ContactSection.tsx`)**:
  - Khối thông tin liên hệ trực tiếp (Email, Điện thoại, Địa chỉ) và nút CTA mở Lead Modal.
- **F0.9 Visual Micro-Animations & Utilities**:
  - `ScrollProgressBar`: Thanh tiến trình cố định mép trên màn hình thể hiện tỷ lệ cuộn trang ($0\% - 100\%$).
  - `LoadingScreen`: Màn hình chờ chuyển cảnh hoạt họa khi mới tải trang (`useLoadingStore`).
  - `ShimmerButton` / `MagneticButton`: Nút bấm phát sáng và lực hút nam châm theo con trỏ chuột.
- **F0.10 3D WebGL Background Particle Field (`Scene3D.tsx`)**:
  - Khung cảnh 3D WebGL chạy ngầm cố định toàn màn hình (`z-0 pointer-events-none`) sử dụng `@react-three/fiber` & `@react-three/drei`.
  - Tạo trường hạt không gian 5.000 hạt xoay tự động theo trục X và Y với màu Amber `#ffb703`.
- **F0.11 Inertial Smooth Scrolling Engine (`SmoothScroll.tsx`)**:
  - Tích hợp thư viện `@studio-freight/lenis` bọc quanh toàn bộ nội dung trang web.
  - Cung cấp trải nghiệm cuộn chuột quán tính mượt mà với hàm Easing mũ $1.001 - 2^{-10t}$ và vòng lặp `requestAnimationFrame`.

---

### F1: Inbound Lead Capture Form & Corporate Email Badge

- **F1.1 Real-time Corporate Email Domain Badge**:
  - Tự động kiểm tra Email Domain theo thời gian thực (Real-time).
  - Thuật toán `isCorporateEmail`: Cắt chuỗi sau ký tự `@`, so sánh với danh sách email miễn phí (`gmail.com`, `yahoo.com`, `hotmail.com`, `outlook.com`, `icloud.com`, `protonmail.com`).
  - Nếu Domain KHÔNG thuộc danh sách miễn phí $\rightarrow$ Lập tức hiển thị badge **`🏢 Email Công ty`** màu Amber.
- **F1.2 Multi-Select Services Grid**:
  - Cho phép tích chọn danh sách dịch vụ quan tâm (Web Development, Mobile App, AI Integration, Cloud Systems, UI/UX Design).
- **F1.3 Google Apps Script Dual Webhook Fallback**:
  - Khi nộp Form trên Landing Page Modal, ngoài việc đẩy dữ liệu về CRM API (`/api/crm/leads`), hệ thống đồng thời kích hoạt lệnh `fetch()` bất đồng bộ gửi JSON payload tới Google Apps Script Webhook (`mode: 'no-cors'`) để sao lưu dữ liệu lên Google Sheets.
- **F1.4 Auto Deal Value Estimation**:
  - Tự động tính toán sơ bộ Deal Value gửi kèm: `dealValue = selectedServices.length * 8000` (hoặc default `$15,000` nếu không tích chọn dịch vụ nào).

---

## 2. User Stories & Acceptance Criteria (Dạng Given / When / Then)

### US-00: Landing Page 3D Experience & Exploration
```gherkin
Scenario: Trải nghiệm Nền 3D Particle Field & Lenis Smooth Scroll
  Given Khách hàng mở trang chủ Landing Page (/)
  When Trang web nạp tài nguyên hoàn tất
  Then Màn hình LoadingScreen mờ dần biến mất
  And Khung cảnh 3D WebGL Scene3D tự động xoay 5.000 hạt màu Amber #ffb703 mượt mà ở tốc độ 60fps
  And Khi khách hàng cuộn chuột, thư viện Lenis điều khiển cuộn quán tính mượt mà với thanh ScrollProgressBar tăng từ 0% đến 100%
```

### US-01: Inbound Lead Submission with Corporate Email Badge
```gherkin
Scenario: Nhập Email Công ty và gửi yêu cầu thành công
  Given Khách hàng đang mở Lead Capture Modal trên Landing Page
  When Khách hàng nhập email "director@techfirm.io"
  Then Badge "🏢 Email Công ty" xuất hiện màu Amber cạnh ô nhập email
  When Khách hàng chọn dịch vụ "AI Integration" & "Cloud Systems" và nhấn "Đăng ký"
  Then Hệ thống gửi POST /api/crm/leads thành công
  And Đồng thời gửi async fetch tới Google Apps Script Webhook sao lưu lên Google Sheets
  And Modal đóng lại và hiển thị thông báo Toast "Đăng ký tư vấn thành công!"
```

---

## 3. Edge Cases & Error Handling (Trường hợp Biên & Xử lý Lỗi)

| Tình huống / Mã lỗi | Nguyên nhân | Hành vi Xử lý của Hệ thống |
| :--- | :--- | :--- |
| **Google Webhook Network Timeout** | Mạng kết nối tới Google Apps Script bị tắc nghẽn hoặc ngắt ngầm. | Lệnh `fetch()` chạy bất đồng bộ với `mode: 'no-cors'` và `.catch()`, hoàn toàn không ảnh hưởng tới tiến trình lưu Lead chính vào CRM API. |
| **Bỏ trống các trường bắt buộc** | Khách hàng bấm Đăng ký mà không nhập Họ tên hoặc Email. | Form chặn gửi, viền ô nhập đổi màu đỏ và hiển thị thông báo "Vui lòng điền đầy đủ họ tên và email". |
| **Nhập Email Sai Định dạng** | Nhập email không chứa ký tự `@` hoặc domain không hợp lệ. | Hiển thị cảnh báo lỗi định dạng email bên dưới ô input. |
| **Mất kết nối Internet khi gửi Form** | Thiết bị người dùng ngắt mạng khi bấm Đăng ký. | Trả về thông báo "Không thể kết nối máy chủ. Vui lòng kiểm tra lại đường truyền mạng". |
