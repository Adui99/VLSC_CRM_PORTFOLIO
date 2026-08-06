# DESIGN: UI/UX, Logic & Visual Feedback Specification - Public Inbound Landing Page

> **Tài liệu Thiết kế Giao diện & Tương tác - Phân hệ Landing Page**  
> **Phiên bản**: 3.0.0 (Audited Source of Truth Edition)  
> **Mục tiêu**: Chuẩn hóa toàn bộ hệ thống thiết kế (Design Tokens), hiệu ứng 3D WebGL, cuộn mượt Lenis, micro-animations và phản hồi thị giác trên Landing Page.

---

## 1. Core Design Tokens (Bảng màu & Typography Landing Page)

- **Background Palette**: Zinc-950 (`#09090b`) làm tông màu chủ đạo tối sang trọng.
- **Surface & Cards**: Zinc-900 (`#18181b`) phối viền siêu mảnh `border-white/10` kết hợp hiệu ứng kính mờ Backdrop Blur (`backdrop-blur-md`).
- **Primary Accent Colors**: Amber-500 (`#f59e0b`) và Amber-400 (`#fbbf24`) cho các điểm nhấn CTA, badge Email Công ty và hạt 3D Particles (`#ffb703`).
- **Typography**: Phông chữ Sans-serif hiện đại với Slate-50 cho chữ chính trên Dark Mode và Slate-400 cho phụ đề.

---

## 2. 3D WebGL & Micro-Animation Specifications

| Linh kiện UI | File Mã nguồn | Mô tả Hiệu ứng & Thông số Tương tác |
| :--- | :--- | :--- |
| **Scene3D (3D Canvas)** | `Scene3D.tsx` | Khung cảnh Three.js fixed toàn màn hình (`z-0 pointer-events-none`). Tạo 5.000 hạt `PointMaterial` màu `#ffb703`, bán kính 1.5, xoay tự động trong `useFrame` (`rotation.x -= delta/10`, `rotation.y -= delta/15`). |
| **SmoothScroll (Lenis)** | `SmoothScroll.tsx` | Bọc toàn bộ trang với `@studio-freight/lenis` (`duration: 1.2`, `easing: t => Math.min(1, 1.001 - 2^(-10t))`, `touchMultiplier: 2`), cuộn mượt quán tính với vòng lặp `requestAnimationFrame`. |
| **ScrollProgressBar** | `ScrollProgressBar.tsx` | Thanh tiến trình cố định mép trên màn hình (`fixed top-0 left-0 right-0 z-50 h-1 bg-amber-500`), tự động mở rộng từ $0\%$ đến $100\%$ theo tỷ lệ cuộn. |
| **LoadingScreen** | `LoadingScreen.tsx` | Màn hình chờ phủ toàn màn hình (`z-[100]`), hiển thị phần trăm nạp tài nguyên và hiệu ứng biến mất (Fade out) khi hoàn tất. |
| **TiltCard (3D Hover)** | `TiltCard.tsx` | Thẻ dự án nghiêng 3D theo con trỏ chuột dựa trên góc tính toán $rotateX$ và $rotateY$ từ tâm thẻ. |
| **ShimmerButton** | `ShimmerButton.tsx` | Nút bấm chứa dải sáng quét liên tục (`shimmer animation`), tăng sức thu hút CTA. |
| **MagneticButton** | `MagneticButton.tsx` | Nút bấm dịch chuyển nhẹ theo lực hút con trỏ chuột khi rê gần vùng nút. |
| **BlurText / TextReveal** | `BlurText.tsx`, `TextReveal.tsx` | Hiệu ứng chữ xuất hiện từ độ mờ (Blur 10px $\rightarrow$ 0px) và cuộn từ dưới lên cho tiêu đề Hero. |
| **ScrambleText** | `ScrambleText.tsx` | Hiệu ứng mã hóa/giải mã ký tự ngẫu nhiên khi hover vào văn bản kỹ thuật. |

---

## 3. Section Hierarchy & Visual Flow

```mermaid
graph TD
    Home[app/page.tsx - Home Page] --> Scene3D
    Home --> SmoothScroll
    SmoothScroll --> ScrollProgressBar
    SmoothScroll --> LoadingScreen
    SmoothScroll --> LeadModal
    SmoothScroll --> Navbar
    
    subgraph Content Layers (relative z-10)
        SmoothScroll --> HeroSection
        SmoothScroll --> TrustBySection
        SmoothScroll --> TechStackSection
        SmoothScroll --> AboutSection
        SmoothScroll --> StatsSection
        SmoothScroll --> ExperienceSection
        SmoothScroll --> ProjectsSection
        SmoothScroll --> TestimonialsSection
        SmoothScroll --> FAQSection
        SmoothScroll --> ContactSection
    end

    Navbar -->|Click Đăng ký Tư vấn| LeadModal
    HeroSection -->|Click CTA| LeadModal
    ContactSection -->|Click CTA| LeadModal
```

---

## 4. Real-time Corporate Email Visual Feedback Badge

- **Thuật toán Real-time**: Khi người dùng gõ vào ô input email trong `LeadModal.tsx`:
  1. Cắt chuỗi lấy Domain sau ký tự `@` và chuyển thành chữ thường (`domain.toLowerCase().trim()`).
  2. Đối soát với danh sách `FREE_EMAIL_DOMAINS` (`gmail.com`, `yahoo.com`, `hotmail.com`, `outlook.com`, `icloud.com`, `protonmail.com`).
  3. Nếu domain không nằm trong danh sách miễn phí $\rightarrow$ Trả về `true` (Corporate Email).
- **Phản hồi Thị giác (UI Badge)**:
  - Khi `isCorporateEmail === true`: Hiển thị badge **`🏢 Email Công ty`** nổi bật với màu Amber (`bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded text-xs`).
