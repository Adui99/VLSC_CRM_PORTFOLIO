# RULE: Engineering & Performance Standards - Public Inbound Landing Page

> **Tài liệu Quy chuẩn Kỹ thuật & Hiệu năng - Phân hệ Landing Page**  
> **Phiên bản**: 3.0.0 (Audited Source of Truth Edition)  
> **Mục tiêu**: Thiết lập các quy tắc bắt buộc về lập trình, thiết kế 3D WebGL, tối ưu hiệu năng và quy trình phát triển cho các kỹ sư và trợ lý AI khi làm việc trên Landing Page.

---

## 1. 3D WebGL Isolation & Performance Rules

1. **3D Canvas Isolation**:
   - Component 3D WebGL (`Scene3D.tsx`) bắt buộc phải bọc trong `<Suspense fallback={null}>` và đặt thuộc tính CSS pointer events none (`pointer-events-none z-0`) để không cản trở tương tác chuột của các lớp DOM bên trên.
2. **GPU-Accelerated Animations & Lenis Scroll**:
   - Tất cả hiệu ứng chuyển động (Framer Motion, 3D Tilt Card) và Lenis Smooth Scroll phải duy trì tốc độ khung hình $\ge 60\text{fps}$.
3. **Zero Cumulative Layout Shift (CLS = 0)**:
   - Các hiệu ứng biến đổi văn bản (`BlurText`, `ScrambleText`, `TextReveal`) không được làm thay đổi kích thước khung bao (Bounding Box) gây giật lag giao diện.
4. **Responsive Mobile-First Breakdown**:
   - Tất cả các Section trên Landing Page (đặc biệt là 3D Project Cards và Tech Stack Grid) phải tự động co giãn từ 1 cột trên Mobile (`grid-cols-1`) sang 2-3 cột trên Desktop (`md:grid-cols-2 lg:grid-cols-3`).

---

## 2. Inbound Lead Modal & Webhook Rules

1. **Non-blocking Webhook Execution**:
   - Lệnh gọi Google Apps Script Webhook sao lưu phải luôn chạy ở chế độ bất đồng bộ non-blocking (`fetch().catch(...)`) với `mode: 'no-cors'` để sự cố mạng bên thứ ba không làm gián đoạn tiến trình gửi Lead chính vào CRM API.
2. **Real-time Input Feedback**:
   - Logic kiểm tra Email Domain (`isCorporateEmail`) phải chạy tức thì trong sự kiện `onChange` mà không gây re-render dư thừa toàn bộ Modal.

---

## 3. Surgical Changes & Simplicity First for AI Agents

1. **Surgical Changes (Chỉnh sửa Chính xác Như Phẫu thuật)**:
   - AI chỉ chỉnh sửa đúng vị trí mã nguồn phục vụ cho yêu cầu của người dùng. Không tự ý refactor hoặc thay đổi định dạng của các section Landing Page không liên quan.
   - Dọn dẹp sạch các `import` dư thừa nếu xóa bớt component UI.
2. **Simplicity First (Ưu tiên Sự Tối giản)**:
   - Viết lượng mã tối thiểu để giải quyết vấn đề. Không thêm các lớp trừu tượng hóa (Abstractions) cho mã nguồn chỉ dùng 1 lần trên Landing Page.
