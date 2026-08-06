# 03 — Bộ Công nghệ (Tech Stack)

## Tổng quan

Bộ công nghệ được chọn lọc kỹ lưỡng để xây dựng các trải nghiệm số **mạnh mẽ, đẹp và hiệu năng cao**.

---

## Frontend Development

**Mô tả**: Xây dựng giao diện người dùng hiện đại, tương tác và tối ưu hiệu năng.

| Công nghệ | Vai trò |
|-----------|---------|
| **React** | Thư viện UI component-based |
| **Next.js** | Framework full-stack với SSR/SSG, API Routes |
| **TypeScript** | Kiểu dữ liệu tĩnh, giảm lỗi runtime |
| **Tailwind CSS** | Utility-first CSS framework, tốc độ cao |
| **Framer Motion** | Animation library — micro-interactions, page transitions |

---

## Creative Coding & 3D

**Mô tả**: Tạo ra các trải nghiệm 3D WebGL và hiệu ứng thị giác độc đáo.

| Công nghệ | Vai trò |
|-----------|---------|
| **Three.js** | Thư viện 3D WebGL nền tảng |
| **React Three Fiber (R3F)** | Three.js trong React ecosystem |
| **WebGL** | Đồ họa GPU-accelerated trực tiếp trên browser |
| **GSAP** | Animation timeline chuyên nghiệp |

**Ví dụ ứng dụng**:
- Nền Particle Field 5.000 hạt chuyển động ở ≥ 60fps
- 3D Hover Tilt Cards tương tác theo con trỏ chuột
- Smooth Scroll quán tính với Lenis

---

## Backend Systems

**Mô tả**: Xây dựng API và logic nghiệp vụ phía server.

| Công nghệ | Vai trò |
|-----------|---------|
| **Node.js** | JavaScript runtime server-side |
| **Express** | Web framework cho REST API |
| **Python** | Scripting, automation, data processing |
| **REST APIs** | Chuẩn giao tiếp HTTP giữa client-server |

---

## Database & Cloud

**Mô tả**: Lưu trữ dữ liệu và triển khai hạ tầng đám mây.

| Công nghệ | Vai trò |
|-----------|---------|
| **PostgreSQL** | Cơ sở dữ liệu quan hệ — production database chính |
| **Neon** | Serverless PostgreSQL trên cloud (provider hiện tại) |
| **MongoDB** | NoSQL database cho dữ liệu phi cấu trúc |
| **Redis** | In-memory cache, tăng tốc query |
| **AWS** | Cloud infrastructure (hosting, storage, compute) |
| **Vercel** | Nền tảng deploy Next.js, CDN toàn cầu |

---

## Design & Collaboration

| Công nghệ | Vai trò |
|-----------|---------|
| **Figma** | Thiết kế UI/UX, prototyping |
| **Framer** | Interactive prototyping |

---

## Tiêu chuẩn kỹ thuật cam kết

- **API Response Time**: < 150ms
- **3D Frame Rate**: ≥ 60fps trên Desktop và Mobile
- **Lighthouse Performance Score**: ≥ 90 điểm
- **Cumulative Layout Shift (CLS)**: 0.0
- **Test Coverage**: 100% pass cho core business logic
