# Knowledge Base — AI Chatbot Tư vấn

## Mục đích

Bộ tài liệu này phục vụ làm **knowledge base** cho AI chatbot tư vấn khách hàng tiềm năng (Prospect) trên Landing Page.

**Đối tượng phục vụ**: Khách hàng B2B/B2C ghé thăm website, cần tìm hiểu dịch vụ, quy trình, báo giá và cách liên hệ.

**Ngôn ngữ**: Tiếng Việt

---

## Cấu trúc files

| File | Chủ đề | Dùng khi hỏi về |
|------|--------|----------------|
| `01_company_overview.md` | Tổng quan doanh nghiệp | Giới thiệu, triết lý, stats, lịch sử, đối tác |
| `02_services.md` | Dịch vụ | 5 dịch vụ cốt lõi, phù hợp với ai, ví dụ |
| `03_tech_stack.md` | Công nghệ | Bộ công nghệ, giải thích từng nhóm |
| `04_portfolio.md` | Dự án tiêu biểu | 4 dự án, testimonials, đặc điểm |
| `05_process_timeline.md` | Quy trình & Thời gian | 4 giai đoạn, timeline ước tính, chuẩn bị |
| `06_lead_form_guide.md` | Form liên hệ | Cách điền, các trường, lead scoring |
| `07_faq.md` | Câu hỏi thường gặp | Quy trình, công nghệ, báo giá, hợp tác |

---

## Hướng dẫn sử dụng

### Với RAG (Retrieval-Augmented Generation)

1. **Chunk theo section H2/H3** — Mỗi heading `##` hoặc `###` là 1 chunk độc lập
2. **Metadata gợi ý**: `{ file, section_title, topic }`
3. **Similarity threshold**: 0.75+ cho kết quả chính xác
4. **Số chunks trả về**: Top 3–5 chunks là đủ cho 1 câu hỏi

### System Prompt gợi ý cho chatbot

```
Bạn là trợ lý tư vấn của [Tên doanh nghiệp] — chuyên gia thiết kế và phát triển trải nghiệm số cao cấp.

Nhiệm vụ: Tư vấn khách hàng về dịch vụ, quy trình làm việc, timeline và hướng dẫn liên hệ.

Quy tắc:
- Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp
- Chỉ trả lời dựa trên thông tin trong knowledge base
- Nếu không có thông tin, hướng khách hàng điền form liên hệ
- Luôn kết thúc bằng CTA: hướng khách hàng đến form tư vấn
- Không bịa thông tin về báo giá cụ thể — hướng khách hàng điền form để nhận báo giá chính xác
```

---

## Cập nhật

Khi cần cập nhật knowledge base (thêm dịch vụ, thay đổi timeline, v.v.):
1. Chỉnh sửa file `.md` tương ứng
2. Re-index nếu đang dùng vector database
3. Không xóa file — chỉ sửa nội dung bên trong

---

## Nguồn dữ liệu

Toàn bộ knowledge base được trích xuất từ codebase dự án:
- `src/features/landing/components/` — Nội dung Landing Page
- `src/features/crm/utils/calculateLeadScore.ts` — Logic chấm điểm lead
- `src/features/crm/types/crm.ts` — Định nghĩa kiểu dữ liệu
- `docs/specs/landing/PRD.md` — Product Requirements
- `docs/specs/crm/PRD.md` — CRM Requirements
